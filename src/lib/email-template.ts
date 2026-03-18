/**
 * Premium Email Template Utility for Knowledge Factory
 * Provides a sophisticated HTML wrapper for AI-generated business communications.
 */

export function wrapInPremiumTemplate(content: string, recipientName: string, options?: { isPreview?: boolean }) {
    const year = new Date().getFullYear();
    const logoSrc = options?.isPreview ? "/logo.png" : "cid:logo";

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Executive Briefing - I Knowledge Factory Pvt. Ltd. Strategic Advisory</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td, p, a { font-family: Arial, sans-serif !important; }
    </style>
    <![endif]-->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

        body {
            margin: 0;
            padding: 0;
            background-color: #fcfcfc;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        .email-container {
            max-width: 680px;
            margin: 40px auto;
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            overflow: hidden;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }

        .header {
            padding: 50px 70px 30px;
            background-color: #ffffff;
            text-align: left;
        }


        .logo {
            max-height: 55px;
            float: right;
        }

        .content-body {
            padding: 0 70px 60px;
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 17px;
            line-height: 1.85;
            color: #27272a;
        }

        /* Typography Refinement */
        .content-body p {
            margin-bottom: 28px;
            font-weight: 400;
        }

        .content-body strong {
            color: #000000;
            font-weight: 600;
            background-color: #f0f7ff;
            padding: 0 2px;
        }

        .content-body h1, .content-body h2 {
            font-family: 'Playfair Display', serif;
            font-size: 28px;
            color: #09090b;
            margin: 40px 0 20px;
            line-height: 1.3;
        }

        .content-body ul, .content-body ol {
            margin-bottom: 28px;
            padding-left: 20px;
        }

        .content-body li {
            margin-bottom: 12px;
        }

        .content-body blockquote {
            border-left: 4px solid #2563eb;
            background-color: #f8faff;
            padding: 20px 25px;
            margin: 30px 0;
            font-style: italic;
            color: #1e40af;
        }

        .executive-signature {
            border-top: 1px solid #f1f5f9;
            margin-top: 50px;
            padding-top: 30px;
        }

        .signature-name {
            font-family: 'Playfair Display', serif;
            font-style: italic;
            font-size: 22px;
            color: #1e40af;
            margin-bottom: 8px;
        }

        .signature-title {
            font-family: 'Outfit', sans-serif;
            font-size: 13px;
            font-weight: 600;
            color: #71717a;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .footer {
            padding: 40px 70px;
            background-color: #f9fafb;
            border-top: 1px solid #f1f5f9;
        }

        .footer-text {
            font-family: 'Outfit', sans-serif;
            font-size: 12px;
            color: #94a3b8;
            line-height: 1.6;
        }

        .tagline {
            font-family: 'Outfit', sans-serif;
            font-size: 9px;
            font-weight: 700;
            color: #cbd5e1;
            text-transform: uppercase;
            letter-spacing: 0.4em;
            margin-top: 30px;
            text-align: center;
        }


        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 0;
                border: none;
            }
            .header, .content-body, .footer {
                padding: 40px 25px;
            }
            .logo {
                float: none;
                margin-bottom: 20px;
                display: block;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="${logoSrc}" alt="I Knowledge Factory Pvt. Ltd." class="logo">
        </div>
        
        <div class="content-body">
            ${content}
            
            <div class="executive-signature">
                <div class="signature-name">Strategic Partnership Team</div>
                <div class="signature-title">I Knowledge Factory Pvt. Ltd.</div>
            </div>
        </div>

        <div class="footer">
            <div class="footer-text">
                <strong>Disclaimer:</strong> This communication contains proprietary insights curated by I Knowledge Factory Pvt. Ltd.. It is intended solely for ${recipientName || 'the designated recipient'} and may not be distributed without authorization.<br><br>
                &copy; ${year} I Knowledge Factory. All rights reserved.<br>
                Innovation Hub | Pune | Mumbai
            </div>
            <div class="tagline">craft | care | amplify</div>
        </div>
    </div>
</body>
</html>
    `.trim();
}
