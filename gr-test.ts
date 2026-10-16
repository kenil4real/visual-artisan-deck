// End-to-end Growth Review test (no sending): audit + PDF + email renders.
import { runAudit } from "./src/lib/growth-audit";
import { buildReviewPdf } from "./src/lib/review-pdf";
import { buildVars, confirmationEmail, deliveryEmail } from "./src/lib/review-emails";
import { writeFileSync, mkdirSync } from "fs";

const host = process.argv[2] || "kekerainc.com";

console.log("Auditing", host, "...");
const audit = await runAudit(host);
console.log("Overall:", audit.overall.toFixed(1), "| Business:", audit.businessName);
for (const d of audit.dimensions) console.log(" -", d.name + ":", d.score.toFixed(1));

const vars = buildVars(audit);
console.log("\nVars:", JSON.stringify(vars, null, 1).slice(0, 400));

console.log("\nBuilding PDF...");
const pdf: Buffer = await buildReviewPdf(audit);
mkdirSync("/tmp/gr-test", { recursive: true });
writeFileSync("/tmp/gr-test/review.pdf", pdf);
console.log("PDF bytes:", pdf.length);

const c1 = confirmationEmail(vars);
const c2 = deliveryEmail(vars);
writeFileSync("/tmp/gr-test/email1-confirmation.txt",
  `SUBJECT: ${c1.subject}\n\n${c1.text}`);
writeFileSync("/tmp/gr-test/email2-delivery.txt",
  `SUBJECT: ${c2.subject}\n\n${c2.text}`);
writeFileSync("/tmp/gr-test/email2-delivery.html", c2.html);
console.log("Wrote /tmp/gr-test/{review.pdf,email1-confirmation.txt,email2-delivery.txt,email2-delivery.html}");
