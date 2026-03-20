import { beforeEach, describe, expect, it, vi } from "vitest";

const groupByMock = vi.fn();
const countMock = vi.fn();
const findManyMock = vi.fn();

vi.mock("@/lib/prisma", () => ({
    default: {
        client: {
            groupBy: groupByMock,
            count: countMock,
            findMany: findManyMock,
        },
        campaignHistory: {
            count: countMock,
            findMany: findManyMock,
        },
        service: {
            findMany: findManyMock,
        },
    },
}));

vi.mock("@/lib/api-response", () => ({
    ok: (data: unknown) => ({ success: true, data }),
    error: (code: string, message: string) => ({ success: false, error: { code, message } }),
}));

describe("/api/stats GET response contract", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        groupByMock
            .mockResolvedValueOnce([{ relationshipLevel: "Active", _count: 3 }])
            .mockResolvedValueOnce([{ industry: "IT", _count: 3 }])
            .mockResolvedValueOnce([{ source: "INVOICE_SYSTEM", gmailSourceAccount: null, _count: 3 }]);

        countMock
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(2)
            .mockResolvedValueOnce(10)
            .mockResolvedValueOnce(8)
            .mockResolvedValueOnce(2)
            .mockResolvedValueOnce(0)
            .mockResolvedValueOnce(1);

        findManyMock
            .mockResolvedValueOnce([{ serviceName: "SEO", _count: { clients: 4 } }])
            .mockResolvedValueOnce([{ dateCreated: new Date() }])
            .mockResolvedValueOnce([{ createdAt: new Date() }])
            .mockResolvedValueOnce([
                {
                    id: "1",
                    campaignType: "Broadcast",
                    dateCreated: new Date(),
                    client: { clientName: "Acme", industry: "IT" },
                },
            ]);
    });

    it("includes backward-compatible and new smart dashboard fields", async () => {
        const { GET } = await import("@/app/api/stats/route");
        const res = await GET();
        expect(res.success).toBe(true);
        expect(res.data).toHaveProperty("stats");
        expect(res.data).toHaveProperty("sourceStats");
        expect(res.data).toHaveProperty("dataHealth");
        expect(res.data).toHaveProperty("audienceState");
        expect(res.data).toHaveProperty("campaignState");
        expect(res.data).toHaveProperty("recommendedAction");
        expect(res.data).toHaveProperty("processChecklist");
        expect(Array.isArray(res.data.processChecklist)).toBe(true);
    }, 15000);
});

