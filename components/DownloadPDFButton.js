"use client";

import { useState } from "react";

/* ── colour helpers ── */
const scoreClr  = (v) => v >= 80 ? [34,197,94]  : v >= 50 ? [245,158,11] : [239,68,68];
const scoreLabel= (v) => v >= 80 ? "Excellent"   : v >= 50 ? "Good"       : "Needs Work";
const matchClr  = (v) => v > 70  ? [34,197,94]  : v >= 50 ? [245,158,11] : [239,68,68];
const matchLabel= (v) => v > 70  ? "Strong Match": v >= 50 ? "Partial Match" : "Low Match";

export function DownloadPDFButton({ results, jobRole }) {
  const [downloading, setDownloading] = useState(false);
  const [pdfError, setPdfError]       = useState("");

  async function handleDownload() {
    setDownloading(true);
    setPdfError("");
    try {
      const { default: jsPDF } = await import("jspdf");

      /* ── constants ── */
      const PAGE_W   = 210;
      const PAGE_H   = 297;
      const MARGIN   = 16;
      const COL_W    = PAGE_W - MARGIN * 2;
      const SAFE_BOT = 274;           // don't render below this y
      const BG       = [13, 13, 18]; // dark page bg

      const doc = new jsPDF({ unit: "mm", format: "a4" });
      let y = 0;

      /* ── helpers ── */

      /** Paint the dark background for the current page */
      function paintBg() {
        doc.setFillColor(...BG);
        doc.rect(0, 0, PAGE_W, PAGE_H, "F");
      }

      /** Draw a hairline separator and advance y */
      function rule(gap = 5) {
        doc.setDrawColor(255, 255, 255);
        doc.setGState(doc.GState({ opacity: 0.07 }));
        doc.setLineWidth(0.25);
        doc.line(MARGIN, y, PAGE_W - MARGIN, y);
        doc.setGState(doc.GState({ opacity: 1 }));
        y += gap;
      }

      /**
       * Ensure there is `needed` mm of space left on the page.
       * If not, add a new page, paint it, and reset y.
       */
      function ensureSpace(needed) {
        if (y + needed > SAFE_BOT) {
          doc.addPage();
          paintBg();
          // Re-draw footer zone placeholder
          y = 20;
        }
      }

      /**
       * Draw a section heading with a left accent bar.
       * Returns after advancing y.
       */
      function sectionHeading(text, rgb) {
        ensureSpace(14);
        doc.setFillColor(...rgb);
        doc.rect(MARGIN, y - 3, 3, 8, "F");
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...rgb);
        doc.text(text, MARGIN + 6, y + 3);
        y += 10;
      }

      /**
       * Draw a text item inside a colour-tinted box.
       * The box height is computed from the wrapped line count.
       */
      function listItem(text, bgRgb, textRgb, maxW = COL_W - 10) {
        const lines = doc.splitTextToSize(text, maxW);
        const LINE_H = 4.2;
        const PAD    = 3.5;
        const boxH   = lines.length * LINE_H + PAD * 2;
        ensureSpace(boxH + 3);
        doc.setFillColor(...bgRgb);
        doc.roundedRect(MARGIN, y, COL_W, boxH, 2, 2, "F");
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...textRgb);
        doc.text(lines, MARGIN + 5, y + PAD + LINE_H * 0.7);
        y += boxH + 3;
      }

      /* ================================================================
         PAGE 1  —  header + score overview
      ================================================================ */
      paintBg();

      /* rose gold header band */
      doc.setFillColor(180, 20, 90);
      doc.rect(0, 0, PAGE_W, 34, "F");

      /* logo */
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("Resume", MARGIN, 15);
      doc.setTextColor(255, 180, 200);
      doc.text("AI", MARGIN + 32, 15);

      /* subtitle */
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(255, 220, 230);
      doc.text("AI-Powered Resume Analysis Report", MARGIN, 23);

      /* date top-right */
      const dateStr = new Date().toLocaleDateString("en-IN", {
        day: "2-digit", month: "long", year: "numeric",
      });
      doc.text(dateStr, PAGE_W - MARGIN, 23, { align: "right" });

      y = 42;

      /* ── Target Role ── */
      if (jobRole?.trim()) {
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(180, 20, 90);
        doc.text("TARGET ROLE", MARGIN, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(220, 220, 230);
        doc.text(jobRole.trim(), MARGIN + 28, y);
        y += 9;
      }

      /* ── Score block ── */
      const sv   = results.score ?? 0;
      const sClr = scoreClr(sv);

      // big score number — width-safe offset
      doc.setFontSize(48);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...sClr);
      doc.text(`${sv}`, MARGIN, y + 10);

      const numW = doc.getTextWidth(`${sv}`);

      doc.setFontSize(13);
      doc.setTextColor(120, 120, 130);
      doc.text("/ 100", MARGIN + numW + 2, y + 10);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...sClr);
      // score label pill
      const slabel = scoreLabel(sv);
      const slW    = doc.getTextWidth(slabel) + 6;
      doc.setFillColor(...sClr.map(c => Math.round(c * 0.2)));
      doc.roundedRect(MARGIN, y + 12, slW, 5.5, 1.5, 1.5, "F");
      doc.setTextColor(...sClr);
      doc.text(slabel, MARGIN + 3, y + 16);
      y += 24;

      rule(6);

      /* ── ATS · Keywords · Formatting badges ── */
      const badges = [
        { label: "ATS Ready",  value: results.atsReady ? "✓ Pass" : "✗ Fail",
          clr: results.atsReady ? [34,197,94] : [239,68,68] },
        { label: "Keywords",   value: results.keywords ?? "—",
          clr: results.keywords === "Strong" ? [147,51,234] : results.keywords === "Weak" ? [239,68,68] : [59,130,246] },
        { label: "Formatting", value: results.formatting ?? "—",
          clr: results.formatting === "Clean" ? [59,130,246] : results.formatting === "Messy" ? [239,68,68] : [147,51,234] },
      ];

      const bW = (COL_W - 6) / 3;
      badges.forEach((b, i) => {
        const bx = MARGIN + i * (bW + 3);
        const [br,bg,bb] = b.clr;
        doc.setFillColor(Math.round(br*0.15+13), Math.round(bg*0.15+13), Math.round(bb*0.15+18));
        doc.roundedRect(bx, y, bW, 16, 2.5, 2.5, "F");
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...b.clr);
        doc.text(b.value, bx + bW / 2, y + 7, { align: "center" });
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(120, 120, 135);
        doc.text(b.label, bx + bW / 2, y + 13, { align: "center" });
      });
      y += 22;

      rule(6);

      /* ── Job Match band (only if JD provided) ── */
      if (results.matchPercentage != null && results.matchPercentage > 0) {
        ensureSpace(28);
        const mp   = results.matchPercentage;
        const mClr = matchClr(mp);
        const mLbl = matchLabel(mp);

        // tinted background row
        doc.setFillColor(...mClr.map(c => Math.round(c * 0.1 + 5)));
        doc.roundedRect(MARGIN, y, COL_W, 20, 3, 3, "F");

        // left: percentage
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...mClr);
        doc.text(`${mp}%`, MARGIN + 5, y + 13);

        const pctW = doc.getTextWidth(`${mp}%`);

        // label pill
        doc.setFontSize(7);
        doc.setTextColor(...mClr);
        doc.text(mLbl, MARGIN + 6 + pctW, y + 8);

        // analysis text
        if (results.matchAnalysis) {
          doc.setFontSize(7.5);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(190, 190, 200);
          const aLines = doc.splitTextToSize(results.matchAnalysis, COL_W - 50);
          doc.text(aLines, MARGIN + 6 + pctW, y + 14);
        }

        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(120,120,135);
        doc.text("JD MATCH", PAGE_W - MARGIN - 2, y + 5, { align: "right" });

        y += 25;
        rule(6);
      }

      /* ── Section Scores ── */
      if (results.sectionScores) {
        sectionHeading("Section Breakdown", [180, 140, 255]);
        const secs = [
          ["experience","Experience"],
          ["skills","Skills"],
          ["education","Education"],
          ["formatting","Formatting"],
          ["impact","Impact"],
        ];
        secs.forEach(([key, label]) => {
          const val = results.sectionScores[key] ?? 0;
          const clr = scoreClr(val);
          ensureSpace(10);

          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(155, 155, 170);
          doc.text(label, MARGIN, y + 3);

          // value
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...clr);
          doc.text(`${val}`, PAGE_W - MARGIN, y + 3, { align: "right" });

          // track
          doc.setFillColor(35, 35, 45);
          doc.roundedRect(MARGIN + 28, y + 0.5, COL_W - 35, 3.5, 1, 1, "F");
          // fill
          const fillW = Math.max(3, (COL_W - 35) * (val / 100));
          doc.setFillColor(...clr);
          doc.roundedRect(MARGIN + 28, y + 0.5, fillW, 3.5, 1, 1, "F");

          y += 9;
        });
        y += 2;
        rule(6);
      }

      /* ── Resume Checklist ── */
      if (results.checklist) {
        sectionHeading("Resume Fundamentals Checklist", [200, 200, 215]);
        const items = [
          ["hasContactInfo","Contact Info"],
          ["hasLinkedIn","LinkedIn / Portfolio"],
          ["hasMetrics","Quantified Metrics"],
          ["hasActionVerbs","Action Verbs"],
          ["hasSummary","Professional Summary"],
          ["hasCertifications","Certifications"],
        ];
        const itemW = COL_W / 2 - 3;
        items.forEach(([key, label], idx) => {
          if (idx % 2 === 0) ensureSpace(8);
          const pass = results.checklist[key];
          const clr  = pass ? [34,197,94] : [239,68,68];
          const bx   = MARGIN + (idx % 2) * (itemW + 6);
          const by   = y;
          doc.setFillColor(...clr.map(c => Math.round(c * 0.12 + 10)));
          doc.roundedRect(bx, by, itemW, 6.5, 1.5, 1.5, "F");
          doc.setFontSize(7.5);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...clr);
          doc.text(pass ? "✓" : "✗", bx + 3.5, by + 4.5);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(190, 190, 205);
          doc.text(label, bx + 9, by + 4.5);
          if (idx % 2 === 1) y += 9;
        });
        if (items.length % 2 !== 0) y += 9;
        y += 2;
        rule(6);
      }

      /* ── Strengths ── */
      if (results.strengths?.length) {
        sectionHeading("Strengths", [34,197,94]);
        results.strengths.forEach(s => {
          listItem(`• ${s}`, [15,45,25], [150,230,170]);
        });
        y += 2;
        rule(6);
      }

      /* ── Weaknesses / Improvements ── */
      if (results.weaknesses?.length) {
        sectionHeading("Areas for Improvement", [239,68,68]);
        results.weaknesses.forEach(w => {
          listItem(`• ${w}`, [45,15,15], [240,145,145]);
        });
        y += 2;
        rule(6);
      }

      /* ── Strategy Suggestions ── */
      if (results.suggestions?.length) {
        sectionHeading("Smart Strategy Advice", [168,120,255]);
        results.suggestions.forEach(s => {
          listItem(`• ${s}`, [35,18,70], [200,165,255]);
        });
        y += 2;
        rule(6);
      }

      /* ── Detected Skills ── */
      if (results.skillTags?.length) {
        sectionHeading("Detected Skills & Themes", [200,200,215]);
        ensureSpace(14);
        let tx = MARGIN;
        results.skillTags.forEach(skill => {
          doc.setFontSize(7.5);
          doc.setFont("helvetica", "bold");
          const tw = doc.getTextWidth(skill) + 8;
          if (tx + tw > PAGE_W - MARGIN) {
            tx = MARGIN;
            y += 8;
          }
          ensureSpace(9);
          doc.setFillColor(55, 28, 90);
          doc.roundedRect(tx, y, tw, 6, 1.5, 1.5, "F");
          doc.setTextColor(175, 135, 255);
          doc.text(skill, tx + 4, y + 4.3);
          tx += tw + 3;
        });
        y += 10;
        rule(6);
      }

      /* ── Missing Keywords ── */
      if (results.missingKeywords?.length) {
        sectionHeading("Missing Keywords for Role", [239,68,68]);
        ensureSpace(10);
        let kx = MARGIN;
        results.missingKeywords.forEach(kw => {
          doc.setFontSize(7.5);
          doc.setFont("helvetica", "bold");
          const kw_w = doc.getTextWidth(kw) + 8;
          if (kx + kw_w > PAGE_W - MARGIN) {
            kx = MARGIN;
            y += 8;
          }
          ensureSpace(9);
          doc.setFillColor(55, 15, 15);
          doc.roundedRect(kx, y, kw_w, 6, 1.5, 1.5, "F");
          doc.setTextColor(240, 130, 130);
          doc.text(kw, kx + 4, y + 4.3);
          kx += kw_w + 3;
        });
        y += 10;
        rule(6);
      }

      /* ── Project Suggestions ── */
      if (results.projectSuggestions?.length) {
        sectionHeading("Career Boost Projects", [245,158,11]);
        results.projectSuggestions.forEach((p, i) => {
          listItem(`${i + 1}.  ${p}`, [40,28,10], [248,210,130]);
        });
        y += 2;
        rule(6);
      }

      /* ── Rewritten Bullets ── */
      if (results.rewrittenBullets?.length) {
        sectionHeading("Tailored Bullet Rewrites", [34,197,94]);
        results.rewrittenBullets.forEach((b, i) => {
          // label row
          ensureSpace(6);
          doc.setFontSize(7);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(120,120,135);
          doc.text(`BULLET ${i + 1}`, MARGIN, y + 3);
          y += 6;

          // original
          const origLines = doc.splitTextToSize(`${b.original}`, COL_W - 10);
          const origH = origLines.length * 4.2 + 7;
          ensureSpace(origH + 2);
          doc.setFillColor(40,15,15);
          doc.roundedRect(MARGIN, y, COL_W, origH, 2, 2, "F");
          doc.setFontSize(7);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(220, 80, 80);
          doc.text("ORIGINAL", MARGIN + 4, y + 4);
          doc.setFont("helvetica", "italic");
          doc.setTextColor(200,120,120);
          doc.text(origLines, MARGIN + 4, y + 9);
          y += origH + 2;

          // improved
          const impLines = doc.splitTextToSize(`${b.improved}`, COL_W - 10);
          const impH  = impLines.length * 4.2 + 7;
          ensureSpace(impH + 4);
          doc.setFillColor(10,40,22);
          doc.roundedRect(MARGIN, y, COL_W, impH, 2, 2, "F");
          doc.setFontSize(7);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(60, 200, 100);
          doc.text("AI OPTIMIZED", MARGIN + 4, y + 4);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(140,225,160);
          doc.text(impLines, MARGIN + 4, y + 9);
          y += impH + 6;
        });
        rule(6);
      }

      /* ── Footer on every page ── */
      const totalPages = doc.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        // footer bar
        doc.setFillColor(22, 18, 35);
        doc.rect(0, PAGE_H - 12, PAGE_W, 12, "F");
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(90, 80, 110);
        doc.text(
          `ResumeAI  ·  AI-Powered Resume Review  ·  Page ${p} of ${totalPages}`,
          PAGE_W / 2,
          PAGE_H - 4.5,
          { align: "center" }
        );
      }

      /* ── Save ── */
      const safeName = jobRole
        ? jobRole.trim().replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "")
        : "General";
      doc.save(`ResumeAI_${safeName}_${Date.now()}.pdf`);

    } catch (e) {
      console.error("PDF generation error:", e);
      setPdfError("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <button
        onClick={handleDownload}
        disabled={downloading}
        className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
          downloading
            ? "bg-rose-500/20 border border-rose-500/40 text-rose-400 cursor-wait"
            : "bg-rose-600/20 border border-rose-500/30 dark:text-rose-300 text-rose-700 hover:bg-rose-600/30 hover:scale-105"
        }`}
      >
        {downloading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Generating…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3"/>
            </svg>
            Download PDF
          </>
        )}
      </button>
      {pdfError && (
        <p className="text-[11px] text-red-500 font-medium text-center">{pdfError}</p>
      )}
    </div>
  );
}
