/**
 * Kekera Growth Review — 5-page PDF generator (pdfkit).
 * Brand: cream paper, ink text, orange accent.
 */
import PDFDocument from "pdfkit";
import type { AuditResult } from "./growth-audit";

const PAPER = "#F4EFE3";
const INK = "#181410";
const ACCENT = "#E8490F";
const MUTED = "#6B6257";
const LINE = "#DCD2BE";
const GOOD = "#2E7D4F";
const BAD = "#B23A1D";

const BOOK_CALL_URL =
  "mailto:Divyaramani@kekerainc.com?subject=Growth%20call%20request";

function paintPaper(doc: PDFKit.PDFDocument) {
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(PAPER);
}

function footer(doc: PDFKit.PDFDocument, n: number) {
  const y = doc.page.height - 44;
  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(MUTED)
    .text("Prepared by Kekera Inc.  ·  Divyaramani@kekerainc.com", 60, y, {
      width: doc.page.width - 120,
      align: "center",
    })
    .text(`Page ${n} of 5`, 60, y + 12, {
      width: doc.page.width - 120,
      align: "center",
    });
}

function kick(doc: PDFKit.PDFDocument, y: number, text: string) {
  doc.font("Helvetica-Bold").fontSize(10).fillColor(ACCENT);
  doc.text(text.toUpperCase(), 60, y, { characterSpacing: 2.5 });
  return y + 20;
}

function scoreBar(
  doc: PDFKit.PDFDocument,
  y: number,
  name: string,
  blurb: string,
  score: number
) {
  const x = 60;
  const w = doc.page.width - 120;
  doc.font("Helvetica-Bold").fontSize(13).fillColor(INK).text(name, x, y);
  doc.font("Helvetica").fontSize(9).fillColor(MUTED).text(blurb, x + 150, y + 2, { width: w - 200, align: "right" });
  const by = y + 22;
  const bw = w - 60;
  doc.rect(x, by, bw, 10).fill("#E9E0CC");
  const fill = Math.max(0.04, score / 10);
  doc.rect(x, by, bw * fill, 10).fill(score >= 7 ? GOOD : score >= 4 ? ACCENT : BAD);
  doc.font("Helvetica-Bold").fontSize(13).fillColor(INK).text(`${score.toFixed(1)}`, x + bw + 12, by - 3);
  return by + 30;
}

function checkRow(doc: PDFKit.PDFDocument, y: number, label: string, pass: boolean, detail: string) {
  const x = 60;
  const w = doc.page.width - 120;
  if (y > doc.page.height - 110) return -1;
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor(pass ? GOOD : BAD)
    .text(pass ? "✓" : "✕", x, y);
  doc.font("Helvetica-Bold").fontSize(11).fillColor(INK).text(label, x + 22, y);
  doc.font("Helvetica").fontSize(9.5).fillColor(MUTED).text(detail, x + 22, y + 15, { width: w - 22 });
  return y + 42;
}

