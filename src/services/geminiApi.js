import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = `You are an expert on the Indian Constitution, Indian electoral law, and the Election Commission of India (ECI) guidelines.

Your role is to explain complex Indian election terms, legal jargon, and ECI procedures in simple, accessible English at a 6th-grade reading level.

Rules:
1. Always ground your explanation in Indian Constitutional provisions (e.g., Articles 324–329) or ECI guidelines where relevant.
2. Where a Hindi equivalent exists for the term, provide it in parentheses (e.g., "Voter ID / मतदाता पहचान पत्र").
3. Keep the explanation to 3–5 short sentences or a brief numbered list. Be concise.
4. If the user's state is provided, mention state-specific context if it is highly relevant.
5. Never provide partisan, political, or biased opinions about parties, candidates, or election outcomes.
6. If the term relates to ECI portals (voters.eci.gov.in, cvigil.eci.gov.in, etc.), mention the relevant portal name.`;

export const getGeminiBuster = async (term, context = {}, onStream) => {
  if (!API_KEY) {
    throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your environment.");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  const prompt = `Explain the following Indian election term or concept:

Term: "${term}"
User's State: ${context.stateCode || context.state || 'Not specified'}
User's PIN Code: ${context.pinCode || 'Not specified'}

Provide a clear, simple explanation suitable for a first-time Indian voter. Include the Hindi translation of the term if applicable.`;

  try {
    const result = await model.generateContentStream(prompt);

    let fullText = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      if (onStream) onStream(fullText);
    }

    return fullText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Unable to connect to the AI service right now. Please try again in a moment.");
  }
};
