// pages/api/ai-summarize.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { text } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'text' field." });
  }

  try {
    // Instantiate the OpenAI client with your API key
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // from .env
    });

    // Call the Chat Completion endpoint (gpt-3.5-turbo, etc.)
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You summarize text very concisely." },
        { role: "user", content: `Please summarize: ${text}` },
      ],
    });

    const summary = response.choices[0].message?.content || "No summary";
    return res.status(200).json({ summary });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return res.status(500).json({ error: "Failed to summarize with AI" });
  }
}
