import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Groq from "groq-sdk";
import { getGlobalSettings } from "@/lib/settings";
import { wrapInPremiumTemplate } from "@/lib/email-template";
import { ok, error } from "@/lib/api-response";
import { getSmartGreeting, replaceVariables } from "@/lib/utils";
import { z } from "zod";
import { getTargetClients } from "@/domain/campaigns";

const generateCampaignSchema = z.object({
    type: z.string().min(1, "Campaign type is required"),
    topic: z.string().min(1, "Topic is required"),
    coreMessage: z.string().min(1, "Core message is required"),
    tone: z.string().optional(),
    cta: z.string().min(1, "Call to action is required"),
    sampleOnly: z.boolean().optional().default(false),
    clientId: z.string().optional(),
    styleGuide: z.object({
        subject: z.string(),
        body: z.string()
    }).optional(),
    serviceFilters: z.array(z.string()).optional().default([]),
    serviceLogic: z.enum(["AND", "OR"]).optional().default("OR"),
    excludedClientIds: z.array(z.string()).optional().default([]),
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

        const { type, topic, coreMessage, tone, cta, sampleOnly, clientId, styleGuide, excludedClientIds, serviceFilters, serviceLogic } = parsed.data;

        // 1. Initial Matrix Calibration (Dynamic Settings)
        const settings = await getGlobalSettings();

        // --- Strategic Credential Retrieval ---
        let aiProvider = settings.aiProvider || "Groq";
        let apiKey = aiProvider === "Groq" ? settings.groqApiKey : settings.openaiApiKey;

        // 2. Fetch Target Clients
        let targetClients: any[] = [];
        
        if (sampleOnly && clientId) {
            // Specific client requested for sample
            const client = await prisma.client.findUnique({
                where: { id: clientId },
                select: {
                    id: true,
                    clientName: true,
                    industry: true,
                    contactPerson: true,
                    relationshipLevel: true,
                    clientAddedOn: true,
                    lastInvoiceDate: true,
                    invoiceServiceNames: true,
                }
            });
            if (client) targetClients = [client];
        } else {
            // Fetch potential targets respecting segmentation and exclusions
            const allTargets = await getTargetClients(type, serviceFilters, serviceLogic, excludedClientIds);
            
            if (sampleOnly) {
                // Pick one "random" (first) client for the sample
                targetClients = allTargets.length > 0 ? [allTargets[0]] : [];
            } else {
                // Batch processing (Safety limit 50)
                targetClients = allTargets.slice(0, 50);
            }
        }

        // 3. AI Generation Logic (Multi-Provider Integration)
        const isApiKeyConfigured = apiKey && apiKey !== "your_groq_api_key_here" && apiKey !== "your_openai_api_key_here";
        const useMock = !isApiKeyConfigured;

        const generatedCampaigns = await Promise.all((targetClients || []).map(async (client: any) => {
            const servicesList = client.invoiceServiceNames || "your business infrastructure";
            const greeting = getSmartGreeting(client.contactPerson);
            
            // --- Institutional Intelligence Context ---
            const now = new Date();
            const addedOn = client.clientAddedOn ? new Date(client.clientAddedOn) : null;
            const tenureYears = addedOn ? now.getFullYear() - addedOn.getFullYear() : 0;
            const relationshipDepth = tenureYears > 3 ? "Deep Legacy" : tenureYears > 1 ? "Established Partnership" : "New Engagement";
            
            const lastInvoice = client.lastInvoiceDate ? new Date(client.lastInvoiceDate) : null;
            const lastActivity = lastInvoice ? `Last significant engagement: ${lastInvoice.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : "Ongoing relationship";

            // Enhanced default subject with personalization
            let subject = replaceVariables(topic || `Strategic Perspective for {{companyName}}`, client);
            let emailBody = "";

            if (useMock) {
                console.warn(`${aiProvider} API key not configured. Falling back to mock generation.`);
                // High-fidelity personalization based on the MASTER DRAFT (topic and coreMessage)
                emailBody = replaceVariables(coreMessage, client);
                
                // If the body doesn't start with the greeting, prepend it
                if (!emailBody.toLowerCase().startsWith(greeting.toLowerCase().split(' ')[0])) {
                    emailBody = `<p>${greeting},</p>${emailBody}`;
                }

                if (styleGuide) {
                    emailBody = replaceVariables(styleGuide.body, client);
                    subject = replaceVariables(styleGuide.subject, client);
                }

                return {
                    clientId: client.id,
                    clientName: client.clientName,
                    contactPerson: client.contactPerson,
                    campaignType: type,
                    campaignTopic: topic,
                    generatedOutput: JSON.stringify({ subject, body: emailBody, leadStrength: 70, spamRisk: 5 }),
                };
            } else {
                try {
                    const stylePrompt = styleGuide ? `
                        IMPORTANT: The user has curated a specific VISUAL STYLE and HTML STRUCTURE they want you to follow.
                        Here is the base style (HTML TEMPLATE):
                        SUBJECT: ${styleGuide.subject}
                        BODY: ${styleGuide.body}
                        
                        When generating for ${client.clientName}, you must adapt this template to their specific context (${client.industry}, ${servicesList}) while STRICTLY maintaining the HTML tags, inline styles (font-family, text-align, color), and structural formatting of the template.
                    ` : "";

                    const relationshipContext = `
                        INSTITUTIONAL INTELLIGENCE:
                        - RELATIONSHIP DEPTH: ${relationshipDepth} (${tenureYears} years with IKF).
                        - LAST ACTIVITY: ${lastActivity}.
                        - STATUS: ${client.relationshipLevel}.
                        
                        ADAPT YOUR HOOK: If they are a ${relationshipDepth} client, acknowledge the legacy and shared history. If they are ${client.relationshipLevel} "Past Client", position this as a "New Chapter" bridge.
                    `;

                    const objectiveContexts: Record<string, string> = {
                        "Broadcast": "GOAL: Strategic wide-angle synchronization. Focus on high-level corporate shifts, new infrastructure, or vision pivots. The tone should be institutional yet authoritative.",
                        "Targeted": "GOAL: High-precision value sharing. Focus on a specific milestone or exclusive resource that directly aligns with the recipient's industry position. The tone should be highly personalized and exclusive.",
                        "Cross-Sell": "GOAL: Capacity expansion. Identify a likely 'friction point' in their current setup that our other services (${servicesList}) could solve. Position this as an integrated evolution, not a pitch.",
                        "Reactivation": "GOAL: Re-igniting a dormant partnership. Reference previous successes and acknowledge the 'new chapter' or capability shift that makes a dialogue relevant now. The tone should be nostalgic yet forward-looking.",
                    };

                    const prompt = `
                        ${relationshipContext}

                        CORE LOGIC:
                        - SENDER: Senior Advisor at I Knowledge Factory.
                        - RECIPIENT: ${client.clientName}.
                        - SECTOR: ${client.industry}.
                        - OBJECTIVE: ${type}.
                        ${objectiveContexts[type] || ""}

                        GOAL: 
                        You have been provided with a MASTER DRAFT (Subject and Body). Your task is to perform a HIGH-FIDELITY PERSONALIZATION of this draft for ${client.clientName}.
                        
                        MASTER SUBJECT: "${topic}"
                        MASTER BODY: "${coreMessage}"
                        
                        CRITICAL SMART LOGIC:
                        1. START WITH GREETING: The email MUST start with exactly this: "${greeting}"
                        2. HIGH-FIDELITY SYNC: Mirror the unique wording, specialized tone, and specific value proposition of the MASTER BODY draft provided above.
                        3. SMART VARIABLE INJECTION: Replace placeholders like {{firstName}}, {{lastName}}, {{fullName}}, {{companyName}}, {{industry}}, {{services}}, {{location}}, {{relationship}}, {{tenureYears}} with corresponding client data.
                        4. SEAMLESS FLOW: Weave in the client's sector (${client.industry}) context where it feels natural based on the draft's logic.
                        5. HTML FORMAT: Return a valid HTML segment for the body. Preserve any formatting from the draft.
                        
                        OUTPUT: Return a PURE JSON object with "subject" and "body" fields.
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

                    let resSubject = content.subject || subject;
                    let resEmailBody = content.body || "";
                    
                    // Smart Sanitization: Strip markdown code blocks if the AI ignored instructions
                    if (resEmailBody.includes("```")) {
                        resEmailBody = resEmailBody.replace(/```html\n?|```\n?/g, "").trim();
                    }
                    
                    // Logic Boost: Relationship-weighted lead strength
                    let leadStrength = normalizeMetric(content.leadStrength, 75);
                    if (tenureYears > 2) leadStrength = Math.min(100, leadStrength + 10);
                    if (client.relationshipLevel === "Active") leadStrength = Math.min(100, leadStrength + 5);
                    
                    const spamRisk = normalizeMetric(content.spamRisk, 10);

                    return {
                        clientId: client.id,
                        clientName: client.clientName,
                        contactPerson: client.contactPerson,
                        campaignType: type,
                        campaignTopic: topic,
                        generatedOutput: JSON.stringify({ subject: resSubject, body: resEmailBody, leadStrength, spamRisk }),
                    };
                } catch (err) {
                    console.error(`AI Generation failed for client ${client.id}, falling back to template:`, err);
                    const fallbackBody = `<p>Dear ${client.contactPerson || client.clientName || "Partner"},</p><p>[AI Synthesis Failed - Template Fallback]</p><p>Regarding <strong>${topic}</strong>: ${coreMessage}</p><p>${cta}</p><p>${settings.signature.replace(/\n/g, '<br>')}</p>`;
                    return {
                        clientId: client.id,
                        clientName: client.clientName,
                        contactPerson: client.contactPerson,
                        campaignType: type,
                        campaignTopic: topic,
                        generatedOutput: JSON.stringify({ subject, body: fallbackBody, leadStrength: 50, spamRisk: 5 }),
                    };
                }
            }
        }));

        // 4. Save to History and Update Last Contacted
        if (!sampleOnly && generatedCampaigns.length > 0) {
            await prisma.campaignHistory.createMany({
                data: generatedCampaigns.map(c => ({
                    clientId: c.clientId,
                    campaignType: c.campaignType,
                    campaignTopic: c.campaignTopic,
                    generatedOutput: c.generatedOutput
                })) as any
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
            sample: sampleOnly ? generatedCampaigns[0] : null
        });
    } catch (err) {
        console.error("AI Generation failed:", err);
        return error("INTERNAL_ERROR", "Internal Server Error");
    }
}
