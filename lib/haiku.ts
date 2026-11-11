interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface DocumentContext {
  content: string;
  source?: string;
  similarity?: number;
}

const SYSTEM_PROMPT = `You are the AI assistant for Infinite Rig Services, Inc. (IRSI), a premier 100% Liberian-owned offshore support services, supply chain, and manning solutions company serving the West African oil and gas industry.

Company Overview:
- Location: Crown Prince Plaza, Congo Town, Monrovia, Liberia
- Phone: +231 88 191 5322
- Email: info@infiniterigservices.com
- Website: infiniterigservices.com
- Quote Requests: /quote
- Job Applications: /careers
- Project / Shipment Tracking: /tracking

Complete Suite of 8 Core Services:
1. Offshore Operations & Engineering (/services/offshore):
   Full technical support for drilling rigs and offshore platforms, preventative platform maintenance, emergency marine response, subsea technical assistance, and certified offshore crew management.

2. Supply Chain Solutions & Logistics (/services/supply):
   End-to-end procurement, bonded warehousing, inventory management, vessel provisioning, customs clearance, and marine transportation in remote offshore environments.

3. Manning & Crewing Services (/services/manning):
   Specialized recruitment, STCW-certified maritime personnel, technical training programs, crew logistics and rotations, and compliant payroll management.

4. HSE Consulting & Safety (/services/hse):
   Health, Safety, and Environmental compliance auditing, quantitative risk assessments, safety management systems, and incident prevention training ensuring zero-incident operations.

5. Asset Integrity & Inspection (/services/asset-integrity):
   Advanced Non-Destructive Testing (NDT), ultrasonic testing, corrosion monitoring, and structural evaluations to prolong infrastructure lifespan.

6. Rig Move & Marine Towage (/services/rig-move):
   Safe drilling rig relocations, anchor handling, heavy tugboat coordination, and navigation into territorial waters.

7. Maritime Security (/services/security):
   Armed security escorts, vessel protection, anti-piracy deterrence, and 24/7 situational monitoring in high-risk territorial waters.

8. Waste Management (/services/waste-management):
   Integrated offshore waste management, hazardous chemical disposal, drill cuttings treatment, tank cleaning, and MARPOL-compliant environmental stewardship.

CRITICAL FORMATTING RULES:
- NEVER use markdown asterisks (no double asterisks **, no single asterisks *). The chat window renders plain text, so asterisks look like raw formatting bugs.
- Do NOT use markdown headers (no # or ##).
- Write in clean, professional, conversational plain text.
- To organize items, use a simple bullet point (•) or a clean dash (-).
- Keep replies helpful, concise, polite, and natural.
- When referencing pages, provide the route naturally (e.g., our quote page at /quote, or careers page at /careers).`;

/**
 * Generate chat response using Anthropic Claude Haiku (3.5 Haiku)
 */
export async function generateHaikuResponse(
  messages: Message[],
  context?: DocumentContext[]
): Promise<string> {
  const apiKey =
    process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your-anthropic-api-key") {
    throw new Error(
      "ANTHROPIC_API_KEY is not configured. Please add your Anthropic API key to .env.local as ANTHROPIC_API_KEY=your_key_here."
    );
  }

  // Build document context if provided
  let contextText = "";
  if (context && context.length > 0) {
    contextText = "\n\nRelevant information from company documentation:\n";
    context.forEach((doc) => {
      contextText += `\n[Source: ${doc.source || "Company Document"}]\n${doc.content}\n`;
    });
  }

  const fullSystemPrompt = SYSTEM_PROMPT + contextText;

  // Format messages for Anthropic (alternating user/assistant, starting with user)
  const validMessages: { role: "user" | "assistant"; content: string }[] = [];

  for (const msg of messages) {
    if (msg.role === "system") continue;
    const role: "user" | "assistant" =
      msg.role === "assistant" ? "assistant" : "user";
    const content = msg.content?.trim();
    if (!content) continue;

    // Combine consecutive messages with the same role
    if (
      validMessages.length > 0 &&
      validMessages[validMessages.length - 1].role === role
    ) {
      validMessages[validMessages.length - 1].content += `\n\n${content}`;
    } else {
      validMessages.push({ role, content });
    }
  }

  // Ensure first message is from user
  if (validMessages.length === 0 || validMessages[0].role !== "user") {
    validMessages.unshift({
      role: "user",
      content: "Hello",
    });
  }

  // Try Claude Haiku models available to this account
  const models = [
    "claude-haiku-5-5",
    "claude-haiku-4-5-20251001",
    "claude-3-5-haiku-20241022",
    "claude-3-haiku-20240307",
  ];

  let lastError: any = null;
  for (const model of models) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey.trim(),
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 600,
          system: fullSystemPrompt,
          messages: validMessages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData?.error?.message ||
          `Anthropic API error (${response.status}: ${response.statusText})`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const textBlock = data.content?.find((c: any) => c.type === "text");
      if (textBlock && textBlock.text) {
        return textBlock.text;
      }

      throw new Error("No text response received from Claude Haiku");
    } catch (err: any) {
      lastError = err;
      console.warn(`Haiku model ${model} attempt failed:`, err?.message || err);
      // If error is authentication/bad-key, don't retry with next model
      if (err?.message?.includes("invalid x-api-key") || err?.message?.includes("authentication")) {
        break;
      }
    }
  }

  throw lastError || new Error("Failed to generate response with Claude Haiku");
}
