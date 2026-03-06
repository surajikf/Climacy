/**
 * Premium Email Template Utility for Knowledge Factory
 * Provides a sophisticated HTML wrapper for AI-generated business communications.
 */

export function wrapInPremiumTemplate(content: string, recipientName: string) {
    const year = new Date().getFullYear();

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Strategic Communication</title>
    <style>
        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f8fafc;
            padding-bottom: 40px;
        }
        .main {
            background-color: #ffffff;
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
            border-spacing: 0;
            font-family: sans-serif;
            color: #1e293b;
            border-radius: 8px;
            overflow: hidden;
            margin-top: 40px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .header {
            background-color: #ffffff;
            padding: 32px 40px;
            text-align: center;
            border-bottom: 1px solid #f1f5f9;
        }
        .logo-text {
            font-size: 24px;
            font-weight: 700;
            color: #2563eb;
            letter-spacing: -0.025em;
            margin: 0;
        }
        .content {
            padding: 40px;
            font-size: 16px;
            line-height: 1.7;
            color: #334155;
        }
        .content p {
            margin-bottom: 24px;
        }
        .content strong {
            color: #0f172a;
        }
        .content ul {
            padding-left: 20px;
            margin-bottom: 24px;
        }
        .content li {
            margin-bottom: 12px;
        }
        .footer {
            padding: 32px 40px;
            background-color: #f8fafc;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #f1f5f9;
        }
        .footer p {
            margin: 4px 0;
        }
        .accent-bar {
            height: 4px;
            background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <table class="main">
            <tr>
                <td class="accent-bar"></td>
            </tr>
            <tr>
                <td class="header">
                    <a href="https://www.ikf.co.in/" target="_blank" style="text-decoration: none; display: inline-block;">
                        <img src="cid:logo" alt="I Knowledge Factory Pvt. Ltd." style="height: 80px; width: auto; display: block; border: 0; margin: 0 auto;">
                    </a>
                </td>
            </tr>
            <tr>
                <td class="content">
                    ${content}
                </td>
            </tr>
            <tr>
                <td class="footer">
                    <p>&copy; ${year} I Knowledge Factory Pvt. Ltd. All rights reserved.</p>
                    <p>This is a strategic communication intended for ${recipientName}.</p>
                    <p>craft | care | amplify</p>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
    `.trim();
}
