import assert from "node:assert/strict";
import { renderMarketplaceReport, ReportRequest } from "./report_service.js";

const input = ReportRequest.parse({ period: "2026-W36", seller: "Shop", assets: [], buyer_updates: [], handoff_order: "ORD-1", handoff_status: "ready" });
const markdown = renderMarketplaceReport(input);
assert.match(markdown, /Order \*\*ORD-1\*\* is \*\*ready\*\*/);
assert.throws(() => ReportRequest.parse({ ...input, handoff_status: "lost" }));
console.log("report decision test passed");
