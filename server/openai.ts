import { GoogleGenAI } from "@google/genai";

// Using Gemini 2.5 Flash for efficient Islamic knowledge assistance
const genai = new GoogleGenAI(process.env.GEMINI_API_KEY || "");

export async function askIslamicQuestion(question: string): Promise<{
  answer: string;
  sources?: string[];
  isAuthentic: boolean;
}> {
  try {
    const model = genai.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an Islamic knowledge assistant specializing in Quran, Hadith, Islamic history, and Islamic jurisprudence. 

Guidelines:
- Only answer questions related to Islam (Quran, Hadith, Islamic history, Islamic law, Islamic practices)
- Provide authentic and accurate information based on reliable Islamic sources
- If you're unsure about something, clearly state that
- Always cite sources when possible (Quran verses with Surah and Ayah numbers, Hadith collections)
- If the question is not related to Islam, politely redirect to Islamic topics
- Respond in JSON format with 'answer', 'sources' (array), and 'isAuthentic' (boolean) fields
- Keep answers concise but informative
- Use respectful Islamic terminology (PBUH for Prophet Muhammad, etc.)

Question: ${question}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const parsed = JSON.parse(text);
      return {
        answer: parsed.answer || "I apologize, but I couldn't provide an answer to your question.",
        sources: parsed.sources || [],
        isAuthentic: parsed.isAuthentic || false,
      };
    } catch (parseError) {
      // If JSON parsing fails, return the text as answer
      return {
        answer: text || "I apologize, but I couldn't provide an answer to your question.",
        sources: [],
        isAuthentic: false,
      };
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      answer: "I apologize, but I'm currently unable to process your question. Please try again later.",
      sources: [],
      isAuthentic: false,
    };
  }
}

export async function generateDailyContent(type: "verse" | "hadith", language: string = "en"): Promise<{
  content: string;
  source: string;
}> {
  try {
    const model = genai.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = type === "verse" 
      ? `Generate an inspiring Quran verse with its translation in ${language} language. Include the Surah name and verse number as source. Respond in JSON format with 'content' and 'source' fields. The content should be inspirational and authentic. Include Arabic text if possible with translation.`
      : `Generate an authentic Hadith with its translation in ${language} language. Include the collection name (like Bukhari, Muslim, etc.) as source. Respond in JSON format with 'content' and 'source' fields. Provide the authentic narration with proper attribution.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const parsed = JSON.parse(text);
      return {
        content: parsed.content || (type === "verse" ? "And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose." : "The best of people are those who benefit others."),
        source: parsed.source || (type === "verse" ? "Quran 65:3" : "Hadith - At-Tabarani"),
      };
    } catch (parseError) {
      // Fallback content
      if (type === "verse") {
        return {
          content: "And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose.",
          source: "Quran 65:3",
        };
      } else {
        return {
          content: "The best of people are those who benefit others.",
          source: "Hadith - At-Tabarani",
        };
      }
    }
  } catch (error) {
    console.error("Gemini API Error for daily content:", error);
    
    // Fallback content
    if (type === "verse") {
      return {
        content: "And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose.",
        source: "Quran 65:3",
      };
    } else {
      return {
        content: "The best of people are those who benefit others.",
        source: "Hadith - At-Tabarani",
      };
    }
  }
}
