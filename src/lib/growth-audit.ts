/**
 * Kekera Growth Review — automated technical audit.
 *
 * Fetches a business's homepage and scores it 1–10 across five dimensions
 * using only public, detectable signals. Every check is binary and honest:
 * the PDF labels the methodology as an automated scan of public signals.
 */

export interface CheckResult {
  label: string;
  pass: boolean;
  detail: string;
  fix: string;
  weight: number; // higher = more important quick win when failed
}

export interface Dimension {
  key: string;
  name: string;
  blurb: string;
  score: number; // 1–10, one decimal
  checks: CheckResult[];
}

export interface QuickWin {
  title: string;
  why: string;
}

export interface AuditResult {
  host: string;
  businessName: string;
  fetchedAt: string; // ISO
  overall: number;
  dimensions: Dimension[];
  quickWins: QuickWin[];
}

const FETCH_TIMEOUT_MS = 12000;
const MAX_BYTES = 2_000_000;

function cleanHost(raw: string): string {
  let s = (raw || "").trim().toLowerCase();
  s = s.replace(/^https?:\/\//, "").replace(/^www\./, "");
  s = s.split("/")[0].split("?")[0].split("#")[0];
  s = s.replace(/:\d+$/, "").replace(/\.+$/, "");
  return s;
}

export function isValidHost(s: string): boolean {
  if (!s || /\s/.test(s)) return false;
  // block IPs and localhost-ish hosts (SSRF guard)
  if (/^\d+\.\d+\.\d+\.\d+$/.test(s)) return false;
  if (s === "localhost" || s.endsWith(".local") || s.endsWith(".internal")) return false;
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(s)) return false;
  const tld = s.slice(s.lastIndexOf(".") + 1);
  return /^[a-z]{2,}$/.test(tld);
}

async function fetchText(url: string): Promise<{ ok: boolean; text: string; finalUrl: string }> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; KekeraGrowthReview/1.0; +https://www.kekerainc.com/)",
        accept: "text/html,application/xhtml+xml",
      },
    });
    const buf = await res.arrayBuffer();
    const text = new TextDecoder().decode(buf.slice(0, MAX_BYTES));
    return { ok: res.ok, text, finalUrl: res.url };
  } catch {
    return { ok: false, text: "", finalUrl: url };
  } finally {
    clearTimeout(t);
  }
}

function metaContent(html: string, name: string): string | null {
  const re = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name}["'][^>]*>`,
    "i"
  );
  const tag = html.match(re);
  if (!tag) return null;
  const c = tag[0].match(/content=["']([^"']*)["']/i);
  return c ? c[1] : null;
}

