// ═══════════════════════════════════════════════════════════════════════════
// Membership API — Pay-For-Convenience Tier Management
// Free → Standard ($5) → Gold ($15) → Enterprise ($50/seat)
// We save consumers costs through synergy, not profit from them.
//
// Superinstance & Lucineer (DiGennaro et al.) — 2026-04-03
// ═══════════════════════════════════════════════════════════════════════════

const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:*;";
interface Env { MEMBERSHIP_KV: KVNamespace; }

type Tier = 'free' | 'standard' | 'gold' | 'enterprise';

interface Member {
  id: string;
  email: string;
  tier: Tier;
  createdAt: number;
  requestCount: number;
  lastRequest: number | null;
  domains: string[];     // custom domains bound
  vessels: string[];     // fleet vessels deployed
  stripeId?: string;
}

interface TierConfig {
  id: Tier; name: string; price: number; priceLabel: string;
  reqPerDay: number; costPlus: number; // percentage markup
  features: string[];
  color: string;
}

const TIERS: Record<Tier, TierConfig> = {
  free:      { id:'free', name:'Free', price:0, priceLabel:'$0', reqPerDay:50, costPlus:20, features:['50 req/day','20% cost-plus','ads','single vessel','community support'], color:'#64748b' },
  standard:  { id:'standard', name:'Standard', price:5, priceLabel:'$5/mo', reqPerDay:5000, costPlus:2, features:['5K req/day','2% cost-plus','no ads','5 vessels','priority support'], color:'#3b82f6' },
  gold:      { id:'gold', name:'Gold', price:15, priceLabel:'$15/mo', reqPerDay:Infinity, costPlus:0, features:['Unlimited req','at cost','no ads','20 vessels','Docker containers','API access','dedicated support'], color:'#f59e0b' },
  enterprise:{ id:'enterprise', name:'Enterprise', price:50, priceLabel:'$50/seat/mo', reqPerDay:Infinity, costPlus:0, features:['Unlimited everything','at cost','SLA','custom domains','SSO','compliance','phone support','white-label'], color:'#a78bfa' },
};

