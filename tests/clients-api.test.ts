import { describe, it, expect, vi, beforeEach } from "vitest";
import * as emailUtils from "@/lib/email-utils";

vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, init })),
  },
}));

const createMock = vi.fn();

vi.mock("@/lib/prisma", () => ({
  default: {
    client: {
      create: createMock,
    },
  },
}));

describe("/api/clients POST", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (emailUtils as any).isRoleBasedEmail = vi.fn().mockReturnValue(true);
  });

  it("creates a client and computes isRoleBased from email", async () => {
    createMock.mockResolvedValueOnce({ id: "1", clientName: "Acme Corp" });

    const { POST: createClient } = await import("@/app/api/clients/route");

    const request = {
      json: async () => ({
        clientName: "Acme Corp",
        contactPerson: "John Doe",
        email: "info@acme.com",
        industry: "IT",
        relationshipLevel: "Active",
        serviceIds: ["service-1"],
      }),
    } as any;

    const res = await createClient(request);

    expect(createMock).toHaveBeenCalledWith({
      data: {
        clientName: "Acme Corp",
        contactPerson: "John Doe",
        email: "info@acme.com",
        industry: "IT",
        relationshipLevel: "Active",
        isRoleBased: true,
        services: {
          connect: [{ id: "service-1" }],
        },
      },
    });

    expect(res).toEqual({
      body: { id: "1", clientName: "Acme Corp" },
      init: undefined,
    });
  });

  it("returns 400 when Prisma unique constraint error occurs", async () => {
    createMock.mockRejectedValueOnce({ code: "P2002" });

    const { POST: createClient } = await import("@/app/api/clients/route");

    const request = {
      json: async () => ({
        clientName: "Duplicate Corp",
        contactPerson: "Jane Doe",
        email: "duplicate@corp.com",
        industry: "IT",
        relationshipLevel: "Active",
        serviceIds: [],
      }),
    } as any;

    const res = await createClient(request);

    expect(res.init?.status).toBe(400);
    expect(res.body).toMatchObject({
      error: "A client with this email already exists.",
    });
  });
});


