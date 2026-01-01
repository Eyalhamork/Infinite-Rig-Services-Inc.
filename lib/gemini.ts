import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// Safety settings for the chat model
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// System prompt for the chatbot
const SYSTEM_PROMPT = `You are an AI assistant for Infinite Rig Services, a Liberian-owned company specializing in offshore support services, supply chain operations, and manning solutions for the oil and gas industry.

Company Information:
- Location: Crown Prince Plaza, Congo Town, Monrovia, Liberia
- Phone: +231 88 191 5322
- Email: info@infiniterigservices.com
- Website: infiniterigservices.com

Core Services:
1. Offshore Support Services - Platform maintenance, drilling rig support, emergency response, marine logistics
2. Supply Chain & Procurement - Equipment procurement, warehousing, transportation, vendor management
3. Manning & Crew Services - Recruitment, STCW certification training, crew management, payroll
4. HSE Services - Safety consulting, risk assessments, compliance auditing, training programs

Guidelines:
- Be professional, helpful, and concise
- Provide accurate information based on the context provided
- If you don't know something, say so and offer to connect them with a human
- For job inquiries, direct them to the careers page at /careers
- For quotes, direct them to the quote page at /quote
- For urgent matters, provide the phone number
- Keep responses under 150 words unless detailed information is requested`;

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface DocumentContext {
  content: string;
  source?: string;
  similarity?: number;
}

/**
 * Generate embeddings using Gemini text-embedding-004 model
 * Returns a 768-dimensional vector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Generate a chat response using Gemini Flash
 */
export async function generateChatResponse(
  messages: Message[],
  context?: DocumentContext[]
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-pro',
      safetySettings,
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 500,
      },
    });

    // Build context from retrieved documents
    let contextText = '';
    if (context && context.length > 0) {
      contextText = '\n\nRelevant information from company documents:\n';
      context.forEach((doc, i) => {
        contextText += `\n[Source: ${doc.source || 'Company Document'}]\n${doc.content}\n`;
      });
    }

    // Build the prompt
    const systemWithContext = SYSTEM_PROMPT + contextText;

    // Convert message history for Gemini
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Start chat with history
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: 'System: ' + systemWithContext }] },
        { role: 'model', parts: [{ text: 'I understand. I am the AI assistant for Infinite Rig Services. How can I help you today?' }] },
        ...history,
      ],
    });

    // Get the latest user message
    const latestMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(latestMessage);
    const response = result.response.text();

    return response;
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw error;
  }
}

/**
 * Check if a message indicates the user wants to talk to a human
 */
export function shouldHandoffToHuman(message: string): boolean {
  const handoffKeywords = [
    'speak to human',
    'talk to human',
    'talk to a person',
    'real person',
    'human agent',
    'customer service',
    'representative',
    'speak to someone',
    'talk to someone',
    'live agent',
    'live support',
    'human support',
    'complaint',
    'urgent help',
    'emergency',
    'manager',
    'supervisor',
  ];

  const lowerMessage = message.toLowerCase();
  return handoffKeywords.some((keyword) => lowerMessage.includes(keyword));
}

/**
 * Generate a handoff message when transferring to human support
 */
export function getHandoffMessage(): string {
  return `I understand you'd like to speak with a human representative. Here's how you can reach our team directly:

📱 **WhatsApp**: +231 88 191 5322 (fastest response)
📞 **Phone**: +231 88 191 5322
📧 **Email**: info@infiniterigservices.com

Click the WhatsApp button below to start a conversation with our team!`;
}

/**
 * Chunk text into smaller pieces for embedding
 */
export function chunkText(
  text: string,
  chunkSize: number = 1000,
  overlap: number = 200
): string[] {
  const chunks: string[] = [];
  const words = text.split(/\s+/);

  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim().length > 50) {
      chunks.push(chunk.trim());
    }
  }

  return chunks;
}
