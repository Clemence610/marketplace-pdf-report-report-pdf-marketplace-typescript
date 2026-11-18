import { createArchivedReport } from "./report_service.js";

const sample = {
  period: "2026-W36", seller: "Harbor Street Goods",
  assets: [{ sku: "MUG-01", title: "Stoneware mug", units: 42 }, { sku: "TEE-07", title: "Checkout tee", units: 18 }],
  buyer_updates: [{ buyer: "Mina", note: "Address confirmed" }, { buyer: "Leo", note: "Gift message added" }],
  handoff_order: "ORD-1048", handoff_status: "ready"
};

const result = await createArchivedReport(sample);
console.log(JSON.stringify({ report: result.markdown, archived_pdf: result.pdf }, null, 2));