function countRe(html: string, re: RegExp): number {
  const m = html.match(new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g"));
  return m ? m.length : 0;
}

function scoreFrom(passes: number, total: number): number {
  const s = Math.round((passes / total) * 100) / 10;
  return Math.max(1, Math.min(10, s));
}

export async function runAudit(rawHost: string): Promise<AuditResult> {
  const host = cleanHost(rawHost);
  if (!isValidHost(host)) throw new Error("invalid host");

  let page = await fetchText(`https://${host}/`);
  if (!page.ok || !page.text) page = await fetchText(`http://${host}/`);
  const html = page.text;
  const httpsOk = page.finalUrl.startsWith("https://");

  const robots = await fetchText(`https://${host}/robots.txt`);
  const sitemap = await fetchText(`https://${host}/sitemap.xml`);

  const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || "").trim();
  const desc = metaContent(html, "description") || "";
  const businessName =
    metaContent(html, "og:site_name") ||
    title.split(/[-|–—]/)[0].trim() ||
    host.replace(/^www\./, "");

  // ---------- SEO ----------
  const h1Count = countRe(html, /<h1[\s>]/i);
  const seoChecks: CheckResult[] = [
    {
      label: "Page title",
      pass: title.length >= 30 && title.length <= 60,
      detail: title ? `“${title.slice(0, 70)}” (${title.length} characters)` : "No title tag found",
      fix: "Write a title under 60 characters that names what you do and where: “Emergency Plumber — Reading, PA | Smith & Sons”.",
      weight: 10,
    },
    {
      label: "Meta description",
      pass: desc.length >= 50 && desc.length <= 160,
      detail: desc ? `${desc.length} characters` : "No meta description found",
      fix: "Add a meta description under 160 characters that reads like an ad: what you do, where, and why to call.",
      weight: 9,
    },
    {
      label: "One clear H1",
      pass: h1Count === 1,
      detail: h1Count === 0 ? "No H1 found" : h1Count === 1 ? "Exactly one H1" : `${h1Count} H1 tags found`,
      fix: "Use exactly one H1 per page — the plain-English headline a customer would search for.",
      weight: 7,
    },
    {
      label: "Canonical URL",
      pass: /<link[^>]+rel=["']canonical["']/i.test(html),
      detail: /<link[^>]+rel=["']canonical["']/i.test(html) ? "Canonical tag present" : "No canonical tag",
      fix: "Add a canonical link tag so Google never splits your ranking between www and non-www versions.",
      weight: 5,
    },
    {
      label: "robots.txt",
      pass: robots.ok && /user-agent/i.test(robots.text),
      detail: robots.ok ? "robots.txt reachable" : "robots.txt not reachable",
      fix: "Publish a robots.txt that lets search engines in and points at your sitemap.",
      weight: 4,
    },
    {
      label: "XML sitemap",
      pass: sitemap.ok && /<url/i.test(sitemap.text),
      detail: sitemap.ok && /<url/i.test(sitemap.text) ? "Sitemap found" : "No sitemap found",
      fix: "Publish an XML sitemap and submit it in Google Search Console so new pages get found fast.",
      weight: 6,
    },
    {
      label: "Schema markup",
      pass: /application\/ld\+json/i.test(html),
      detail: /application\/ld\+json/i.test(html) ? "Structured data present" : "No structured data found",
      fix: "Add LocalBusiness schema (name, address, phone, hours) — it feeds the knowledge panel and map results.",
      weight: 8,
    },
  ];

  // ---------- Website ----------
  const imgCount = countRe(html, /<img[\s>]/i);
  const imgAlt = countRe(html, /<img[^>]+alt=["'][^"']+["']/i);
  const altRatio = imgCount === 0 ? 1 : imgAlt / imgCount;
  const kb = Math.round(new TextEncoder().encode(html).length / 1024);
  const webChecks: CheckResult[] = [
    {
      label: "Secure (HTTPS)",
      pass: httpsOk,
      detail: httpsOk ? "Site loads over HTTPS" : "Site does not redirect to HTTPS",
      fix: "Force HTTPS everywhere — browsers now warn visitors off non-secure pages.",
      weight: 10,
    },
    {
      label: "Mobile viewport",
      pass: /<meta[^>]+name=["']viewport["']/i.test(html),
      detail: /<meta[^>]+name=["']viewport["']/i.test(html) ? "Viewport tag present" : "No viewport tag",
      fix: "Add the viewport meta tag so the site scales to phones instead of rendering desktop-wide.",
      weight: 9,
    },
    {
      label: "Page weight",
      pass: kb < 1500,
      detail: `Homepage HTML is ~${kb.toLocaleString()} KB`,
      fix: "Trim the homepage under ~1.5 MB — compress images and drop scripts you don't use. Slow pages lose callers.",
      weight: 6,
    },
    {
      label: "Image alt text",
      pass: altRatio >= 0.7,
      detail: imgCount === 0 ? "No images found" : `${imgAlt}/${imgCount} images have alt text`,
      fix: "Give every meaningful image alt text describing it — it helps image search and accessibility.",
      weight: 4,
    },
    {
      label: "Language tag",
      pass: /<html[^>]+lang=/i.test(html),
      detail: /<html[^>]+lang=/i.test(html) ? "html lang set" : "No lang attribute",
      fix: "Set lang=\"en\" on the html tag — screen readers and translators depend on it.",
      weight: 2,
    },
    {
      label: "Favicon",
      pass: /rel=["'](shortcut )?icon["']/i.test(html),
      detail: /rel=["'](shortcut )?icon["']/i.test(html) ? "Favicon declared" : "No favicon found",
      fix: "Add a favicon — it's the tiny logo in the browser tab and in Google's mobile results.",
      weight: 3,
    },
  ];

  // ---------- Paid ads (tracking maturity — the honest, detectable proxy) ----------
  const hasGtag = /googletagmanager\.com|gtag\(/i.test(html);
  const hasMeta = /fbevents\.js|fbq\(/i.test(html);
  const hasAds = /googleadservices\.com|AW-\d{6,}/i.test(html);
  const hasOther = /tiktok|linkedin\.com\/insight|snap\./i.test(html);
  const paidChecks: CheckResult[] = [
    {
      label: "Google Analytics / Tag Manager",
      pass: hasGtag,
      detail: hasGtag ? "Google tag detected" : "No Google tag detected",
      fix: "Install Google Tag Manager with GA4 — without it, ad platforms optimize blind.",
      weight: 10,
    },
    {
      label: "Meta Pixel",
      pass: hasMeta,
      detail: hasMeta ? "Meta Pixel detected" : "No Meta Pixel detected",
      fix: "Install the Meta Pixel even if you don't run Meta ads yet — it starts building your retargeting audience now.",
      weight: 8,
    },
    {
      label: "Google Ads conversion tag",
      pass: hasAds,
      detail: hasAds ? "Google Ads tag detected" : "No Google Ads conversion tag detected",
      fix: "Add the Google Ads conversion tag on your thank-you / call actions so Smart Bidding learns what a lead looks like.",
      weight: 9,
    },
    {
      label: "Other ad pixels",
      pass: hasOther,
      detail: hasOther ? "Additional pixels detected" : "No TikTok/LinkedIn/Snap pixels",
      fix: "Only add more pixels when you run those channels — each one slows the page a little.",
      weight: 3,
    },
  ];

  // ---------- Social ----------
  const socials: Array<[string, RegExp, string]> = [
    ["Facebook", /facebook\.com\//i, "Link your Facebook page from the site footer so customers can follow and message you."],
    ["Instagram", /instagram\.com\//i, "Link your Instagram — for local businesses it's the portfolio customers check before calling."],
    ["LinkedIn", /linkedin\.com\/(company|in|school)/i, "Link your LinkedIn company page; it also strengthens branded search results."],
    ["YouTube", /youtube\.com\/|youtu\.be\//i, "Link your YouTube channel — video answers keep people on your site longer."],
    ["X / TikTok", /(twitter\.com|x\.com|tiktok\.com)\//i, "Link any other active profile so there's one official version of you everywhere."],
  ];
  const socialChecks: CheckResult[] = socials.map(([label, re, fix], i) => {
    const found = re.test(html);
    return {
      label: `${label} linked`,
      pass: found,
      detail: found ? `${label} profile linked` : `No ${label} link found`,
      fix,
      weight: 6 - i * 0.5,
    };
  });

  // ---------- Google Business Profile (on-site signals — labeled as such) ----------
  const hasMapEmbed = /google\.com\/maps\/embed/i.test(html);
  const hasGoogleLink = /business\.google\.com|g\.page|google\.com\/maps(?!\/embed)/i.test(html);
  const hasReviewAsk = /review us on google|leave (us )?a review|rate us on google/i.test(html);
  const gbpChecks: CheckResult[] = [
    {
      label: "Map embed on site",
      pass: hasMapEmbed,
      detail: hasMapEmbed ? "Google Map embedded" : "No Google Map embed found",
      fix: "Embed your Google Map on the contact page — it reinforces the location signal Google uses for the map pack.",
      weight: 7,
    },
    {
      label: "Links to Google listing",
      pass: hasGoogleLink,
      detail: hasGoogleLink ? "Links to the Google listing found" : "No links to the Google listing",
      fix: "Link your Google Business Profile from the footer — it ties your site to the entity Google ranks.",
      weight: 8,
    },
    {
      label: "Review prompts",
      pass: hasReviewAsk,
      detail: hasReviewAsk ? "Review prompts found on site" : "No review prompts found",
      fix: "Ask for Google reviews on the site and after every job — review count and velocity move the map pack.",
      weight: 10,
    },
  ];

  const dimensions: Dimension[] = [
    {
      key: "seo",
      name: "SEO",
      blurb: "Can Google find, read, and rank your pages?",
      score: scoreFrom(seoChecks.filter((c) => c.pass).length, seoChecks.length),
      checks: seoChecks,
    },
    {
      key: "website",
      name: "Website",
      blurb: "Does the site load fast, look right on phones, and invite the call?",
      score: scoreFrom(webChecks.filter((c) => c.pass).length, webChecks.length),
      checks: webChecks,
    },
    {
      key: "paid",
      name: "Paid Ads",
      blurb: "Is your tracking in place so ad spend can learn and be measured?",
      score: scoreFrom(paidChecks.filter((c) => c.pass).length, paidChecks.length),
      checks: paidChecks,
    },
    {
      key: "social",
      name: "Social",
      blurb: "Can customers find and follow the real you on social?",
      score: scoreFrom(socialChecks.filter((c) => c.pass).length, socialChecks.length),
      checks: socialChecks,
    },
    {
      key: "gbp",
      name: "Google Business Profile",
      blurb: "On-site signals of a healthy Google presence (map, listing links, review prompts).",
      score: scoreFrom(gbpChecks.filter((c) => c.pass).length, gbpChecks.length),
      checks: gbpChecks,
    },
  ];

  const overall = Math.round((dimensions.reduce((a, d) => a + d.score, 0) / dimensions.length) * 10) / 10;

  const failed = dimensions.flatMap((d) => d.checks.filter((c) => !c.pass));
  failed.sort((a, b) => b.weight - a.weight);
  const quickWins: QuickWin[] = failed.slice(0, 3).map((c) => ({ title: c.label, why: c.fix }));

  return {
    host,
    businessName,
    fetchedAt: new Date().toISOString(),
    overall,
    dimensions,
    quickWins,
  };
}