export function buildReviewPdf(audit: AuditResult): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "LETTER", margin: 0 });
    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const date = new Date(audit.fetchedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const W = doc.page.width;

    // ---------- Page 1: cover ----------
    paintPaper(doc);
    let y = kick(doc, 70, "Kekera Inc.  ·  The Growth Review");
    doc.font("Helvetica-Bold").fontSize(34).fillColor(INK)
      .text(audit.businessName, 60, y, { width: W - 120 });
    y = doc.y + 6;
    doc.font("Helvetica").fontSize(12).fillColor(MUTED).text(audit.host, 60, y);
    y = doc.y + 4;
    doc.font("Helvetica").fontSize(12).fillColor(MUTED).text(`Scanned ${date}`, 60, y);

    // overall score
    y = doc.y + 36;
    doc.font("Helvetica-Bold").fontSize(96).fillColor(ACCENT)
      .text(audit.overall.toFixed(1), 60, y);
    doc.font("Helvetica").fontSize(16).fillColor(MUTED).text("/ 10 overall", 60, y + 100);
    y = doc.y + 30;
    const verdict =
      audit.overall >= 7 ? "A strong foundation — the wins now are in the details."
      : audit.overall >= 4 ? "Plenty of headroom — the quick wins on page 5 move this fast."
      : "A lot of untapped opportunity — good news: most fixes are cheap.";
    doc.font("Helvetica-Oblique").fontSize(12).fillColor(INK).text(verdict, 60, y, { width: W - 120 });

    y = doc.y + 30;
    doc.font("Helvetica-Bold").fontSize(13).fillColor(INK).text("How you scored", 60, y);
    y += 22;
    for (const d of audit.dimensions) {
      y = scoreBar(doc, y, d.name, d.blurb, d.score);
    }
    footer(doc, 1);

    // ---------- Pages 2–4: dimension detail ----------
    const dimPages: Array<[string, string[]]> = [
      ["What we checked", ["seo", "website"]],
      ["What we checked (continued)", ["paid", "social"]],
      ["Google Business Profile signals", ["gbp"]],
    ];
    let pageNo = 2;
    for (const [heading, keys] of dimPages) {
      doc.addPage();
      paintPaper(doc);
      y = kick(doc, 70, heading);
      for (const key of keys) {
        const d = audit.dimensions.find((x) => x.key === key)!;
        doc.font("Helvetica-Bold").fontSize(16).fillColor(INK).text(`${d.name} — ${d.score.toFixed(1)}/10`, 60, y);
        y = doc.y + 4;
        doc.font("Helvetica").fontSize(10).fillColor(MUTED).text(d.blurb, 60, y, { width: W - 120 });
        y = doc.y + 14;
        for (const c of d.checks) {
          const ny = checkRow(doc, y, c.label, c.pass, c.detail);
          if (ny === -1) break;
          y = ny;
        }
        y += 10;
        doc.strokeColor(LINE).lineWidth(1).moveTo(60, y).lineTo(W - 60, y).stroke();
        y += 16;
      }
      if (pageNo === 4) {
        doc.font("Helvetica-Bold").fontSize(11).fillColor(INK).text("How we scored this", 60, y);
        y = doc.y + 6;
        doc.font("Helvetica").fontSize(9.5).fillColor(MUTED).text(
          "Every score comes from an automated scan of your website's public signals — the code, tags, and links anyone can see. " +
          "It doesn't guess at your ad spend or read your Google Business Profile dashboard. " +
          "Treat it as the honest starting point; the judgment calls are ours, on your call.",
          60, y, { width: W - 120 }
        );
      }
      footer(doc, pageNo);
      pageNo++;
    }

    // ---------- Page 5: priority list + CTA ----------
    doc.addPage();
    paintPaper(doc);
    y = kick(doc, 70, "Your priority list");
    doc.font("Helvetica-Bold").fontSize(22).fillColor(INK)
      .text("Do these three first", 60, y, { width: W - 120 });
    y = doc.y + 18;
    audit.quickWins.forEach((w, i) => {
      doc.font("Helvetica-Bold").fontSize(40).fillColor(ACCENT).text(`${i + 1}`, 60, y);
      doc.font("Helvetica-Bold").fontSize(13).fillColor(INK).text(w.title, 110, y + 8, { width: W - 170 });
      doc.font("Helvetica").fontSize(10.5).fillColor(MUTED).text(w.why, 110, doc.y + 4, { width: W - 170 });
      y = doc.y + 26;
    });

    // CTA box
    y += 10;
    const boxY = y;
    doc.rect(60, boxY, W - 120, 150).fill(INK);
    doc.font("Helvetica-Bold").fontSize(15).fillColor(PAPER)
      .text("Want the 3-minute video walkthrough?", 84, boxY + 22, { width: W - 168 });
    doc.font("Helvetica").fontSize(10.5).fillColor("#C9BFA9")
      .text("Book a Growth Call and Divya records it just for you — your scores, your site, what she'd fix first. No pitch.", 84, boxY + 50, { width: W - 168 });
    doc.link(84, boxY + 96, 220, 36, BOOK_CALL_URL);
    doc.rect(84, boxY + 96, 220, 36).fill(ACCENT);
    doc.font("Helvetica-Bold").fontSize(12).fillColor("#FFFFFF")
      .text("Book a Growth Call  →", 84, boxY + 108, { width: 220, align: "center" });
    doc.font("Helvetica").fontSize(9).fillColor("#C9BFA9")
      .text("Divyaramani@kekerainc.com  ·  We reply within one business day.", 84, boxY + 140 - 12, { width: W - 168 });

    footer(doc, 5);
    doc.end();
  });
}
