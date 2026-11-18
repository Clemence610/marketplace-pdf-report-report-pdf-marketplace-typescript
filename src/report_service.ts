import { z } from "zod";
import { generatePdf } from "./infrai_client.js";

const SellerAsset = z.object({ sku: z.string(), title: z.string(), units: z.number().int().nonnegative() });
const BuyerUpdate = z.object({ buyer: z.string(), note: z.string() });
export const ReportRequest = z.object({
  period: z.string().min(1),
  seller: z.string().min(1),
  assets: z.array(SellerAsset),
  buyer_updates: z.array(BuyerUpdate),
  handoff_order: z.string().min(1),
  handoff_status: z.enum(["ready", "pending"])
});
export type ReportRequest = z.infer<typeof ReportRequest>;

export function renderMarketplaceReport(input: ReportRequest): string {
  const lines = [`# Marketplace report: ${input.period}`, `Seller: ${input.seller}`, "", "## Seller assets", "| SKU | Item | Units |", "| --- | --- | ---: |"];
  for (const asset of input.assets) lines.push(`| ${asset.sku} | ${asset.title} | ${asset.units} |`);
  lines.push("", "## Buyer updates");
  for (const update of input.buyer_updates) lines.push(`- **${update.buyer}**: ${update.note}`);
  lines.push("", "## Order handoff", `Order **${input.handoff_order}** is **${input.handoff_status}**.`);
  return lines.join("\n");
}

export async function createArchivedReport(raw: unknown): Promise<{ markdown: string; pdf: Record<string, unknown> }> {
  const input = ReportRequest.parse(raw);
  const markdown = renderMarketplaceReport(input);
  const pdf = await generatePdf({ markdown, page_size: "A4", orientation: "portrait", store: true });
  return { markdown, pdf };
}
