import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = `You are a "Civic Education Expert". Your goal is to explain complex election terms, jargon, or laws in "plain English" at a 6th-grade reading level. 
Keep explanations concise, neutral, and easy to understand. 
If the user's state is provided, mention any state-specific nuances if they are highly relevant to the term.
Format the output as a single, clear paragraph or a brief bulleted list if necessary.
Avoid partisan language or bias.`;

export const getGeminiBuster = async (term, context = {}, onStream) => {
  if (!API_KEY) {
    throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-3-flash",
    systemInstruction: SYSTEM_PROMPT 
  });

  const prompt = `Term/Context to explain: "${term}"
  User State: ${context.state || 'Unknown'}
  User Zip Code: ${context.zipCode || 'Unknown'}
  
  Explain this term in a way that is accessible and helpful for a voter.`;

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
    throw new Error("I'm having trouble connecting to my AI brain right now. Please try again in a moment.");
  }
};
