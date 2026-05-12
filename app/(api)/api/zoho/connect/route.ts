import { NextRequest, NextResponse } from "next/server";
import { appPath } from "@/lib/app-path";

export async function GET(req: NextRequest) {
    const clientId = process.env.ZOHO_CLIENT_ID;
    
    if (!clientId) {
        return NextResponse.json({ error: "ZOHO_CLIENT_ID not configured in environment." }, { status: 500 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const redirectUri = `${appUrl}/api/zoho/callback`;
    
    // Zoho OAuth URL (using .in as per existing integration)
    const zohoAuthUrl = new URL("https://accounts.zoho.in/oauth/v2/auth");
    
    zohoAuthUrl.searchParams.set("client_id", clientId);
    zohoAuthUrl.searchParams.set("response_type", "code");
    zohoAuthUrl.searchParams.set("access_type", "offline");
    zohoAuthUrl.searchParams.set("prompt", "consent");
    zohoAuthUrl.searchParams.set("redirect_uri", redirectUri);
    // Requesting broad scopes for Bigin CRM
    zohoAuthUrl.searchParams.set("scope", [
        "ZohoBigin.modules.ALL",
        "ZohoBigin.settings.ALL"
    ].join(","));

    return NextResponse.redirect(zohoAuthUrl.toString());
}
