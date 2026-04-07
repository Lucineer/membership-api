# Cocapn Fleet Membership API

Run your own membership and billing API without a third-party platform taking a percentage of your revenue. This is a production-ready forkable template, built for Cloudflare Workers.

Live reference instance: https://the-fleet.casey-digennaro.workers.dev/membership

## Quick Start

1.  **Fork this repository.**
2.  **Deploy to Cloudflare Workers.** You need a Cloudflare account with Workers and KV setup.
    ```bash
    npx wrangler deploy
    ```
3.  **Configure your membership tiers.** Edit `src/tiers.ts`. The default public tiers are:
    *   **$5 / month:** 5,000 daily requests, includes a 2% cost-plus margin.
    *   **$15 / month:** Unlimited daily requests, billed at your exact infrastructure cost.
4.  **Add your Stripe keys.** Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` as Worker secrets to enable live payments. Without these, the API operates in a demo mode.

## How It Works

You define membership tiers with specific daily request quotas, prices, and custom feature flags. The API automatically tracks per-member request counts against a KV counter that resets every 24 hours. It provides native Stripe checkout and webhook endpoints to handle subscriptions, renewals, and cancellations.

All application state (member records, usage counts) is stored in Cloudflare KV. The only external service dependency is Stripe for payment processing.

## Limitations

*   **Daily quotas reset at UTC midnight.** This is fixed and may not align with your users' local time zones.
*   **Usage tracking is per-request.** High-traffic endpoints may see added latency from KV reads/writes for each call.
*   **Stripe is required for payments.** The system is designed around Stripe's APIs and webhook model.

MIT License  
Superinstance and Lucineer (DiGennaro et al.)

<div style="text-align:center;padding:16px;color:#64748b;font-size:.8rem"><a href="https://the-fleet.casey-digennaro.workers.dev" style="color:#64748b">The Fleet</a> &middot; <a href="https://cocapn.ai" style="color:#64748b">Cocapn</a></div>