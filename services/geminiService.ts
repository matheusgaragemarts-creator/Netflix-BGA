
import { GoogleGenAI, Type } from "@google/genai";

// Always use the process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuizFromContent = async (title: string, description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a professional barbershop training quiz based on this content: 
      Title: ${title}
      Description: ${description}
      Return a JSON with 3 multiple choice questions.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctAnswer: { type: Type.INTEGER, description: "Index 0-3" }
                },
                required: ["text", "options", "correctAnswer"]
              }
            }
          },
          required: ["questions"]
        }
      }
    });
    
    // Access response.text property directly without calling it as a function
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
