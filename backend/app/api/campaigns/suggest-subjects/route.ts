import { ok, error } from "@/backend/lib/api-response";
import { z } from "zod";
import { runAiWithFallback } from "@/backend/lib/ai-router";

const suggestSchema = z.object({
    topic: z.string().min(1),
    coreMessage: z.string().min(1),
    clientName: z.string().optional(),
    industry: z.string().optional(),
});

const spamTokens = ["free", "buy now", "urgent", "guaranteed", "winner", "!!!"];

function scoreSubjectLine(subject: string) {
    const s = (subject || "").trim();
    const lower = s.toLowerCase();
    let score = 70;
    if (s.length >= 28 && s.length <= 62) score += 15;
    if (s.length < 18) score -= 15;
    if (s.length > 75) score -= 20;
    if (/\b(re:|for|regarding|idea|perspective|strategy)\b/i.test(s)) score += 8;
    if (/[!?]{2,}/.test(s)) score -= 12;
    for (const token of spamTokens) {
        if (lower.includes(token)) score -= 10;
    }
    return Math.max(0, Math.min(100, Math.round(score)));
}

export async function POST(request: Request) {
    try {
        const json = await request.json();
        const parsed = suggestSchema.safeParse(json);

        if (!parsed.success) {
            return error("VALIDATION_ERROR", "Invalid suggestion payload");
        }

        const { topic, coreMessage, clientName, industry } = parsed.data;
        let aiResult: Awaited<ReturnType<typeof runAiWithFallback>> | null = null;
        let suggestions: string[] = [];
        try {
            aiResult = await runAiWithFallback({
                messages: [
                    { role: "system", content: "You are a strategic marketing AI. Return ONLY a JSON object with `suggestions` as an array of strings." },
                    { role: "user", content: `
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
            5. Return ONLY a JSON object like: {"suggestions":["...","...","..."]}.
        ` }
                ],
                responseFormat: "json_object",
            });
            const content = JSON.parse(aiResult.content || '{"suggestions": []}');
            suggestions = Array.isArray(content) ? content : (content.suggestions || []);
        } catch (aiErr: any) {
            if (!String(aiErr?.message || "").includes("No AI provider keys configured")) {
                console.error("Subject Suggestion AI failed; using local fallback:", aiErr);
            }
            return ok({
                suggestions: [
                    `Strategic Perspective on ${topic} for ${clientName || "Your Team"}`,
                    `${industry || "Business"} Intelligence: The ${topic} Shift`,
                    `Re: Selective Advisory on ${topic}`
                ]
            });
        }

        const unique = Array.from(new Set(suggestions.map(s => (s || "").trim()).filter(Boolean)));
        const ranked = unique
            .map((s) => ({ subject: s, score: scoreSubjectLine(s) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        const warnings: string[] = [];
        if (ranked.some((r) => r.score < 60)) {
            warnings.push("Some suggested subjects may underperform due to length or deliverability signals.");
        }
        if (ranked.length > 1 && ranked[0].subject.toLowerCase() === ranked[1].subject.toLowerCase()) {
            warnings.push("Top subject variants are too similar. Consider stronger variation.");
        }

        return ok({
            suggestions: ranked.map((r) => r.subject).slice(0, 3),
            ranked,
            warnings,
            aiRouting: {
                providerUsed: aiResult?.providerUsed || "groq",
                fallbackActive: aiResult?.fallbackActive || false,
                groqRetryAt: aiResult?.groqRetryAt || null,
            }
        });

    } catch (err) {
        console.error("Subject Suggestion failed:", err);
        return error("INTERNAL_ERROR", "Internal Server Error");
    }
}
