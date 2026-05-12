import Groq from "groq-sdk";
import OpenAI from "openai";
import { getGlobalSettings } from "./settings";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

type RunAiOptions = {
  messages: ChatMessage[];
  temperature?: number;
  responseFormat?: "json_object";
  modelOverride?: string;
};

type ProviderName = "groq" | "openrouter";

type AiRouteResult = {
  content: string;
  providerUsed: ProviderName;
  fallbackActive: boolean;
  groqRetryAt: string | null;
};

type GroqHealthState = {
  cooldownUntilMs: number;
  reason: string | null;
  lastFailureAtMs: number | null;
};

const DEFAULT_GROQ_COOLDOWN_MINUTES = Number(process.env.GROQ_COOLDOWN_MINUTES || 15);
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

const groqState: GroqHealthState = {
  cooldownUntilMs: 0,
  reason: null,
  lastFailureAtMs: null,
};

function isGroqInCooldown() {
  return Date.now() < groqState.cooldownUntilMs;
}

function getGroqRetryAtIso() {
  if (!isGroqInCooldown()) return null;
  return new Date(groqState.cooldownUntilMs).toISOString();
}

function clearGroqCooldown() {
  groqState.cooldownUntilMs = 0;
  groqState.reason = null;
}

function isGroqRateLimitLikeError(err: any) {
  const msg = String(err?.message || err || "").toLowerCase();
  const status = Number(err?.status || err?.response?.status || 0);
  const code = String(err?.code || err?.error?.code || "").toLowerCase();
  return (
    status === 429 ||
    msg.includes("rate limit") ||
    msg.includes("too many requests") ||
    msg.includes("quota") ||
    msg.includes("insufficient_quota") ||
    code.includes("rate_limit") ||
    code.includes("insufficient_quota")
  );
}

function startGroqCooldown(reason: string) {
  const cooldownMs = Math.max(1, DEFAULT_GROQ_COOLDOWN_MINUTES) * 60 * 1000;
  groqState.cooldownUntilMs = Date.now() + cooldownMs;
  groqState.reason = reason;
  groqState.lastFailureAtMs = Date.now();
}

async function runWithGroq(options: RunAiOptions, model: string, apiKey: string) {
  const groq = new Groq({ apiKey });
  const completion = await groq.chat.completions.create({
    messages: options.messages,
    model,
    temperature: options.temperature,
    ...(options.responseFormat ? { response_format: { type: options.responseFormat } } : {}),
  });
  return completion.choices[0]?.message?.content || "";
}

async function runWithOpenRouter(options: RunAiOptions, apiKey: string) {
  const openrouter = new OpenAI({
    apiKey,
    baseURL: OPENROUTER_BASE_URL,
  });
  const completion = await openrouter.chat.completions.create({
    messages: options.messages,
    model: options.modelOverride || OPENROUTER_MODEL,
    temperature: options.temperature,
    ...(options.responseFormat ? { response_format: { type: options.responseFormat } } : {}),
  });
  return completion.choices[0]?.message?.content || "";
}

export async function runAiWithFallback(options: RunAiOptions): Promise<AiRouteResult> {
  const settings = await getGlobalSettings();
  const groqKey = settings.groqApiKey || process.env.GROQ_API_KEY || "";
  const openrouterKey = settings.openrouterApiKey || process.env.OPENROUTER_API_KEY || "";
  const groqModel = options.modelOverride || settings.aiModel || "llama-3.3-70b-versatile";

  const hasGroq = !!groqKey && !groqKey.includes("your_");
  const hasOpenRouter = !!openrouterKey && !openrouterKey.includes("your_");

  if (!hasGroq && !hasOpenRouter) {
    throw new Error("No AI provider keys configured (Groq/OpenRouter).");
  }

  const tryGroqFirst = hasGroq && !isGroqInCooldown();

  if (tryGroqFirst) {
    try {
      const content = await runWithGroq(options, groqModel, groqKey);
      clearGroqCooldown();
      return {
        content,
        providerUsed: "groq",
        fallbackActive: false,
        groqRetryAt: null,
      };
    } catch (err: any) {
      if (isGroqRateLimitLikeError(err)) {
        startGroqCooldown(err?.message || "Groq rate limit/quota");
      }
      if (!hasOpenRouter) throw err;
      const content = await runWithOpenRouter(options, openrouterKey);
      return {
        content,
        providerUsed: "openrouter",
        fallbackActive: true,
        groqRetryAt: getGroqRetryAtIso(),
      };
    }
  }

  if (!hasOpenRouter && hasGroq) {
    // Groq only mode, even if cooldown was active and OR key missing.
    const content = await runWithGroq(options, groqModel, groqKey);
    clearGroqCooldown();
    return {
      content,
      providerUsed: "groq",
      fallbackActive: false,
      groqRetryAt: null,
    };
  }

  // Cooldown path -> use OpenRouter directly.
  const content = await runWithOpenRouter(options, openrouterKey);
  return {
    content,
    providerUsed: "openrouter",
    fallbackActive: hasGroq,
    groqRetryAt: getGroqRetryAtIso(),
  };
}

export function getAiRoutingSnapshot() {
  return {
    groqFallbackActive: isGroqInCooldown(),
    groqRetryAt: getGroqRetryAtIso(),
    groqFallbackReason: groqState.reason,
  };
}

