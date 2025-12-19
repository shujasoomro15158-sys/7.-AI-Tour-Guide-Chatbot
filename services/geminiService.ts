
import { GoogleGenAI, Type } from "@google/genai";
import { CityInfo } from "../types";

const SYSTEM_INSTRUCTION = `You are "Wanders", a world-class, friendly, and enthusiastic AI Tour Guide. 
Your goal is to help travelers discover cities. 
When a user mentions a city, provide:
1. A warm greeting and a brief, one-sentence interesting fact or vibe about the city.
2. The top 3 must-visit tourist attractions with a one-sentence engaging description for each.
3. One essential travel tip that locals know.

You must respond in a structured JSON format. 
If the user's input is not a city or is ambiguous, try to ask for clarification while remaining in character.`;

const CITY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    cityName: {
      type: Type.STRING,
      description: "The name of the city being discussed.",
    },
    intro: {
      type: Type.STRING,
      description: "A friendly intro and short interesting fact about the city.",
    },
    attractions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["name", "description"],
      },
      description: "List of top 3 attractions.",
    },
    travelTip: {
      type: Type.STRING,
      description: "A unique travel tip for the city.",
    },
  },
  required: ["cityName", "intro", "attractions", "travelTip"],
};

export const getCityInformation = async (query: string): Promise<CityInfo> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: CITY_SCHEMA,
      },
    });

    const text = response.text || "";
    return JSON.parse(text) as CityInfo;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to get travel recommendations. Please try again.");
  }
};