function landingPage(): string {
  const tiers = Object.values(TIERS);
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cocapn Membership — Pay For Convenience</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui;background:#0a0a1a;color:#e2e8f0}
.hero{text-align:center;padding:3rem 2rem;background:radial-gradient(ellipse at 50% 0%,#1a0a2e 0%,#0a0a1a 70%)}
.hero h1{font-size:2.2rem;background:linear-gradient(135deg,#7c3aed,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{color:#94a3b8;max-width:600px;margin:.75rem auto 0;line-height:1.6}
.philosophy{background:#111;border:1px solid #334155;border-radius:12px;padding:1.5rem;max-width:700px;margin:2rem auto;text-align:center}
.philosophy strong{color:#10b981}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;padding:2rem;max-width:1100px;margin:0 auto}
.card{background:#111;border:1px solid #1e293b;border-radius:12px;padding:1.5rem;position:relative;transition:border-color .2s}
.card:hover{border-color:${tiers.map(t=>t.color).join(',')};transform:translateY(-2px)}
.card.featured{border-color:#f59e0b;box-shadow:0 0 20px #f59e0b22}
.badge{position:absolute;top:-.6rem;left:1rem;padding:.2rem .6rem;border-radius:8px;font-size:.7rem;font-weight:700;background:#f59e0b;color:#0a0a1a}
.card h3{font-size:1.1rem;color:${tiers.map(t=>t.color).join(',')};margin-bottom:.25rem}
.price{font-size:2rem;font-weight:800;margin:.5rem 0}.price span{font-size:.85rem;color:#64748b;font-weight:400}
.features{list-style:none;padding:0;margin:.75rem 0}
.features li{padding:.3rem 0;font-size:.85rem;color:#94a3b8}
.features li::before{content:'✓ ';color:#10b981}
.cta{display:block;width:100%;padding:.6rem;border:none;border-radius:8px;font-weight:600;cursor:pointer;margin-top:.5rem;font-size:.85rem}
.cta-free{background:#334155;color:#e2e8f0}.cta-paid{background:linear-gradient(135deg,#7c3aed,#3b82f6);color:white}
.footer{text-align:center;padding:2rem;color:#475569;font-size:.75rem}
</style></head><body>
<div class="hero">
      <img src="https://cocapn-logos.casey-digennaro.workers.dev/img/cocapn-logo-v1.png" alt="Cocapn" style="width:64px;height:auto;margin-bottom:.5rem;border-radius:8px;display:block;margin-left:auto;margin-right:auto">
      <h1>🚢 Cocapn Membership</h1><p>Pay for convenience, not for AI. We save you money through bulk inference pricing and community development. You keep the savings.</p></div>
<div class="philosophy"><strong>Our philosophy:</strong> We make money from SAVING you costs, not charging you more. Membership fees + bulk inference synergy + optional ad revenue (free tier) = sustainable. You always pay less than going direct.</div>
<div class="grid">
${tiers.map((t,i)=>`<div class="card${t.id==='gold'?' featured':''}">
${t.id==='gold'?'<div class="badge">MOST POPULAR</div>':''}
<h3>${t.name}</h3>
<div class="price">${t.priceLabel}<span>${t.id!=='free'?'/mo':''}</span></div>
<ul class="features">${t.features.map(f=>'<li>'+f+'</li>').join('')}</ul>
<button class="cta ${t.id==='free'?'cta-free':'cta-paid'}" onclick="window.location.href='/api/tiers/${t.id}'">${t.id==='free'?'Get Started':'Choose '+t.name}</button>
</div>`).join('')}
</div>
<div class="footer">Superinstance & Lucineer (DiGennaro et al.) — 2026-04-03</div>
</body></html>`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const h = { 'Content-Type': 'application/json', 'Content-Security-Policy': CSP };
    const hh = { 'Content-Type': 'text/html;charset=UTF-8', 'Content-Security-Policy': CSP };

    if (url.pathname === '/') return new Response(landingPage(), { headers: hh });
    if (url.pathname === '/health') {
      const count = (await env.MEMBERSHIP_KV.list({ prefix: 'member:', limit: 1 })).keys.length;
      return new Response(JSON.stringify({ status: 'ok', vessel: 'membership-api', members: count }), { headers: h });
    }

    // Tier info
    if (url.pathname === '/api/tiers') {
      return new Response(JSON.stringify({ tiers: TIERS }), { headers: h });
    }
    if (url.pathname.startsWith('/api/tiers/') && request.method === 'GET') {
      const tierId = url.pathname.split('/')[3] as Tier;
      const tier = TIERS[tierId];
      if (!tier) return new Response(JSON.stringify({ error: 'unknown tier' }), { status: 404, headers: h });
      return new Response(JSON.stringify(tier), { headers: h });
    }

    // Register member
    if (url.pathname === '/api/members' && request.method === 'POST') {
      const body = await request.json() as { email: string; tier?: Tier };
      const id = crypto.randomUUID().slice(0, 8);
      const member: Member = {
        id, email: body.email, tier: body.tier || 'free',
        createdAt: Date.now(), requestCount: 0, lastRequest: null,
        domains: [], vessels: [],
      };
      await env.MEMBERSHIP_KV.put(`member:${id}`, JSON.stringify(member));
      await env.MEMBERSHIP_KV.put(`email:${body.email}`, id);
      return new Response(JSON.stringify({ ...member, apiKey: `cpn_${id}_${crypto.randomUUID().slice(0, 16)}` }), { headers: h, status: 201 });
    }

    // List members
    if (url.pathname === '/api/members' && request.method === 'GET') {
      const tier = url.searchParams.get('tier') as Tier | null;
      const list = await env.MEMBERSHIP_KV.list({ prefix: 'member:', limit: 100 });
      const members: Member[] = [];
      for (const key of list.keys) {
        const m = await env.MEMBERSHIP_KV.get<Member>(key.name, 'json');
        if (m && (!tier || m.tier === tier)) members.push(m);
      }
      return new Response(JSON.stringify({ count: members.length, members }), { headers: h });
    }

    // Rate limit check
    if (url.pathname === '/api/rate-limit' && request.method === 'POST') {
      const body = await request.json() as { memberId: string };
      const member = await env.MEMBERSHIP_KV.get<Member>(`member:${body.memberId}`, 'json');
      if (!member) return new Response(JSON.stringify({ error: 'not found' }), { status: 404, headers: h });
      const tier = TIERS[member.tier];
      const today = new Date().toISOString().slice(0, 10);
      const dailyKey = `daily:${member.id}:${today}`;
      const daily = parseInt(await env.MEMBERSHIP_KV.get(dailyKey) || '0');
      const allowed = tier.reqPerDay === Infinity || daily < tier.reqPerDay;
      if (allowed) {
        await env.MEMBERSHIP_KV.put(dailyKey, String(daily + 1), { expirationTtl: 86400 });
        member.requestCount++;
        member.lastRequest = Date.now();
        await env.MEMBERSHIP_KV.put(`member:${member.id}`, JSON.stringify(member));
      }
      return new Response(JSON.stringify({
        allowed, memberId: member.id, tier: member.tier,
        dailyUsed: daily + (allowed ? 1 : 0), dailyLimit: tier.reqPerDay === Infinity ? 'unlimited' : tier.reqPerDay,
        costPlus: tier.costPlus, remaining: tier.reqPerDay === Infinity ? Infinity : Math.max(0, tier.reqPerDay - daily - 1),
      }), { headers: h });
    }

    // Usage stats
    if (url.pathname === '/api/usage') {
      const list = await env.MEMBERSHIP_KV.list({ prefix: 'member:', limit: 100 });
      const byTier: Record<string, number> = { free: 0, standard: 0, gold: 0, enterprise: 0 };
      let totalReqs = 0;
      for (const key of list.keys) {
        const m = await env.MEMBERSHIP_KV.get<Member>(key.name, 'json');
        if (m) { byTier[m.tier] = (byTier[m.tier] || 0) + 1; totalReqs += m.requestCount; }
      }
      return new Response(JSON.stringify({ totalMembers: Object.values(byTier).reduce((a, b) => a + b, 0), byTier, totalRequests: totalReqs }), { headers: h });
    }

    // A2A: membership check for fleet
    if (url.pathname === '/api/a2a/check') {
      const apiKey = request.headers.get('Authorization')?.replace('Bearer ', '');
      if (!apiKey || !apiKey.startsWith('cpn_')) {
        return new Response(JSON.stringify({ allowed: false, reason: 'invalid api key' }), { status: 401, headers: h });
      }
      const memberId = apiKey.split('_')[1];
      const member = await env.MEMBERSHIP_KV.get<Member>(`member:${memberId}`, 'json');
      if (!member) return new Response(JSON.stringify({ allowed: false, reason: 'member not found' }), { status: 401, headers: h });
      const tier = TIERS[member.tier];
      return new Response(JSON.stringify({
        allowed: true, memberId: member.id, tier: member.tier,
        costPlus: tier.costPlus, features: tier.features,
      }), { headers: h });
    }

    return new Response('Not found', { status: 404 });
  },
};
