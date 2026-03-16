import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, init })),
  },
}));

const globalSettingsMock = vi.fn();

vi.mock("@/lib/prisma", () => ({
  default: {
    globalSettings: {
      findFirst: globalSettingsMock,
    },
    client: {
      upsert: vi.fn(),
      deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
    },
  },
}));

vi.mock("next-auth/jwt", () => ({
  getToken: vi.fn().mockResolvedValue({ role: "ADMIN" }),
}));

describe("/api/import/zoho POST", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns 400 when Zoho is not connected", async () => {
    globalSettingsMock.mockResolvedValueOnce(null);

    const { POST: importZoho } = await import("@/app/api/import/zoho/route");

    const res = await importZoho(new Request("http://localhost", { method: "POST" }));

    expect(res.init?.status).toBe(400);
    expect(res.body).toMatchObject({
      error: "Zoho is not connected. Please configure and authorize Zoho first.",
    });
  });
});

