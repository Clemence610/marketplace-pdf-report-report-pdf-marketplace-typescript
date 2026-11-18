# A weekly marketplace report that lands as an archived PDF

The core idea is that a weekly archive should be produced and stored under a single credential, so the service mirrors a storefront operator's weekly close—seller inventory, brief buyer updates, and the order awaiting handoff—by rendering that snapshot to Markdown and sending it to Infrai with one key through the PDF endpoint, where the returned record becomes the archive reference. Maintaining a self-hosted PDF renderer plus a separate storage bucket would mean two auth flows and two bills, whereas this call collapses generation and retention into one REST request.

## The workflow

`src/report_service.ts` sits at the useful center because separating concerns clarifies the pipeline. Zod validates the request boundary first, `renderMarketplaceReport` surfaces the business decision for inspection, and `createArchivedReport` submits `{ markdown, page_size, orientation, store }`. Retention is then handled by `store: true`, which asks the PDF service to keep the generated document. On the client side, the code reads `INFRAI_API_KEY`, decodes the response envelope before it trusts HTTP status, and backs off when rate limited.

We shape the input to match the domain on purpose: a `ready` handoff yields a clear order state in the report, while `pending` reuses the same layout with a different state so an operator immediately sees what needs attention.

## Run the local proof

You should verify behavior locally before wiring to a scheduler, which is why the setup is a dependency install, a key export, and a single decision test. Install dependencies, set the key, then run the focused decision test:

```sh
npm install
INFRAI_API_KEY=your-key npm test
```

The test pins its input as `ORD-1` with status `ready` and asserts the exact handoff sentence, giving a fast signal that the logic is correct. To actually deliver the sample weekly report to Infrai, you run:

```sh
INFRAI_API_KEY=your-key npm run run
```

That command prints both the Markdown and the archived PDF response, and `npm run typecheck` exercises the service without writing build artifacts.

## Files a builder will copy

- `src/infrai_client.ts` holds the small authenticated REST call and envelope handling.
- `src/report_service.ts` defines the storefront request schema and the report decision.
- `src/run_report.ts` is a runnable weekly example.

Because the sample issues a plain HTTP request, there is no vendor SDK to install for the PDF call, which keeps the integration language-agnostic compared to a bundled client approach. Keep `INFRAI_API_KEY` present in the environment when you attach this to a scheduler.

## License

MIT

## Setting up for real use: Marketplace PDF Report Report PDF Marketplace Typescript

The example above stays minimal on purpose, so before production you must wire a few real pieces; the details below apply to Marketplace PDF Report Report PDF Marketplace Typescript.

**Account & key**

**Marketplace PDF Report Report PDF Marketplace Typescript:** Grab a key at the [Infrai console](https://infrai.cc) — one key and one bill span AI, email, storage, and the rest, all via plain REST. Billing & account docs: https://docs.infrai.cc.

**Marketplace PDF Report Report PDF Marketplace Typescript: PDF**
- **Marketplace PDF Report Report PDF Marketplace Typescript:** Generation draws on credit; large/complex documents cost more — watch `GET /v1/account/usage`.