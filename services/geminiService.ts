
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export const getGeminiResponse = async (
  messages: { role: string; text: string }[],
  currentAlgoName: string
): Promise<string> => {
  try {
    if (!apiKey) {
      return "Please configure your API_KEY to use the AI Tutor.";
    }

    const systemInstruction = `You are a helpful and gentle Computer Science tutor specialized in algorithms. 
    The user is currently visualizing ${currentAlgoName}.
    Keep your explanations concise, encouraging, and easy to understand for a beginner. 
    Avoid complex jargon unless you explain it. 
    If asked about the current state of the visualization, explain the general concept of the step.
    Use Markdown for formatting code or key terms.`;

    const model = "gemini-2.5-flash";
    
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
      },
      history: messages.slice(0, -1).map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }))
    });

    const lastMessage = messages[messages.length - 1].text;
    const result = await chat.sendMessage({ message: lastMessage });
    
    return result.text || "I'm having a bit of trouble thinking right now. Try again?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error connecting to the knowledge base.";
  }
};
