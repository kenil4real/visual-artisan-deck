/**
 * Kekera Growth Review — Divya's email sequence.
 * Templates render from audit variables; copy approved by Kenil.
 */

export interface ReviewVars {
  site: string;
  overall: string;
  strongest: string;
  weakest: string;
  win1: string;
  win1Why: string;
  weakCount: number;
}

export interface Email {
  subject: string;
  text: string;
  html: string;
}

const BOOK_CALL =
  "mailto:Divyaramani@kekerainc.com?subject=Growth%20call%20request";
const UNSUB =
  "Don't want these? Just reply “stop” and I'll close your file.";

function wrapHtml(body: string): string {
  const ps = body
    .split(/\n\n+/)
    .map((p) => `<p style="margin:0 0 14px 0;">${p.replace(/\n/g, "<br>")}</p>`)
    .join("");
  return `<!doctype html><html><body style="margin:0;padding:0;background:#F4EFE3;">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;font-family:Georgia,'Times New Roman',serif;color:#181410;font-size:16px;line-height:1.65;">
${ps}
<p style="margin:24px 0 0 0;">— Divya</p>
<p style="margin:4px 0 0 0;font-size:14px;color:#6B6257;">Divya Ramani<br>Kekera Inc.<br><a href="mailto:Divyaramani@kekerainc.com" style="color:#E8490F;">Divyaramani@kekerainc.com</a></p>
<hr style="border:0;border-top:1px solid #DCD2BE;margin:28px 0 12px 0;">
<p style="font-size:12px;color:#8A8172;">${UNSUB}</p>
</div></body></html>`;
}

function textFooter(body: string): string {
  return `${body}\n\n— Divya\n\nDivya Ramani\nKekera Inc.\nDivyaramani@kekerainc.com\n\n---\n${UNSUB}`;
}

export function confirmationEmail(v: ReviewVars): Email {
  const subject = "Your Growth Review is on its way";
  const text = textFooter(
    `Hi there,\n\nGot it — ${v.site} is in the queue.\n\nI'm scoring it now across SEO, your Google Business Profile, paid ads, website, and social, each 1 to 10. Your PDF lands within the hour.\n\nTalk soon,`
  );
  return { subject, text, html: wrapHtml(`Hi there,\n\nGot it — ${v.site} is in the queue.\n\nI'm scoring it now across SEO, your Google Business Profile, paid ads, website, and social, each 1 to 10. Your PDF lands within the hour.\n\nTalk soon,`) };
}

export function deliveryEmail(v: ReviewVars): Email {
  const subject = `Your Growth Review: ${v.site} scored ${v.overall}/10`;
  const body = `Hi there,\n\nYour Growth Review is ready — the PDF is attached.\n\n${v.site} scored ${v.overall} out of 10 overall. The short version:\n\n- Strongest area: ${v.strongest}\n- Needs the most work: ${v.weakest}\n\nPage 5 has the three fixes I'd do first. Most of them cost nothing but an afternoon.\n\nAnd if you'd like, book a Growth Call and I'll record a 3-minute video walkthrough just for you — your numbers, my screen, plain English. No pitch, I promise.\n\nBook a Growth Call: ${BOOK_CALL}\n\nP.S. Every number in the PDF comes from an automated scan of your site's public signals. The judgment calls are mine.`;
  return { subject, text: textFooter(body), html: wrapHtml(body) };
}

export function followup1(v: ReviewVars): Email {
  const subject = `The one fix I'd do this week on ${v.site}`;
  const body = `Hi there,\n\nIf you only do one thing from your review, make it this one: ${v.win1}.\n\n${v.win1Why}\n\nThe other two are on page 5 of your PDF whenever you're ready.`;
  return { subject, text: textFooter(body), html: wrapHtml(body) };
}

export function followup2(v: ReviewVars): Email {
  const subject = "What I keep seeing";
  const body = `Hi there,\n\nI look at a lot of local business sites in a week, and the same three gaps come up again and again:\n\n1. No call tracking, so nobody knows which ads make the phone ring.\n2. A Google Business Profile with five photos from 2019.\n3. A website that loads fine on a laptop and falls apart on a phone.\n\n${v.site} had ${v.weakCount} of these in your review. They're all fixable, and none of them need a new website.\n\nIf you want a second pair of eyes, book a Growth Call — I'll walk through your numbers on video myself.\n\nBook a Growth Call: ${BOOK_CALL}`;
  return { subject, text: textFooter(body), html: wrapHtml(body) };
}

export function followup3(v: ReviewVars): Email {
  const subject = "What changed for a shop like yours";
  const body = `Hi there,\n\nQuick story. A home-services business came to us scoring a 4 overall — same neighborhood as your weakest area, ${v.weakest}. We fixed the review flow and the call tracking first, then moved budget to the one campaign that was actually booking jobs.\n\nNinety days later: cost per lead down by a third, and the owner could finally say which dollar did what.\n\nYour starting point is in the PDF I sent. The next step is a conversation, whenever you want it.\n\nBook a Growth Call: ${BOOK_CALL}`;
  return { subject, text: textFooter(body), html: wrapHtml(body) };
}

export function followup4(v: ReviewVars): Email {
  const subject = "Still want the video walkthrough?";
  const body = `Hi there,\n\nJust checking — the offer stands. Book a Growth Call and I'll record that 3-minute video walkthrough for ${v.site} personally: your scores, your site, what I'd fix first.\n\nNo forms beyond the booking, no pitch at the end. If we're not the right fit I'll tell you that too.\n\nBook a Growth Call: ${BOOK_CALL}`;
  return { subject, text: textFooter(body), html: wrapHtml(body) };
}

export function followup5(v: ReviewVars): Email {
  const subject = "Closing your file";
  const body = `Hi there,\n\nThis is the last note I'll send — I don't want to be the agency that keeps writing.\n\nYour PDF is yours to keep, and the scores won't go stale for a while. If you ever want that video walkthrough or a second look down the road, just reply to any of my emails. I read everything myself.\n\nGood luck with ${v.site} —`;
  return { subject, text: textFooter(body), html: wrapHtml(body) };
}

export function buildVars(audit: {
  host: string;
  overall: number;
  dimensions: Array<{ key: string; name: string; score: number }>;
  quickWins: Array<{ title: string; why: string }>;
}): ReviewVars {
  const sorted = [...audit.dimensions].sort((a, b) => a.score - b.score);
  const weakest = sorted[0];
  const strongest = sorted[sorted.length - 1];
  const weakCount = audit.dimensions.filter((d) => d.score < 6).length;
  const w1 = audit.quickWins[0];
  return {
    site: audit.host,
    overall: audit.overall.toFixed(1),
    strongest: `${strongest.name} (${strongest.score.toFixed(1)}/10)`,
    weakest: `${weakest.name} (${weakest.score.toFixed(1)}/10)`,
    win1: w1 ? w1.title : "your top priority fix",
    win1Why: w1 ? w1.why : "It's on page 5 of your PDF.",
    weakCount,
  };
}
