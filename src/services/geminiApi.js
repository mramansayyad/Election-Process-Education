import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are an expert on the Indian Constitution, Indian electoral law, and the Election Commission of India (ECI) guidelines.

Your role is to explain complex Indian election terms, legal jargon, and ECI procedures in simple, accessible English at a 6th-grade reading level.

Rules:
1. Always ground your explanation in Indian Constitutional provisions (e.g., Articles 324–329) or ECI guidelines where relevant.
2. Where a Hindi equivalent exists for the term, provide it in parentheses (e.g., "Voter ID / मतदाता पहचान पत्र").
3. Keep the explanation to 3–5 short sentences or a brief numbered list. Be concise.
4. If the user's state is provided, mention state-specific context if it is highly relevant.
5. Never provide partisan, political, or biased opinions about parties, candidates, or election outcomes.
6. If the term relates to ECI portals (voters.eci.gov.in, cvigil.eci.gov.in, etc.), mention the relevant portal name.`;

/**
 * AI Jargon Buster Service with Defensive Programming (Retry + Validation)
 */
export const getGeminiBuster = async (term, context = {}, onStream) => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!API_KEY || API_KEY === 'undefined' || API_KEY === '') {
    throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your environment.");
  }

  // Using v1 production gateway for Gemini 3 Flash
  const genAI = new GoogleGenerativeAI(API_KEY, { apiVersion: "v1" });
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  const safeContext = context || {};
  const prompt = `Explain the following Indian election term or concept:
Term: "${term}"
User's State: ${safeContext.stateCode || safeContext.state || 'Not specified'}
User's PIN Code: ${safeContext.pinCode || 'Not specified'}
Provide a clear, simple explanation suitable for a first-time Indian voter. Include the Hindi translation of the term if applicable.`;

  // Retry Logic with Exponential Backoff
  const maxRetries = 2;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
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
      console.warn(`Gemini API Attempt ${attempt + 1} failed:`, error);
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }

  throw new Error("Unable to connect to the AI service after multiple attempts.");
};
