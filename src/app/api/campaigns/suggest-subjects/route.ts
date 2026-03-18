import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { getGlobalSettings } from "@/lib/settings";
import { ok, error } from "@/lib/api-response";
import { z } from "zod";

const suggestSchema = z.object({
    topic: z.string().min(1),
    coreMessage: z.string().min(1),
    clientName: z.string().optional(),
    industry: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        const json = await request.json();
        const parsed = suggestSchema.safeParse(json);

        if (!parsed.success) {
            return error("VALIDATION_ERROR", "Invalid suggestion payload");
        }

        const { topic, coreMessage, clientName, industry } = parsed.data;
        const settings = await getGlobalSettings();

        let aiProvider = settings.aiProvider || "Groq";
        let apiKey = aiProvider === "Groq" ? settings.groqApiKey : settings.openaiApiKey;

        if (!apiKey || apiKey.includes("your_")) {
            return ok({ 
                suggestions: [
                    `Strategic Perspective on ${topic} for ${clientName || "Your Team"}`,
                    `${industry || "Business"} Intelligence: The ${topic} Shift`,
                    `Re: Selective Advisory on ${topic}`
                ]
            });
        }

        const prompt = `
            TASK: Generate 3 high-impact, professional, and "Executive Advisory" style subject lines for an email campaign.
            TOPIC: "${topic}"
            CORE MESSAGE: "${coreMessage}"
            CLIENT: "${clientName || "Valued Partner"}"
            INDUSTRY: "${industry || "Strategic Enterprise"}"

            RULES:
            1. No exclamation marks.
            2. Intellectual, observant, and peer-to-peer tone.
            3. Maximum 60 characters each.
            4. Focus on the strategic value of ${topic}.
            5. Return ONLY a JSON array of 3 strings.
        `;

        let suggestions: string[] = [];

        if (aiProvider === "Groq") {
            const groq = new Groq({ apiKey });
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a strategic marketing AI. Return ONLY a JSON array of strings." },
                    { role: "user", content: prompt }
                ],
                model: settings.aiModel,
                response_format: { type: "json_object" },
            });
            const content = JSON.parse(chatCompletion.choices[0].message.content || '{"suggestions": []}');
            suggestions = Array.isArray(content) ? content : (content.suggestions || []);
        } else if (aiProvider === "OpenAI") {
            const OpenAI = (await import("openai")).default;
            const openai = new OpenAI({ apiKey });
            const chatCompletion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a strategic marketing AI. Return ONLY a JSON array of strings." },
                    { role: "user", content: prompt }
                ],
                model: settings.aiModel,
                response_format: { type: "json_object" },
            });
            const content = JSON.parse(chatCompletion.choices[0].message.content || '{"suggestions": []}');
            suggestions = Array.isArray(content) ? content : (content.suggestions || []);
        }

        return ok({ suggestions: suggestions.slice(0, 3) });

    } catch (err) {
        console.error("Subject Suggestion failed:", err);
        return error("INTERNAL_ERROR", "Internal Server Error");
    }
}
