import { GoogleGenAI } from "@google/genai";
export const maxDuration = 60;

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { personalInfo, education, experience, skills, jobDetails } = data;

    if (!jobDetails) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Job details are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create a prompt for the AI - updated to explicitly request English output
    const prompt = `
    Act as a professional CV optimization expert. I need you to tailor my CV for a specific job. 
    The CV should be in English regardless of any input language.
    
    MY CURRENT CV:
    Personal Information:
    - Name: ${personalInfo.fullName || "Not specified"}
    - Current position: ${personalInfo.position || "Not specified"}
    - Location: ${personalInfo.location || "Not specified"}
    - Email: ${personalInfo.email || "Not specified"}
    - Phone: ${personalInfo.phone || "Not specified"}
    - Summary: ${personalInfo.summary || "Not specified"}
    
    Skills:
    ${
      skills?.length > 0
        ? skills.map((skill) => `- ${skill}`).join("\n")
        : "No skills listed"
    }
    
    Education:
    ${
      education?.length > 0
        ? education
            .map(
              (edu) =>
                `- ${edu.degree || "Degree"} at ${
                  edu.institution || "Institution"
                }, ${edu.startDate || ""} - ${edu.endDate || ""}`
            )
            .join("\n")
        : "No education listed"
    }
    
    Experience:
    ${
      experience?.length > 0
        ? experience
            .map(
              (exp) =>
                `- ${exp.title || "Position"} at ${exp.company || "Company"}, ${
                  exp.startDate || ""
                } - ${exp.endDate || ""}\n  ${exp.description || ""}`
            )
            .join("\n")
        : "No experience listed"
    }
    
    THE JOB I'M APPLYING FOR:
    - Title: ${jobDetails.title}
    - Company: ${jobDetails.company}
    - Category: ${jobDetails.category}
    - Tags: ${jobDetails.tags?.join(", ") || "None"}
    - Description: ${jobDetails.description}
    
    Requirements:
    ${
      jobDetails.requirements?.length > 0
        ? jobDetails.requirements.map((req) => `- ${req}`).join("\n")
        : "No specific requirements listed"
    }
    
    Responsibilities:
    ${
      jobDetails.responsibilities?.length > 0
        ? jobDetails.responsibilities.map((resp) => `- ${resp}`).join("\n")
        : "No specific responsibilities listed"
    }
    
    YOUR TASK:
    Please optimize my CV for this job by:
    1. Improving my summary to match the job requirements and highlight relevant experience
    2. Highlighting and rephrasing relevant skills, adding any that would be relevant based on my experience
    3. Re-ordering and emphasizing relevant experience
    4. Making sure all content is professional and in English
    5. Ensuring the CV is tailored specifically for the job requirements
    
    IMPORTANT: All dates must be formatted as YYYY-MM (for example, "2022-05" for May 2022).
    
    Return only a JSON object with the optimized CV data in this format:
    {
      "personalInfo": {
        "fullName": "...",
        "position": "...",
        "location": "...",
        "email": "...",
        "phone": "...",
        "linkedin": "...",
        "github": "...",
        "summary": "..."
      },
      "skills": ["skill1", "skill2", "..."],
      "experience": [
        {
          "title": "...",
          "company": "...",
          "location": "...",
          "startDate": "YYYY-MM",
          "endDate": "YYYY-MM",
          "description": "..."
        }
      ],
      "education": [
        {
          "degree": "...",
          "institution": "...",
          "location": "...",
          "startDate": "YYYY-MM",
          "endDate": "YYYY-MM",
          "description": "..."
        }
      ]
    }
    
    The JSON must be valid and parsable, with no explanation text before or after.
    `;

    // Use the same API approach as your other route.tsx file
    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      contents: prompt,
    });

    // Get the text from the response
    const text = response.text || response.toString();

    // Parse the JSON response
    try {
      // Extract JSON from the response if it's wrapped in markdown code blocks
      let jsonText = text;
      if (text.includes("```json")) {
        jsonText = text.split("```json")[1].split("```")[0].trim();
      } else if (text.includes("```")) {
        jsonText = text.split("```")[1].split("```")[0].trim();
      }

      const optimizedCV = JSON.parse(jsonText);

      return new Response(
        JSON.stringify({
          success: true,
          data: optimizedCV,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (jsonError) {
      console.error("Failed to parse AI response:", jsonError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to parse AI response",
          rawResponse: text,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("CV optimization error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: (error as Error).message || "Something went wrong",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
