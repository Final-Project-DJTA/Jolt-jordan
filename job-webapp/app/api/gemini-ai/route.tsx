import { GoogleGenAI } from "@google/genai";
export const maxDuration = 60; // 1 day
// import pdfParse from "pdf-parse";
// import { PdfReader } from "pdfreader";
// import fs from "fs";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    console.log(file, "<<<< file");

    if (!file) {
      return new Response(
        JSON.stringify({ success: false, error: "File is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Membaca file PDF
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log(buffer);

    const pdfData = await pdfParse(buffer);
    const extractedText = pdfData.text;
    console.log(extractedText, "<<<< pdf text");

    if (!extractedText) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to extract text from PDF",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Kirim teks ke AI untuk dianalisis
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Analyze this CV and provide feedback in percentage: ${extractedText}`,
    });

    return new Response(
      JSON.stringify({ success: true, data: { analysis: response.text } }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: (error as Error).message || "Something went wrong",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
