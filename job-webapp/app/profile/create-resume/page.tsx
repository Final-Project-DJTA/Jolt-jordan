"use client";

// Add dynamic export to prevent static generation
export const dynamic = "force-dynamic";

import { ChangeEvent, useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import type { JobType } from "@/types";
import { toast } from "@/hooks/use-toast";

export default function CreateResume() {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/bookmarks`);
      const data = await res.json();

      const jobList = Array.isArray(data) ? data.map((item) => item.job) : [];
      setJobs(jobList);
    } catch (err) {
      console.error("Failed to fetch bookmarks:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    location: "",
    email: "",
    summary: "",
    phone: "",
    linkedin: "",
    github: "",
  });

  const [education, setEducation] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [activeJobForCV, setActiveJobForCV] = useState<JobType | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/profile", {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            return;
          }
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.profile) {
          const {
            personalInfo = {},
            education = [],
            experience = [],
            skills = [],
          } = data.profile;

          setEducation(Array.isArray(education) ? education : []);
          setExperience(Array.isArray(experience) ? experience : []);
          setSkills(Array.isArray(skills) ? skills : []);

          setFormData({
            name: personalInfo?.fullName || data.name || "",
            position: data.profile?.jobPosition || "",
            summary: personalInfo?.summary || "",
            location: personalInfo?.location || data.profile?.location || "",
            email: personalInfo?.email || data.email || "",
            phone: personalInfo?.phone || "",
            linkedin: personalInfo?.linkedin || "",
            github: personalInfo?.github || personalInfo?.website || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
    fetchBookmarks();
  }, []);

  const handleDownloadPDF = () => {
    const element = document.getElementById("cv-section");
    if (!element) return;

    import("html2pdf.js").then((html2pdfModule) => {
      const html2pdf = html2pdfModule.default || html2pdfModule;

      const fileName = formData?.name
        ? formData.name.replace(/\s+/g, "_")
        : "Resume";

      const opt = {
        margin: 0.3,
        filename: `${fileName}_Resume.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      html2pdf().set(opt).from(element).save();
    });
  };

  const handleGenerateCV = async (job: JobType) => {
    try {
      setIsGenerating(true);
      setGenerationError("");
      setActiveJobForCV(job);

      const cvData = {
        personalInfo: {
          fullName: formData.name,
          position: formData.position,
          location: formData.location,
          email: formData.email,
          phone: formData.phone,
          linkedin: formData.linkedin,
          github: formData.github,
          summary: formData.summary,
        },
        education,
        experience,
        skills,
        jobDetails: {
          id: job._id,
          title: job.name,
          company: job.company.name,
          description: job.description,
          requirements: job.detail?.requirements || [],
          responsibilities: job.detail?.responsibilities || [],
          category: job.category,
          tags: job.tags,
        },
      };

      const response = await fetch("/api/gemini-ai/optimize-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cvData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        const optimizedData = result.data;

        setFormData({
          name: optimizedData.personalInfo.fullName || formData.name,
          position: optimizedData.personalInfo.position || formData.position,
          location: optimizedData.personalInfo.location || formData.location,
          email: optimizedData.personalInfo.email || formData.email,
          summary: optimizedData.personalInfo.summary || formData.summary,
          phone: optimizedData.personalInfo.phone || formData.phone,
          linkedin: optimizedData.personalInfo.linkedin || formData.linkedin,
          github: optimizedData.personalInfo.github || formData.github,
        });

        if (optimizedData.skills && Array.isArray(optimizedData.skills)) {
          setSkills(optimizedData.skills);
        }

        if (
          optimizedData.experience &&
          Array.isArray(optimizedData.experience)
        ) {
          setExperience(optimizedData.experience);
        }

        if (optimizedData.education && Array.isArray(optimizedData.education)) {
          setEducation(optimizedData.education);
        }

        toast({
          title: "CV Optimized Successfully",
          description: `Your CV has been tailored for the ${job.name} position at ${job.company.name}.`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("CV generation error:", error);
      setGenerationError("Failed to generate optimized CV. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToProfile = async () => {
    try {
      setIsSaving(true);

      const profileData = {
        personalInfo: {
          fullName: formData.name,
          position: formData.position,
          location: formData.location,
          email: formData.email,
          phone: formData.phone,
          linkedin: formData.linkedin,
          github: formData.github,
          summary: formData.summary,
        },
        education,
        experience,
        skills,
        jobPosition: formData.position,
      };

      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`);
      }

      toast({
        title: "Profile Updated",
        description: "Your CV data has been saved to your profile successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving to profile:", error);
      toast({
        title: "Error",
        description: "Failed to save CV data to your profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    try {
      if (dateString.includes("-")) {
        const [year, month] = dateString.split("-");
        if (year && month) {
          const date = new Date(parseInt(year), parseInt(month) - 1);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            });
          }
        }
      } else if (dateString.includes("/")) {
        const parts = dateString.split("/");
        if (parts.length >= 2) {
          const date = new Date(parts.join("/"));
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            });
          }
        }
      } else {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });
        }
      }

      return dateString;
    } catch (e) {
      console.warn("Date parsing error:", e);
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {/* Loading Overlay */}
      {(isGenerating || isSaving) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Spinner size="lg" className="mb-4" />
            <h3 className="text-xl font-medium">
              {isGenerating ? "Optimizing your CV..." : "Saving to profile..."}
            </h3>
            <p className="text-gray-500 mt-2">
              {isGenerating
                ? "Our AI is tailoring your CV for the selected job position."
                : "Updating your profile data with the current CV information."}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-start justify-center min-h-screen bg-gray-100 p-8 gap-4 w-full">
        {/* CV Section */}
        <div
          id="cv-section"
          className="bg-white shadow-md rounded-lg p-8 flex-1 min-h-screen mb-2"
        >
          {/* Header */}
          <div className="text-center border-b pb-4">
            <h1 className="text-3xl font-bold">
              {formData.name || "Your Name"}
            </h1>
            <h2 className="text-xl text-gray-600">
              {formData.position || "Your Position"}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {formData.location && `${formData.location} • `}
              {formData.email && `${formData.email} • `}
              {formData.phone}
            </p>
            <p className="text-sm text-gray-500">
              {formData.linkedin && (
                <>
                  <a
                    href={
                      formData.linkedin.startsWith("http")
                        ? formData.linkedin
                        : `https://www.linkedin.com/in/${formData.linkedin}`
                    }
                    className="text-blue-500"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>{" "}
                  •{" "}
                </>
              )}
              {formData.github && (
                <a
                  href={
                    formData.github.startsWith("http")
                      ? formData.github
                      : `https://github.com/${formData.github}`
                  }
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              )}
            </p>
          </div>

          {/* Summary */}
          {formData.summary && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Summary</h3>
              <p className="text-sm text-gray-700">{formData.summary}</p>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold border-b mb-2">Education</h3>
              {education.map((edu, index) => (
                <div key={index} className="text-sm text-gray-700 mb-4">
                  <div className="flex justify-between">
                    <span>{edu.degree || "Degree"}</span>
                    <span>
                      {edu.startDate && formatDate(edu.startDate)}
                      {edu.startDate && edu.endDate && " - "}
                      {edu.endDate && formatDate(edu.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{edu.institution || "Institution"}</span>
                    <span>{edu.location || ""}</span>
                  </div>
                  {edu.description && <p className="mt-2">{edu.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold border-b mb-2">
                Work Experience
              </h3>
              {experience.map((exp, index) => (
                <div key={index} className="text-sm text-gray-700 mb-4">
                  <div className="flex justify-between">
                    <span>
                      {exp.title && exp.company
                        ? `${exp.title} - ${exp.company}`
                        : exp.title || exp.company || "Position"}
                    </span>
                    <span>
                      {exp.startDate && formatDate(exp.startDate)}
                      {exp.startDate && exp.endDate && " - "}
                      {exp.endDate && formatDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{exp.location || ""}</span>
                  </div>
                  {exp.description && <p className="mt-1">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold border-b mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2 text-sm">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bookmark Sidebar */}
        <div className="bg-white shadow-md rounded-lg p-6 w-3/12 min-h-screen">
          <h2 className="text-lg font-bold mb-2">Resume Preview</h2>
          <p className="text-sm text-gray-500 mb-4">
            This is a live preview of your resume based on your profile data.
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium">Personal Information</h3>
              <ul className="text-sm text-gray-600">
                <li>Name: {formData.name || "Not provided"}</li>
                <li>Position: {formData.position || "Not provided"}</li>
                <li>Location: {formData.location || "Not provided"}</li>
                <li>Email: {formData.email || "Not provided"}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-md font-medium">Data Summary</h3>
              <ul className="text-sm text-gray-600">
                <li>Education entries: {education.length}</li>
                <li>Experience entries: {experience.length}</li>
                <li>Skills: {skills.length}</li>
              </ul>
            </div>
          </div>
          <h2 className="text-lg font-bold mb-2 mt-4"> Your Bookmark</h2>
          <div>
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-gray-100 p-4 rounded-lg shadow-md mb-4"
              >
                <h3 className="text-md font-medium">{job.company.name}</h3>
                <p className="text-sm text-gray-600">{job.company.headquarters}</p>
                <div className="mt-1 mb-2 text-xs text-gray-500">{job.name}</div>
                <button
                  onClick={() => handleGenerateCV(job)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-300 ease-in-out mt-2"
                  disabled={isGenerating}
                >
                  {isGenerating && job._id === activeJobForCV?._id ? (
                    <>
                      <span className="inline-block animate-pulse mr-2">⟳</span>
                      Generating...
                    </>
                  ) : (
                    "Generate CV"
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-4 mb-4">
        <button
          onClick={handleSaveToProfile}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
          disabled={isSaving || isGenerating}
        >
          {isSaving ? (
            <>
              <span className="inline-block animate-spin mr-2">⟳</span>
              Saving...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              Save to Profile
            </>
          )}
        </button>
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          disabled={isSaving || isGenerating}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download PDF
        </button>
      </div>
    </>
  );
}
