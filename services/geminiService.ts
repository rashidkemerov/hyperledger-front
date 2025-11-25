import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const GeminiService = {
  analyzeProperty: async (name: string, location: string, value: number) => {
    const ai = getClient();
    if (!ai) return { description: "AI недоступен", risk: "Неизвестно" };

    const prompt = `
      Ты профессиональный аналитик недвижимости.
      Проанализируй следующий объект для токенизации на блокчейне:
      Название: ${name}
      Локация: ${location}
      Оценочная стоимость: $${value}

      Пожалуйста, верни ответ в формате JSON без markdown блоков, строго следуя структуре:
      {
        "description": "Краткое, привлекательное маркетинговое описание объекта на русском языке (макс 2 предложения).",
        "risk": "Краткая оценка рисков инвестирования (макс 2 предложения) на русском языке."
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
      });
      
      const text = response.text;
      if (!text) throw new Error("Empty response");
      
      return JSON.parse(text);
    } catch (e) {
      console.error("Gemini analysis failed", e);
      return {
        description: "Автоматическое описание недоступно.",
        risk: "Требуется ручная оценка рисков."
      };
    }
  }
};