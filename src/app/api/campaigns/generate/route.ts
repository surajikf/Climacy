import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Groq from "groq-sdk";
import { getGlobalSettings } from "@/lib/settings";
import { ok, error } from "@/lib/api-response";
import { z } from "zod";

const generateCampaignSchema = z.object({
    type: z.string().min(1, "Campaign type is required"),
    topic: z.string().min(1, "Topic is required"),
    coreMessage: z.string().min(1, "Core message is required"),
    tone: z.string().optional(),
    cta: z.string().min(1, "Call to action is required"),
});

export async function POST(request: Request) {
    try {
        const json = await request.json();
        const parsed = generateCampaignSchema.safeParse(json);

        if (!parsed.success) {
            return error("VALIDATION_ERROR", "Invalid campaign generation payload", {
                status: 400,
                details: parsed.error.flatten(),
            });
        }

        const { type, topic, coreMessage, tone, cta } = parsed.data;

        // 1. Initial Matrix Calibration (Dynamic Settings)
        const settings = await getGlobalSettings();

        // --- Strategic Credential Retrieval ---
        let aiProvider = settings.aiProvider || "Groq";
        let apiKey = aiProvider === "Groq" ? settings.groqApiKey : settings.openaiApiKey;

        // 2. Fetch Target Clients
        let targetClients: any[] = [];
        const normalizedType = type.toLowerCase();

        if (normalizedType === "broadcast" || normalizedType === "cross-sell") {
            targetClients = await prisma.client.findMany({
                where: { relationshipLevel: { in: ["Active", "Warm Lead"] } },
                include: { services: true }
            });
        } else if (normalizedType === "reactivation" || normalizedType === "reactivate") {
            targetClients = await prisma.client.findMany({
                where: { relationshipLevel: "Past Client" },
                include: { services: true }
            });
        } else if (normalizedType === "targeted") {
            targetClients = await prisma.client.findMany({
                where: { relationshipLevel: "Active" },
                include: { services: true }
            });
        }

        // Safety Batch Limit
        const BATCH_LIMIT = 50;
        if (targetClients.length > BATCH_LIMIT) {
            console.warn(`Campaign target size (${targetClients.length}) exceeds safety limit. Internal throttling applied.`);
            targetClients = targetClients.slice(0, BATCH_LIMIT);
        }

        // 3. AI Generation Logic (Multi-Provider Integration)
        const isApiKeyConfigured = apiKey && apiKey !== "your_groq_api_key_here" && apiKey !== "your_openai_api_key_here";
        const useMock = !isApiKeyConfigured;

        const generatedCampaigns = await Promise.all((targetClients || []).map(async (client: any) => {
            const industryMapping: any = {
                Engineering: "precision, systems, and optimization",
                Construction: "durability, performance, and scale",
                Industrial: "process efficiency",
                Retail: "engagement and brand visibility",
                Tech: "automation and scalability",
                Corporate: "structured growth"
            };

            const mapping = industryMapping[client.industry || ""] || "innovation and efficiency";
            const servicesList = (client.services || []).map((s: any) => s.serviceName).join(", ") || "your business infrastructure";

            // Enhanced default subject with personalization
            let subject = `Strategic Perspective for ${client.clientName || "Your Team"} | Re: ${topic}`;
            let emailBody = "";

            if (useMock) {
                console.warn(`${aiProvider} API key not configured. Falling back to mock generation.`);
                emailBody = `<p>Dear ${client.contactPerson || client.clientName || "Partner"},</p>` +
                    `<p>As a leader in the ${client.industry || "market"} sector, you understand that ${mapping} and ${settings.brandResonance.toLowerCase()} are the cornerstones of long-term success.</p>` +
                    `<p>Reflecting on our current partnership regarding ${servicesList} at ${client.clientName}, I wanted to share a specific perspective on <strong>${topic}</strong>.</p>` +
                    `<p>${coreMessage}</p>` +
                    `<p>In an advisory capacity, I believe this shift presents a unique opportunity to refine your operational trajectory. ${cta}</p>` +
                    `<p>${settings.signature.replace(/\n/g, '<br>')}</p>`;

                return {
                    clientId: client.id,
                    campaignType: type,
                    campaignTopic: topic,
                    generatedOutput: JSON.stringify({ subject, body: emailBody, leadStrength: 70, spamRisk: 5 }),
                };
            } else {
                try {
                    const prompt = `
                        You are an expert marketing communication strategist and high-level business advisor.
                        Generate a highly personalized, professional business email for a client.
                        
                        CLIENT DETAILS:
                        - Name: ${client.clientName}
                        - Contact: ${client.contactPerson || "Partner"}
                        - Industry: ${client.industry} (Values: ${mapping})
                        - Current Services: ${servicesList}
                        - Data Source: ${client.source} ${client.gmailSourceAccount ? `(From Gmail Account: ${client.gmailSourceAccount})` : ""}
                        
                        CAMPAIGN DETAILS:
                        - Type: ${type}
                        - Topic: ${topic}
                        - Tone: ${tone || "Professional, Strategic"}
                        - Core Message: ${coreMessage}
                        - Call to Action: ${cta}
                        
                        BRAND IDENTITY:
                        - Brand Resonance: ${settings.brandResonance}
                        - Signature: ${settings.signature}
                        
                        REQUIREMENTS:
                        1. STRUCTURE: The email MUST follow professional standards:
                           - A professional greeting (e.g., "Dear ${client.contactPerson || client.clientName},")
                           - A clear introductory context. If the source is GMAIL, mention our recent email interactions. If ZOHO, reference our previous business relationship.
                           - Structured paragraphs with professional transitions.
                           - A high-impact sign-off following the Brand Identity.
                        2. TONE: Use a "High-Value Advisory" tone: strategic, observational, and partnership-oriented. No marketing jargon.
                        3. BRANDING: Incorporate Brand Resonance Naturally. The 'body' must mention ${client.clientName} where it feels natural.
                        4. FORMATTING: Use high-fidelity HTML tags for structure (e.g., <p> for paragraphs, <strong> for emphasis, <ul>/<li> for points if applicable).
                        5. OUTPUT: Return valid JSON with 'subject', 'body' (HTML encoded), 'leadStrength' (0-100), and 'spamRisk' (0-100).
                        6. PERSONALIZATION: The 'subject' MUST be high-fidelity and include ${client.clientName}.
                        7. Do not include any text outside the JSON block.
                    `;

                    let content: any = {};

                    if (aiProvider === "Groq") {
                        const groq = new Groq({ apiKey });
                        const chatCompletion = await groq.chat.completions.create({
                            messages: [
                                { role: "system", content: "You are a strategic marketing AI that outputs ONLY pure JSON. For metrics like leadStrength and spamRisk, ALWAYS use integers between 0 and 100." },
                                { role: "user", content: prompt }
                            ],
                            model: settings.aiModel,
                            response_format: { type: "json_object" },
                            temperature: 0.7,
                        });
                        content = JSON.parse(chatCompletion.choices[0].message.content || "{}");
                    } else if (aiProvider === "OpenAI") {
                        const OpenAI = (await import("openai")).default;
                        const openai = new OpenAI({ apiKey });
                        const chatCompletion = await openai.chat.completions.create({
                            messages: [
                                { role: "system", content: "You are a strategic marketing AI that outputs ONLY pure JSON. For metrics like leadStrength and spamRisk, ALWAYS use integers between 0 and 100." },
                                { role: "user", content: prompt }
                            ],
                            model: settings.aiModel,
                            response_format: { type: "json_object" },
                        });
                        content = JSON.parse(chatCompletion.choices[0].message.content || "{}");
                    }

                    // Strategic Metric Normalization
                    const normalizeMetric = (val: any, fallback: number) => {
                        if (typeof val === 'number') return Math.min(100, Math.max(0, Math.floor(val)));
                        if (typeof val === 'string') {
                            const low = ["low", "minimal", "safe"];
                            const high = ["high", "critical", "significant"];
                            const med = ["medium", "moderate", "average"];

                            const clean = val.toLowerCase();
                            if (high.some(k => clean.includes(k))) return 85;
                            if (med.some(k => clean.includes(k))) return 50;
                            if (low.some(k => clean.includes(k))) return 15;

                            const parsed = parseInt(clean);
                            if (!isNaN(parsed)) return Math.min(100, Math.max(0, parsed));
                        }
                        return fallback;
                    };

                    const resSubject = content.subject || subject;
                    const resEmailBody = content.body || "";
                    const leadStrength = normalizeMetric(content.leadStrength, 75);
                    const spamRisk = normalizeMetric(content.spamRisk, 10);

                    return {
                        clientId: client.id,
                        campaignType: type,
                        campaignTopic: topic,
                        generatedOutput: JSON.stringify({ subject: resSubject, body: resEmailBody, leadStrength, spamRisk }),
                    };
                } catch (err) {
                    console.error(`AI Generation failed for client ${client.id}, falling back to template:`, err);
                    const fallbackBody = `<p>Dear ${client.contactPerson || client.clientName || "Partner"},</p><p>[AI Synthesis Failed - Template Fallback]</p><p>Regarding <strong>${topic}</strong>: ${coreMessage}</p><p>${cta}</p><p>${settings.signature.replace(/\n/g, '<br>')}</p>`;
                    return {
                        clientId: client.id,
                        campaignType: type,
                        campaignTopic: topic,
                        generatedOutput: JSON.stringify({ subject, body: fallbackBody, leadStrength: 50, spamRisk: 5 }),
                    };
                }
            }
        }));

        // 4. Save to History and Update Last Contacted
        if (generatedCampaigns.length > 0) {
            await prisma.campaignHistory.createMany({
                data: generatedCampaigns as any
            });

            // Update lastContacted for all targeted clients
            const clientIds = targetClients.map(c => c.id).filter(Boolean);
            if (clientIds.length > 0) {
                await prisma.client.updateMany({
                    where: { id: { in: clientIds } },
                    data: { lastContacted: new Date() }
                });
            }
        }

        return ok({
            count: generatedCampaigns.length,
        });
    } catch (err) {
        console.error("AI Generation failed:", err);
        return error("INTERNAL_ERROR", "Internal Server Error");
    }
}
