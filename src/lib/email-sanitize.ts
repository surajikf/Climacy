/**
 * Lightweight email HTML sanitizer.
 * Email bodies are user/AI-provided HTML; we strip the most dangerous constructs
 * without adding heavy dependencies.
 */
export function sanitizeEmailHtml(input: string) {
  let html = (input ?? "").toString();

  // Remove script tags entirely
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // Remove inline event handlers like onclick="..."
  html = html.replace(/\son\w+\s*=\s*"[^"]*"/gi, "");
  html = html.replace(/\son\w+\s*=\s*'[^']*'/gi, "");
  html = html.replace(/\son\w+\s*=\s*[^\s>]+/gi, "");

  // Neutralize javascript: URLs in href/src
  html = html.replace(/\s(href|src)\s*=\s*(['"])\s*javascript:[^'"]*\2/gi, ' $1="#"');
  html = html.replace(/\s(href|src)\s*=\s*javascript:[^\s>]+/gi, ' $1="#"');

  return html.trim();
}

