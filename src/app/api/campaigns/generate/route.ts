import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Groq from "groq-sdk";
import { getGlobalSettings } from "@/lib/settings";
import { wrapInPremiumTemplate } from "@/lib/email-template";
import { ok, error } from "@/lib/api-response";
import { getSmartGreeting } from "@/lib/utils";
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
            let subject = `Strategic Perspective for ${client.clientName || "Your Team"} | Re: ${topic}`;
            let emailBody = "";

            if (useMock) {
                console.warn(`${aiProvider} API key not configured. Falling back to mock generation.`);
                emailBody = `<p>${greeting},</p>` +
                    `<p>As a leader in the ${client.industry || "market"} sector, you understand that innovation and ${settings.brandResonance.toLowerCase()} are the cornerstones of long-term success.</p>` +
                    `<p>Reflecting on our <strong>${relationshipDepth}</strong> status regarding ${servicesList} at ${client.clientName}, I wanted to share a specific perspective on <strong>${topic}</strong>.</p>` +
                    `<p>${coreMessage}</p>` +
                    `<p>In an advisory capacity, I believe this shift presents a unique opportunity to refine your operational trajectory. ${cta}</p>` +
                    `<p>${settings.signature.replace(/\n/g, '<br>')}</p>`;

                if (styleGuide) {
                    emailBody = styleGuide.body
                        .replace(/\{\{greeting\}\}/g, greeting)
                        .replace(/\{\{clientName\}\}/g, client.clientName || "")
                        .replace(/\{\{contactPerson\}\}/g, client.contactPerson || client.clientName || "Partner")
                        .replace(/\{\{industry\}\}/g, client.industry || "market")
                        .replace(/\{\{services\}\}/g, servicesList)
                        .replace(/\{\{topic\}\}/g, topic)
                        .replace(/\{\{cta\}\}/g, cta);

                    subject = styleGuide.subject
                        .replace(/\{\{clientName\}\}/g, client.clientName || "")
                        .replace(/\{\{topic\}\}/g, topic);
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
                        ${stylePrompt}
                        ${relationshipContext}

                        CORE LOGIC:
                        - SENDER: A senior advisor at I Knowledge Factory with access to the full relationship history.
                        - RECIPIENT: ${client.clientName}.
                        - SECTOR: ${client.industry}. (TASK: Perform a real-time analysis of the current ${client.industry} landscape to find a high-relevance hook).
                        - SOCIAL PROOF: "${topic}". This is YOUR latest milestone project demonstrating capability.
                        - OBJECTIVE: ${type}.
                        ${objectiveContexts[type] || ""}

                        GOAL: 
                        ${styleGuide ? 
                            `PERSONALIZATION TASK: Use the "Approved Master Draft" (HTML) provided above as your structural anchor. You MUST mirror its unique wording, tone, and specific value proposition. 
                            
                            CRITICAL SMART LOGIC:
                            1. VARIABLE REPLACEMENT: If you find placeholders like {{greeting}}, {{clientName}}, {{industry}}, {{contactPerson}}, or {{tenureYears}}, replace them with the corresponding client data: ${greeting}, ${client.clientName}, ${client.industry}, ${client.contactPerson || 'Partner'}, ${tenureYears}.
                            2. HTML HYGIENE: Preserve all HTML tags and inline styles 1:1. Only change the text content. 
                            3. NO CODE BLOCKS: Do NOT wrap your response in markdown code blocks like \`\`\`html. Return PURE HTML string only.
                            4. BESPOKE ADAPTATION: Weave in their specific context while maintaining the approved structural identicality to the Master Draft.` : 
                            `GENERATION TASK: Write an "Executive Advisory" email from scratch that uses "${topic}" to provoke a strategic realization. It must feel 100% genuine, smart, and peer-to-peer. Return valid HTML segment (paragraphs, bolding etc).
                            
                            CRITICAL: The email MUST start with the following greeting: ${greeting}`
                        }

                        CRITICAL CONSTRAINTS:
                        - NO AI CLICHES: Zero tolerance for "I hope this finds you well", "In today's landscape", "Leverage", "Synergy", or "I'm writing to".
                        - NO OVER-ENTHUSIASM: No exclamation marks. Use calm, authoritative business logic.
                        - VARIED STRUCTURE: Mix short, analytical observations with nuanced reasoning.
                        - DIRECT START: Start with a sharp industry observation anchored by ${topic} or a relationship milestone.
                        - MASTER DRAFT SYNC: If an Approved Master Draft is present, your output MUST be a high-fidelity personalization of that draft. Do not deviate from its core message or its HTML layout.
                        - SINGLE SUBJECT: Return ONLY the subject line for the "subject" field and ONLY the body for the "body" field.

                        ${!styleGuide ? `
                        NARRATIVE FLOW:
                        1. BENCHMARK OBSERVATION: How "${topic}" has shifted the benchmark in ${client.industry}.
                        2. THE "FRICTION" PROVOCATION: Identify a specific, non-obvious friction point for ${client.clientName} (related to ${coreMessage}) that will cause them to lag behind this benchmark.
                        3. ADVISORY BRIDGE: Position your philosophy ("${settings.brandResonance}") as the solver for this specific friction.
                        4. LOW-FRICTION INQUIRY: Use "${cta}" to pivot to a high-level strategic discussion.
                        ` : ""}

                        STYLE: Formal, Intellectual, Observant. Signature is managed by template.
                        
                        OUTPUT: PURE JSON { "subject": "...", "body": "...", "leadStrength": 0-100, "spamRisk": 0-100 }.
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
