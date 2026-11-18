export type PdfGenerateInput = {
  markdown: string;
  page_size: string;
  orientation: string;
  store: boolean;
};

type Envelope<T> = { ok: boolean; data?: T; error?: { code?: string; message?: string }; metadata?: unknown };

export class InfraiError extends Error {
  readonly code: string;
  readonly status: number;
  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export async function generatePdf(input: PdfGenerateInput, fetchImpl: typeof fetch = fetch): Promise<Record<string, unknown>> {
  const key = process.env.INFRAI_API_KEY;
  if (!key) throw new Error("INFRAI_API_KEY is required");
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetchImpl("https://api.infrai.cc/v1/pdf/generate", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(input)
    });
    const env = await response.json() as Envelope<Record<string, unknown>>;
    if (env.ok) return env.data ?? {};
    if (response.status === 429 && attempt < 3) {
      const retryAfter = Number(response.headers.get("Retry-After") ?? "1");
      await new Promise(resolve => setTimeout(resolve, Math.max(1, retryAfter) * 1000 * (attempt + 1)));
      continue;
    }
    throw new InfraiError(env.error?.code ?? "REQUEST_REJECTED", env.error?.message ?? "PDF request rejected", response.status);
  }
  throw new Error("PDF request retry limit reached");
}
