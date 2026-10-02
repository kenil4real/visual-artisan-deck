import { createFileRoute } from "@tanstack/react-router";
import { Resend } from "resend";
import { runAudit, isValidHost } from "../../lib/growth-audit";
import { buildReviewPdf } from "../../lib/review-pdf";
import {
  buildVars,
  confirmationEmail,
  deliveryEmail,
  followup1,
  followup2,
  followup3,
  followup4,
  followup5,
  type ReviewVars,
} from "../../lib/review-emails";

const FROM = "Divya Ramani <Divyaramani@kekerainc.com>";
const NOTIFY = "Divyaramani@kekerainc.com";
const DAY = 86_400_000;

// --- tiny in-memory rate limit: 5 submissions / IP / hour ---
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 3_600_000);
  if (arr.length >= 5) return false;
  arr.push(now);
  hits.set(ip, arr);
  return true;
}

function cleanHost(raw: string): string {
  let s = (raw || "").trim().toLowerCase();
  s = s.replace(/^https?:\/\//, "").replace(/^www\./, "");
  s = s.split("/")[0].split("?")[0].split("#")[0];
  s = s.replace(/:\d+$/, "").replace(/\.+$/, "");
  return s;
}

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((s || "").trim());
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });

export const Route = createFileRoute("/api/growth-review")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip =
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          "unknown";
        if (!rateLimited(ip)) {
          return json({ ok: false, error: "Too many requests. Try again in an hour." }, 429);
        }

        let body: { website?: string; email?: string };
        try {
          body = await request.json();
        } catch {
          return json({ ok: false, error: "Bad request." }, 400);
        }

        const host = cleanHost(body.website || "");
        const email = (body.email || "").trim().toLowerCase();
        if (!isValidHost(host)) {
          return json({ ok: false, error: "That doesn't look like a website address." }, 400);
        }
        if (!isEmail(email)) {
          return json({ ok: false, error: "That doesn't look like an email address." }, 400);
        }

        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
          return json({ ok: false, error: "Email is not configured yet. Please try again soon." }, 503);
        }
        const resend = new Resend(apiKey);
        const unsub = { "List-Unsubscribe": `<mailto:${NOTIFY}?subject=unsubscribe>` };

        // --- run the audit ---
        let audit;
        try {
          audit = await runAudit(host);
        } catch {
          // Site unreachable: be honest, tell them, and loop Divya in.
          const msg = {
            subject: `We couldn't scan ${host} — let's do it by hand`,
            text: `Hi there,\n\nI tried to run your Growth Review on ${host} but couldn't reach the site (it may block automated visits, or be temporarily down).\n\nReply to this email and I'll run the review by hand — same 5-page PDF, same 1–10 scores.\n\n— Divya\n\nDivya Ramani\nKekera Inc.\nDivyaramani@kekerainc.com`,
          };
          await resend.emails.send({ from: FROM, to: email, subject: msg.subject, text: msg.text, headers: unsub });
          await resend.emails.send({
            from: FROM,
            to: NOTIFY,
            subject: `Growth Review: scan failed for ${host} (${email})`,
            text: `The automated scan couldn't reach ${host}.\nVisitor email: ${email}\n\nA "we'll do it by hand" email went out. Follow up manually if you want.`,
          });
          return json({ ok: true });
        }

        const vars: ReviewVars = buildVars(audit);
        let pdf: Buffer;
        try {
          pdf = await buildReviewPdf(audit);
        } catch {
          return json({ ok: false, error: "Couldn't build your PDF. Please try again." }, 500);
        }

        const confirmation = confirmationEmail(vars);
        const delivery = deliveryEmail(vars);
        const followups = [followup1, followup2, followup3, followup4, followup5].map(
          (fn, i) => ({ email: fn(vars), days: [2, 5, 9, 14, 21][i] })
        );

        try {
          // 1. confirmation — now
          await resend.emails.send({
            from: FROM, to: email,
            subject: confirmation.subject, text: confirmation.text, html: confirmation.html,
            headers: unsub,
          });
          // 2. delivery with PDF — now
          await resend.emails.send({
            from: FROM, to: email,
            subject: delivery.subject, text: delivery.text, html: delivery.html,
            headers: unsub,
            attachments: [{ filename: `Kekera-Growth-Review-${host}.pdf`, content: pdf }],
          });
          // 3. follow-ups — scheduled
          for (const f of followups) {
            await resend.emails.send({
              from: FROM, to: email,
              subject: f.email.subject, text: f.email.text, html: f.email.html,
              headers: unsub,
              scheduledAt: new Date(Date.now() + f.days * DAY).toISOString(),
            });
          }
          // 4. notify Kenil/Divya with the lead + scores
          const dimLines = audit.dimensions
            .map((d) => `- ${d.name}: ${d.score.toFixed(1)}/10`)
            .join("\n");
          const winLines = audit.quickWins
            .map((w, i) => `${i + 1}. ${w.title} — ${w.why}`)
            .join("\n");
          await resend.emails.send({
            from: FROM, to: NOTIFY,
            subject: `New Growth Review: ${host} scored ${audit.overall.toFixed(1)}/10`,
            text:
              `New Growth Review request.\n\nWebsite: ${host}\nBusiness: ${audit.businessName}\nEmail: ${email}\nOverall: ${audit.overall.toFixed(1)}/10\n\n${dimLines}\n\nQuick wins:\n${winLines}\n\nConfirmation + PDF delivered. 5 follow-ups scheduled (days 2/5/9/14/21).\nIf they book a call, record and send the 3-minute video yourself.`,
          });
        } catch (e) {
          console.error("growth-review send failed", e);
          return json({ ok: false, error: "Couldn't send your review. Please try again." }, 500);
        }

        return json({ ok: true });
      },
    },
  },
});
