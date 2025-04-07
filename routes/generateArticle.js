import { GoogleGenAI } from "@google/genai";

export default async function generateArticle(req, res) {
  try {
    const { transcript } = req.body;
    const contents = `Using the following transcript of a YouTube video, generate a comprehensive blog article that includes an introduction, main points, and a conclusion. The article should be engaging and clearly summarize the video's content:\n\n${transcript}`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: contents,
    });

    res.status(200).json({ article: response.text });
  } catch (error) {
    console.error("Error generating article:", error);
    res.status(500).json({ error: "Failed to generate article." });
  }
}
