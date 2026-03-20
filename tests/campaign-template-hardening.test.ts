import { describe, expect, it } from "vitest";
import { EMAIL_TEMPLATE_IDS, normalizeTemplateId, recommendTemplateId, wrapInEmailTemplate } from "@/lib/email-template";
import { parseCampaignGeneratedOutput } from "@/lib/campaign-output";

describe("campaign template hardening", () => {
    it("normalizes unknown template ids to premium", () => {
        expect(normalizeTemplateId(undefined)).toBe("premium");
        expect(normalizeTemplateId("")).toBe("premium");
        expect(normalizeTemplateId("foo-template")).toBe("premium");
        expect(normalizeTemplateId("modern")).toBe("modern");
    });

    it("parses valid campaign payload and normalizes template id", () => {
        const parsed = parseCampaignGeneratedOutput(
            JSON.stringify({
                subject: "Hello from IKF",
                body: "<p>Body</p>",
                templateId: "invalid-template",
            }),
        );

        expect(parsed.subject).toBe("Hello from IKF");
        expect(parsed.body).toBe("<p>Body</p>");
        expect(parsed.templateId).toBe("premium");
    });

    it("preserves custom template keys", () => {
        const parsed = parseCampaignGeneratedOutput(
            JSON.stringify({
                subject: "Hello from IKF",
                body: "<p>Body</p>",
                templateId: "custom_test_template_123",
            }),
        );

        expect(parsed.templateId).toBe("custom_test_template_123");
    });

    it("throws controlled errors for malformed generatedOutput payloads", () => {
        expect(() => parseCampaignGeneratedOutput("not-json")).toThrow(
            "Campaign payload is not valid JSON.",
        );
        expect(() =>
            parseCampaignGeneratedOutput(JSON.stringify({ body: "<p>Only body</p>" })),
        ).toThrow("Campaign payload is missing a valid subject.");
        expect(() =>
            parseCampaignGeneratedOutput(JSON.stringify({ subject: "Only subject" })),
        ).toThrow("Campaign payload is missing a valid body.");
    });

    it("renders distinct structural markers for each template", () => {
        const rendered = EMAIL_TEMPLATE_IDS.map((id) =>
            wrapInEmailTemplate(id, "<p>Hello Partner,</p><p>This is a brief.</p>", "Acme", {
                isPreview: true,
            }),
        );
        const uniqueSet = new Set(rendered);
        expect(uniqueSet.size).toBe(EMAIL_TEMPLATE_IDS.length);

        for (let i = 0; i < EMAIL_TEMPLATE_IDS.length; i++) {
            expect(rendered[i]).toContain(`data-template-id=\"${EMAIL_TEMPLATE_IDS[i]}\"`);
            expect(rendered[i]).toContain(`hero--${EMAIL_TEMPLATE_IDS[i]}`);
        }
    });

    it("recommends smart templates based on campaign context", () => {
        expect(recommendTemplateId({ campaignType: "Broadcast", tone: "Advisory" })).toBe("modern");
        expect(recommendTemplateId({ campaignType: "Reactivation", tone: "Trust-building" })).toBe("warm");
        expect(recommendTemplateId({ campaignType: "Cross-Sell", tone: "Professional" })).toBe("corporate");
        expect(recommendTemplateId({ tone: "Premium", coreMessage: "Exclusive strategic insight for your team." })).toBe("premium");
    });

    it("replaces custom template placeholders safely", () => {
        const rendered = wrapInEmailTemplate(
            "custom_test_template_456",
            "<p>Hello Partner,</p><p>This is a brief.</p>",
            "Acme",
            {
                isPreview: true,
                templateSpec: {
                    styles: "/* empty */",
                    layoutHtml: `
{{hero}}
{{intro}}
{{insight}}
{{bullets}}
{{quotes}}
{{remainder}}
{{cta}}
{{signature}}
{{footer}}
{{logo}}
`.trim(),
                },
            },
        );

        expect(rendered).toContain('data-template-id="custom_test_template_456"');
        expect(rendered).toContain("hero--custom");
        expect(rendered).not.toContain("{{hero}}");
        expect(rendered).not.toContain("{{intro}}");
    });
});
