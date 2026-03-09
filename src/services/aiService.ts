import { GoogleGenAI } from "@google/genai";
import { medicalKnowledge } from "../ai/knowledge.ts";

// In AI Studio Build, the API key is automatically handled for frontend calls
// when using process.env.GEMINI_API_KEY or if the SDK is initialized correctly.
const getAI = () => {
  return new GoogleGenAI({ apiKey: (import.meta as any).env?.VITE_GEMINI_API_KEY || (process as any).env?.GEMINI_API_KEY || "" });
};

const modelName = "gemini-3-flash-preview";

export async function processChatMessageFrontend(userMessage: string) {
  const ai = getAI();

  // 1. Intent Classification & Language Detection
  const classificationPrompt = `
    Analyze the following user query for a healthcare chatbot.
    1. Detect the language.
    2. Classify the intent into one of: symptom_query, treatment_query, prevention_query, management_query, comparison_query, or general_query.
    3. Identify the main medical topic (e.g., dengue, malaria, covid, etc.).

    User Query: "${userMessage}"

    Return ONLY a JSON object:
    {
      "language": "string",
      "intent": "string",
      "topic": "string"
    }
  `;

  const classificationResponse = await ai.models.generateContent({
    model: modelName,
    contents: classificationPrompt,
    config: { responseMimeType: "application/json" }
  });

  const metadata = JSON.parse(classificationResponse.text);

  // 2. RAG Retrieval
  const relevantDocs = medicalKnowledge.filter(doc => 
    doc.topic === metadata.topic || 
    doc.intent === metadata.intent ||
    userMessage.toLowerCase().includes(doc.topic)
  );

  const context = relevantDocs.map(doc => doc.text).join("\n\n");

  // 3. Response Generation
  const systemInstruction = `
    You are a professional healthcare assistant. 
    Use the provided context to answer the user's question accurately.
    If the information is not in the context, use your general medical knowledge but add a disclaimer that you are an AI and the user should consult a doctor.
    Respond in the detected language: ${metadata.language}.
    Keep the tone empathetic and professional.
  `;

  const finalPrompt = `
    Context:
    ${context || "No specific medical documents found for this query."}

    User Question: "${userMessage}"
  `;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: finalPrompt,
    config: {
      systemInstruction
    }
  });

  return {
    response: response.text,
    metadata: {
      ...metadata,
      retrievedDocsCount: relevantDocs.length
    }
  };
}
