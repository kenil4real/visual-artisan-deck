// Out-of-area visitor tripwire for kekerainc.com.
// Runs inside the server entry on every request. If a real (non-bot) visitor
// loads a page from outside PA/NJ, Ramani gets an email alert immediately.
// Uses Vercel's geo headers (x-vercel-ip-country-region etc.) — no external API.
// FROM uses Resend's test address until kekerainc.com is domain-verified;
// switch ALERT_FROM to "Kekera Site Watch <Divyaramani@kekerainc.com>" after verification.

const ALERT_FROM = "Kekera Site Watch <onboarding@resend.dev>";
const ALERT_TO = "ramani1880@gmail.com";

const HOME_STATES = new Set(["PA", "NJ"]);

// Infrastructure IPs that should never trigger an alert (my own test servers).
// Update if the VM's egress IP changes. Header bypass is for ad-hoc tests.
const SKIP_IPS = new Set([
  "104.29.200.165", // Muse VM egress (Ashburn, VA) — Oct 16 2026
  "104.29.193.195", // Muse VM egress — Oct 17 2026 (rotates; header is the reliable skip)
]);
const SKIP_HEADER = "x-tripwire-skip";

const BOT_RE =
  /bot|crawler|spider|crawl|slurp|mediapartners|baidu|yandex|sogou|exabot|facebot|ia_archiver|pingdom|uptimerobot|monitor|vercel-screenshot|headless|curl|wget|httpie|python-requests|go-http/i;

function isPageView(request: Request, url: URL): boolean {
  if (request.method !== "GET") return false;
  const p = url.pathname;
  if (p.startsWith("/api/")) return false;
  if (/\.[a-z0-9]{2,5}$/i.test(p)) return false; // assets
  const accept = request.headers.get("accept") ?? "";
  return accept.includes("text/html");
}

export function maybeAlertOutOfArea(request: Request): void {
  try {
    const url = new URL(request.url);
    if (!isPageView(request, url)) return;

    const ua = request.headers.get("user-agent") ?? "";
    if (BOT_RE.test(ua)) return;

    // Skip my own test traffic: explicit header or known infra IP.
    if (request.headers.get(SKIP_HEADER) === "1") return;
    const fwd = request.headers.get("x-forwarded-for") ?? "";
    const clientIp = fwd.split(",")[0].trim() || request.headers.get("x-real-ip") || "";
    if (clientIp && SKIP_IPS.has(clientIp)) return;

    const country = request.headers.get("x-vercel-ip-country") ?? "";
    const region = request.headers.get("x-vercel-ip-country-region") ?? "";
    const city = request.headers.get("x-vercel-ip-city") ?? "";
    if (!country) return; // not on Vercel / no geo data — nothing to check

    if (country === "US" && HOME_STATES.has(region)) return; // home turf

    const when = new Date().toISOString();
    const where = [city, region, country].filter(Boolean).join(", ");
    const subject = `Out-of-area visitor: ${where || "unknown location"} on kekerainc.com`;
    const text =
      `Someone outside PA/NJ just visited the Kekera site.\n\n` +
      `When: ${when}\n` +
      `Page: ${url.pathname}\n` +
      `Location: ${where || "unknown"}\n` +
      `IP: ${clientIp || "unknown"}\n` +
      `Browser: ${ua.slice(0, 160)}\n`;

    const apiKey = process.env["RESEND_API_KEY"];
    if (!apiKey) {
      console.warn("[tripwire] no RESEND_API_KEY — out-of-area visit not alerted:", where, url.pathname);
      return;
    }

    // Fire-and-forget: never slow down or break the page render.
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: ALERT_FROM, to: ALERT_TO, subject, text }),
    }).catch((e) => console.warn("[tripwire] alert send failed:", e));
  } catch (e) {
    console.warn("[tripwire] check failed:", e);
  }
}
