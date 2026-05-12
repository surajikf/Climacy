import { getGlobalSettings } from "@/backend/lib/settings";
import { getBackendSession } from "@/backend/lib/auth";
import { ok, error } from "@/backend/lib/api-response";
import { sendStrategicEmail } from "@/backend/lib/mail";
import prisma from "@/backend/lib/prisma";

/**
 * Sends a test email using a specific or default provider.
 */
export async function POST(request: Request) {
    try {
        const session = await getBackendSession(request);
        if (!session) return error("UNAUTHORIZED", "Active session required.", { status: 401 });

        const body = await request.json();
        const { nodeType, accountId } = body;

        const sessionEmail = session.user?.email || "unknown";
        console.log(`[TEST_EMAIL] Starting test for provider: ${nodeType} | Triggered by: ${sessionEmail}`);

        const testOptions = {
            to: sessionEmail,
            subject: `[SYSTEM] Test Email Verified - ${new Date().toLocaleTimeString()}`,
            html: `
                <div style="font-family: sans-serif; padding: 40px; background: #f8fafc; color: #1e293b; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <div style="margin-bottom: 24px;">
                        <span style="background: #3b82f6; color: white; padding: 4px 12px; border-radius: 99px; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">
                            Test Successful
                        </span>
                    </div>
                    <h1 style="color: #0f172a; margin-top: 0; font-weight: 800; letter-spacing: -0.025em;">Email Connection Verified</h1>
                    <p style="font-size: 14px; line-height: 1.6; color: #475569;">
                        The email connection for <strong>${nodeType}</strong> is working.
                        You can now send outreach messages from this account.
                    </p>
                    <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
                        Provider: ${nodeType} <br/>
                        Timestamp: ${new Date().toISOString()} <br/>
                        Triggered by: ${sessionEmail}
                    </div>
                </div>
            `
        };

        const forcedProvider = nodeType === "SMTP" ? "SMTP" : "GMAIL";
        const result: any = await sendStrategicEmail(testOptions, {
            forceProvider: forcedProvider,
            disableFailover: true,
            overrideGmailAccountId: forcedProvider === "GMAIL" ? accountId : undefined,
            userId: session.user?.id,
        });

        if (result.success) {
            return ok({ 
                message: "Test email sent successfully.", 
                messageId: result.messageId,
                failoverUsed: result.failoverOccurred || false
            });
        } else {
            return error("DISPATCH_FAILURE", `Email test failed: ${result.error}`, { status: 500 });
        }

    } catch (err: any) {
        console.error("Test email failure:", err);
        return error("INTERNAL_ERROR", "Internal error while sending test email.");
    }
}
