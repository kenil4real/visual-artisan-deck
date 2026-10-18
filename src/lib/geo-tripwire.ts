// Government-visitor watch for kekerainc.com.
// Runs inside the server entry on every request. If the visitor's IP belongs
// to a US government network (DHS/USCIS or other federal agency), Ramani gets
// an email alert immediately. Ordinary visitors (and bots) are ignored silently.
// Uses ip-api.com (free, no key) for IP -> org/ASN lookup. Noisy geo alerts
// were removed Oct 18, 2026 per his request.

const ALERT_FROM = "Kekera Site Watch <Divyaramani@kekerainc.com>";
const ALERT_TO = "ramani1880@gmail.com";

// Infrastructure IPs that should never trigger an alert (my own test servers).
// Update if the VM's egress IP changes. Header bypass is for ad-hoc tests.
const SKIP_IPS = new Set([
  "104.29.200.165", // Muse VM egress (Ashburn, VA) — Oct 16 2026
  "104.29.193.195", // Muse VM egress — Oct 17 2026 (rotates; header is the reliable skip)
]);
const SKIP_HEADER = "x-tripwire-skip";

const BOT_RE =
  /bot|crawler|spider|crawl|slurp|mediapartners|baidu|yandex|sogou|exabot|facebot|ia_archiver|pingdom|uptimerobot|monitor|vercel-screenshot|headless|curl|wget|httpie|python-requests|go-http/i;

// Matches US federal government networks in ip-api's org/isp fields.
const GOV_RE =
  /homeland security|\bdhs\b|u\.?s\.? citizenship|immigration services|\buscis\b|customs and border|federal government|u\.?s\.? government|general services administration|\bgsa\b|department of (justice|state|defense|treasury)|federal bureau/i;

function isPageView(request: Request, url: URL): boolean {
  if (request.method !== "GET") return false;
  const p = url.pathname;
  if (p.startsWith("/api/")) return false;
  if (/\.[a-z0-9]{2,5}$/i.test(p)) return false; // assets
  const accept = request.headers.get("accept") ?? "";
  return accept.includes("text/html");
}

async function lookupOrg(ip: string): Promise<string> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,org,isp,as`,
      { signal: ctrl.signal }
    );
    clearTimeout(t);
    if (!res.ok) return "";
    const data = (await res.json()) as { status?: string; org?: string; isp?: string; as?: string };
    if (data.status !== "success") return "";
    return [data.org, data.isp, data.as].filter(Boolean).join(" | ");
  } catch {
    return "";
  }
}

export function maybeAlertGovVisitor(request: Request): void {
  try {
    const url = new URL(request.url);
    if (!isPageView(request, url)) return;

    const ua = request.headers.get("user-agent") ?? "";
    if (BOT_RE.test(ua)) return;

    // Skip my own test traffic: explicit header or known infra IP.
    if (request.headers.get(SKIP_HEADER) === "1") return;
    const fwd = request.headers.get("x-forwarded-for") ?? "";
    const clientIp = (fwd.split(",")[0] ?? "").trim() || request.headers.get("x-real-ip") || "";
    if (!clientIp || SKIP_IPS.has(clientIp)) return;

    // Async + fire-and-forget: never slow down or break the page render.
    void (async () => {
      try {
        const org = await lookupOrg(clientIp);
        if (!org || !GOV_RE.test(org)) return; // not a government network — stay silent

        const when = new Date().toISOString();
        const country = request.headers.get("x-vercel-ip-country") ?? "";
        const region = request.headers.get("x-vercel-ip-country-region") ?? "";
        const city = request.headers.get("x-vercel-ip-city") ?? "";
        const where = [city, region, country].filter(Boolean).join(", ");
        const subject = `Government visitor on kekerainc.com: ${org.split(" | ")[0]}`;
        const text =
          `Someone from a US government network just visited the Kekera site.\n\n` +
          `When: ${when}\n` +
          `Page: ${url.pathname}\n` +
          `Network: ${org}\n` +
          `Location: ${where || "unknown"}\n` +
          `IP: ${clientIp}\n` +
          `Browser: ${ua.slice(0, 160)}\n`;

        const apiKey = process.env["RESEND_API_KEY"];
        if (!apiKey) {
          console.warn("[tripwire] no RESEND_API_KEY — gov visit not alerted:", org, url.pathname);
          return;
        }
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ from: ALERT_FROM, to: ALERT_TO, subject, text }),
        });
      } catch (e) {
        console.warn("[tripwire] gov check failed:", e);
      }
    })();
  } catch (e) {
    console.warn("[tripwire] check failed:", e);
  }
}
