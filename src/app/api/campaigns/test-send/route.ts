import { NextRequest } from "next/server";
import { z } from "zod";
import { sendStrategicEmail } from "@/lib/mail";
import { wrapInPremiumTemplate } from "@/lib/email-template";
import { ok, error } from "@/lib/api-response";

const testSendSchema = z.object({
    email: z.string().email(),
    subject: z.string().min(1),
    body: z.string().min(1)
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parser = testSendSchema.safeParse(body);

        if (!parser.success) {
            return error("BAD_REQUEST", "Invalid email data provided.");
        }

        const { email, subject, body: html } = parser.data;

        const result = await sendStrategicEmail({
            to: email,
            subject: `[TEST] ${subject}`,
            html: wrapInPremiumTemplate(html, "Valued Partner"),
            text: "This is a test email from Climacy Campaign Builder. Please view it in an HTML-compatible client."
        });

        if (result.success) {
            return ok({ message: "Test email sent successfully." });
        } else {
            return error("INTERNAL_ERROR", result.error || "Failed to send test email.");
        }
    } catch (err) {
        console.error("Test send API error:", err);
        return error("INTERNAL_ERROR", "Internal Server Error");
    }
}
