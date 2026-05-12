import { ok, error } from "@/services/api-response";
import { z } from "zod";
import { normalizeEmailBodyHtml } from "@/lib/shared/email-format";
import { runAiWithFallback } from "@/services/ai-router";

const refineSchema = z.object({
    text: z.string().min(1, "Text to refine is required"),
    command: z.string().min(1, "Instruction is required"),
});

export async function POST(request: Request) {
    try {
        const json = await request.json();
        const parsed = refineSchema.safeParse(json);

        if (!parsed.success) {
            return error("VALIDATION_ERROR", "Invalid refinement payload", {
                status: 400,
                details: parsed.error.flatten(),
            });
        }

        const { text, command } = parsed.data;
        const prompt = `
            TASK: Refine the following email segment based on the user instruction.
            SEGMENT: "${text}"
            INSTRUCTION: "${command}"

            RULES:
            1. Response must be PURE text or valid HTML segment (if the input was HTML).
            2. NO introductory text like "Sure, here is your refined text:".
            3. Maintain the core meaning but adapt the tone/length as requested.
            4. If the input contains HTML tags, preserve the necessary structure.
            5. Return ONLY the refined content.
        `;

        let aiResult: Awaited<ReturnType<typeof runAiWithFallback>> | null = null;
        let refinedText = text;
        try {
            aiResult = await runAiWithFallback({
                messages: [
                    { role: "system", content: "You are a professional business communication editor. Return ONLY the refined text without any conversational filler." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.5,
            });
            refinedText = aiResult.content || text;
        } catch (aiErr: any) {
            if (String(aiErr?.message || "").includes("No AI provider keys configured")) {
                return ok({
                    refinedText: `[AI REFINE MOCK]: ${text} (Applied: ${command})`,
                    originalText: text
                });
            }
            throw aiErr;
        }

        const inputWasHtml = /<\s*\/?\s*[a-zA-Z][^>]*>/.test(text);
        const normalized = inputWasHtml ? normalizeEmailBodyHtml(refinedText.trim()) : refinedText.trim();

        return ok({ 
            refinedText: normalized,
            originalText: text,
            aiRouting: {
                providerUsed: aiResult?.providerUsed || "groq",
                fallbackActive: aiResult?.fallbackActive || false,
                groqRetryAt: aiResult?.groqRetryAt || null,
            }
        });

    } catch (err) {
        console.error("AI Refinement failed:", err);
        return error("INTERNAL_ERROR", "Internal Server Error");
    }
}

