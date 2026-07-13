"use client";

import { useState } from "react";

/* -- colour helpers -- */
const scoreClr  = (v) => v >= 80 ? [34,197,94]  : v >= 50 ? [245,158,11] : [239,68,68];
const scoreLabel= (v) => v >= 80 ? "Excellent"   : v >= 50 ? "Good"       : "Needs Work";
const matchClr  = (v) => v > 70  ? [34,197,94]  : v >= 50 ? [245,158,11] : [239,68,68];
const matchLabel= (v) => v > 70  ? "Strong Match": v >= 50 ? "Partial Match" : "Low Match";

const getAlertStyle = (v) => {
  if (v >= 80) return { text: [21,128,61], bg: [240,253,244], border: [187,247,208] };
  if (v >= 50) return { text: [180,83,9],  bg: [255,251,235], border: [254,243,199] };
  return          { text: [185,28,28],     bg: [254,242,242], border: [254,226,226] };
};

export function DownloadPDFButton({ results, jobRole }) {
  const [downloading, setDownloading] = useState(false);
  const [pdfError, setPdfError]       = useState("");

  async function handleDownload() {
    setDownloading(true);
    setPdfError("");
    try {
      const { default: jsPDF } = await import("jspdf");

      const PAGE_W   = 210;
      const PAGE_H   = 297;
      const MARGIN   = 16;
      const COL_W    = PAGE_W - MARGIN * 2;
      const SAFE_BOT = 274;
      const BG       = [255, 255, 255];

      const doc = new jsPDF({ unit: "mm", format: "a4" });
      let y = 0;

      function paintBg() {
        doc.setFillColor(...BG);
        doc.rect(0, 0, PAGE_W, PAGE_H, "F");
      }

      function rule(gap = 5) {
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.25);
        doc.line(MARGIN, y, PAGE_W - MARGIN, y);
        y += gap;
      }

      function ensureSpace(needed) {
        if (y + needed > SAFE_BOT) {
          doc.addPage();
          paintBg();
          drawSubsequentHeader();
          y = 22;
        }
      }

      function drawSubsequentHeader() {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(79, 70, 229);
        doc.text("ResumeAI", MARGIN, 11);
        const logoW = doc.getTextWidth("ResumeAI");
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text("  Audit Report", MARGIN + logoW, 11);
        const roleText = jobRole?.trim() ? `Target Role: ${jobRole.trim()}` : "General Resume Audit";
        doc.setFontSize(7.5);
        doc.text(roleText, PAGE_W - MARGIN, 11, { align: "right" });
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.2);
        doc.line(MARGIN, 14, PAGE_W - MARGIN, 14);
      }

      function sectionHeading(text, rgb) {
        ensureSpace(14);
        doc.setFillColor(...rgb);
        doc.rect(MARGIN, y - 3, 3, 8, "F");
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text(text, MARGIN + 6, y + 3);
        y += 10;
      }

      function listItem(text, bgRgb, borderRgb, textRgb = [51,65,85], maxW = COL_W - 12) {
        const lines  = doc.splitTextToSize(text, maxW);
        const LINE_H = 4.2;
        const PAD    = 3.5;
        const boxH   = lines.length * LINE_H + PAD * 2;
        ensureSpace(boxH + 3);
        doc.setFillColor(...bgRgb);
        doc.roundedRect(MARGIN, y, COL_W, boxH, 1.5, 1.5, "F");
        doc.setFillColor(...borderRgb);
        doc.rect(MARGIN, y, 2.5, boxH, "F");
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.2);
        doc.roundedRect(MARGIN, y, COL_W, boxH, 1.5, 1.5, "D");
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...textRgb);
        doc.text(lines, MARGIN + 6, y + PAD + LINE_H * 0.7);
        y += boxH + 3;
      }

      /* --- PAGE 1: Header --- */
      paintBg();

      doc.setFillColor(79, 70, 229);
      doc.rect(0, 0, PAGE_W, 3, "F");

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Resume", MARGIN, 18);
      const resW = doc.getTextWidth("Resume");
      doc.setTextColor(79, 70, 229);
      doc.text("AI", MARGIN + resW + 1, 18);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("AI-Powered Resume Analysis Report", MARGIN, 25);

      const dateStr = new Date().toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" });
      doc.text(dateStr, PAGE_W - MARGIN, 25, { align: "right" });

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(MARGIN, 29, PAGE_W - MARGIN, 29);

      y = 38;

      /* --- Target Role --- */
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(79, 70, 229);
      doc.text(jobRole?.trim() ? "TARGET ROLE:" : "AUDIT MODE:", MARGIN, y);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(51, 65, 85);
      doc.text(jobRole?.trim() ? jobRole.trim() : "General Resume Audit", MARGIN + 30, y);
      y += 8;

      /* --- Score Block --- */
      const sv     = results.score ?? 0;
      const sClr   = scoreClr(sv);
      const slStyle = getAlertStyle(sv);

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.25);
      doc.roundedRect(MARGIN, y, COL_W, 20, 2, 2, "FD");

      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...sClr);
      doc.text(`${sv}`, MARGIN + 6, y + 14);
      const numW = doc.getTextWidth(`${sv}`);
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text("/ 100", MARGIN + 7 + numW, y + 14);

      const slabel = scoreLabel(sv);
      const slW = doc.getTextWidth(slabel) + 6;
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setFillColor(...slStyle.bg);
      doc.setDrawColor(...slStyle.border);
      doc.roundedRect(MARGIN + 7 + numW + 14, y + 7, slW, 6, 1.5, 1.5, "FD");
      doc.setTextColor(...slStyle.text);
      doc.text(slabel, MARGIN + 10 + numW + 14, y + 11.2);

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(71, 85, 105);
      doc.text("OVERALL AI RATING", PAGE_W - MARGIN - 6, y + 9, { align: "right" });
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(148, 163, 184);
      doc.text("Based on standard recruiter scanning criteria", PAGE_W - MARGIN - 6, y + 13.5, { align: "right" });

      y += 24;
      rule(6);

      /* --- Badges: ATS / Keywords / Formatting --- */
      const badges = [
        { label: "ATS Ready",  value: results.atsReady ? "Pass" : "Fail",
          theme: results.atsReady ? { bg:[240,253,244], text:[21,128,61], border:[187,247,208] } : { bg:[254,242,242], text:[185,28,28], border:[254,226,226] } },
        { label: "Keywords",   value: results.keywords ?? "-",
          theme: results.keywords==="Strong" ? { bg:[240,253,244], text:[21,128,61], border:[187,247,208] }
               : results.keywords==="Weak"   ? { bg:[254,242,242], text:[185,28,28], border:[254,226,226] }
               :                               { bg:[255,251,235], text:[180,83,9],  border:[254,243,199] } },
        { label: "Formatting", value: results.formatting ?? "-",
          theme: results.formatting==="Clean" ? { bg:[240,253,244], text:[21,128,61], border:[187,247,208] }
               : results.formatting==="Messy" ? { bg:[254,242,242], text:[185,28,28], border:[254,226,226] }
               :                               { bg:[239,246,255], text:[29,78,216],  border:[191,219,254] } },
      ];
      const bW = (COL_W - 6) / 3;
      badges.forEach((b, i) => {
        const bx = MARGIN + i * (bW + 3);
        doc.setFillColor(...b.theme.bg);
        doc.setDrawColor(...b.theme.border);
        doc.setLineWidth(0.2);
        doc.roundedRect(bx, y, bW, 16, 2, 2, "FD");
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...b.theme.text);
        doc.text(b.value, bx + bW / 2, y + 6.5, { align: "center" });
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text(b.label, bx + bW / 2, y + 12.5, { align: "center" });
      });
      y += 20;
      rule(6);

      /* --- Job Match --- */
      if (results.matchPercentage != null && results.matchPercentage > 0) {
        ensureSpace(28);
        const mp     = results.matchPercentage;
        const mClr   = matchClr(mp);
        const mStyle = getAlertStyle(mp);
        doc.setFillColor(...mStyle.bg);
        doc.setDrawColor(...mStyle.border);
        doc.setLineWidth(0.25);
        doc.roundedRect(MARGIN, y, COL_W, 20, 2, 2, "FD");
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...mClr);
        doc.text(`${mp}%`, MARGIN + 6, y + 13);
        const pctW = doc.getTextWidth(`${mp}%`);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...mStyle.text);
        doc.text(matchLabel(mp), MARGIN + 10 + pctW, y + 8);
        if (results.matchAnalysis) {
          doc.setFontSize(7.5);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(51, 65, 85);
          const aLines = doc.splitTextToSize(results.matchAnalysis, COL_W - pctW - 20);
          doc.text(aLines, MARGIN + 10 + pctW, y + 13.5);
        }
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(100, 116, 139);
        doc.text("JD MATCH", PAGE_W - MARGIN - 6, y + 5, { align: "right" });
        y += 24;
        rule(6);
      }

      /* --- Section Scores --- */
      if (results.sectionScores) {
        sectionHeading("Section Breakdown", [79, 70, 229]);
        const secs = [["experience","Experience"],["skills","Skills"],["education","Education"],["formatting","Formatting"],["impact","Impact"]];
        secs.forEach(([key, label]) => {
          const val = results.sectionScores[key] ?? 0;
          const clr = scoreClr(val);
          ensureSpace(10);
          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(71, 85, 105);
          doc.text(label, MARGIN, y + 3);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...clr);
          doc.text(`${val}`, PAGE_W - MARGIN, y + 3, { align: "right" });
          doc.setFillColor(241, 245, 249);
          doc.roundedRect(MARGIN + 28, y + 0.5, COL_W - 35, 3, 0.7, 0.7, "F");
          const fillW = Math.max(3, (COL_W - 35) * (val / 100));
          doc.setFillColor(...clr);
          doc.roundedRect(MARGIN + 28, y + 0.5, fillW, 3, 0.7, 0.7, "F");
          y += 9;
        });
        y += 2;
        rule(6);
      }

      /* --- Checklist --- */
      if (results.checklist) {
        sectionHeading("Resume Fundamentals Checklist", [79, 70, 229]);
        const items = [
          ["hasContactInfo","Contact Info"],["hasLinkedIn","LinkedIn / Portfolio"],
          ["hasMetrics","Quantified Metrics"],["hasActionVerbs","Action Verbs"],
          ["hasSummary","Professional Summary"],["hasCertifications","Certifications"],
        ];
        const itemW = COL_W / 2 - 3;
        items.forEach(([key, label], idx) => {
          if (idx % 2 === 0) ensureSpace(8);
          const pass   = results.checklist[key];
          const cStyle = pass
            ? { bg:[240,253,244], text:[21,128,61],  border:[187,247,208] }
            : { bg:[254,242,242], text:[185,28,28],  border:[254,226,226] };
          const bx = MARGIN + (idx % 2) * (itemW + 6);
          doc.setFillColor(...cStyle.bg);
          doc.setDrawColor(...cStyle.border);
          doc.setLineWidth(0.2);
          doc.roundedRect(bx, y, itemW, 6.5, 1.2, 1.2, "FD");
          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...cStyle.text);
          doc.text(pass ? "+" : "-", bx + 3, y + 4.5);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.5);
          doc.setTextColor(51, 65, 85);
          doc.text(label, bx + 8.5, y + 4.5);
          if (idx % 2 === 1) y += 8.5;
        });
        if (items.length % 2 !== 0) y += 8.5;
        y += 2;
        rule(6);
      }

      /* --- Strengths --- */
      if (results.strengths?.length) {
        sectionHeading("Strengths", [34, 197, 94]);
        results.strengths.forEach(s => listItem(s, [240,253,244], [34,197,94]));
        y += 2; rule(6);
      }

      /* --- Weaknesses --- */
      if (results.weaknesses?.length) {
        sectionHeading("Areas for Improvement", [239, 68, 68]);
        results.weaknesses.forEach(w => listItem(w, [254,242,242], [239,68,68]));
        y += 2; rule(6);
      }

      /* --- Suggestions --- */
      if (results.suggestions?.length) {
        sectionHeading("Smart Strategy Advice", [79, 70, 229]);
        results.suggestions.forEach(s => listItem(s, [245,243,255], [99,102,241]));
        y += 2; rule(6);
      }

      /* --- Skill Tags --- */
      if (results.skillTags?.length) {
        sectionHeading("Detected Skills & Themes", [79, 70, 229]);
        ensureSpace(14);
        let tx = MARGIN;
        results.skillTags.forEach(skill => {
          doc.setFontSize(7.5);
          doc.setFont("helvetica", "bold");
          const tw = doc.getTextWidth(skill) + 6;
          if (tx + tw > PAGE_W - MARGIN) { tx = MARGIN; y += 8; }
          ensureSpace(9);
          doc.setFillColor(243, 232, 255);
          doc.setDrawColor(233, 213, 252);
          doc.setLineWidth(0.2);
          doc.roundedRect(tx, y, tw, 6, 1.2, 1.2, "FD");
          doc.setTextColor(109, 40, 217);
          doc.text(skill, tx + 3, y + 4.3);
          tx += tw + 2.5;
        });
        y += 10; rule(6);
      }

      /* --- Missing Keywords --- */
      if (results.missingKeywords?.length) {
        sectionHeading("Missing Keywords for Role", [239, 68, 68]);
        ensureSpace(10);
        let kx = MARGIN;
        results.missingKeywords.forEach(kw => {
          doc.setFontSize(7.5);
          doc.setFont("helvetica", "bold");
          const kw_w = doc.getTextWidth(kw) + 6;
          if (kx + kw_w > PAGE_W - MARGIN) { kx = MARGIN; y += 8; }
          ensureSpace(9);
          doc.setFillColor(254, 242, 242);
          doc.setDrawColor(254, 226, 226);
          doc.setLineWidth(0.2);
          doc.roundedRect(kx, y, kw_w, 6, 1.2, 1.2, "FD");
          doc.setTextColor(185, 28, 28);
          doc.text(kw, kx + 3, y + 4.3);
          kx += kw_w + 2.5;
        });
        y += 10; rule(6);
      }

      /* --- Project Suggestions --- */
      if (results.projectSuggestions?.length) {
        sectionHeading("Career Boost Projects", [245, 158, 11]);
        results.projectSuggestions.forEach(p => listItem(p, [254,243,199], [245,158,11]));
        y += 2; rule(6);
      }

      /* --- Rewritten Bullets --- */
      if (results.rewrittenBullets?.length) {
        sectionHeading("Tailored Bullet Rewrites", [34, 197, 94]);
        results.rewrittenBullets.forEach((b, i) => {
          ensureSpace(6);
          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(100, 116, 139);
          doc.text(`BULLET OPTIMIZATION ${i + 1}`, MARGIN, y + 3);
          y += 6;

          const origLines = doc.splitTextToSize(`${b.original}`, COL_W - 14);
          const origH = origLines.length * 4.2 + 8;
          ensureSpace(origH + 2);
          doc.setFillColor(254, 242, 242);
          doc.roundedRect(MARGIN, y, COL_W, origH, 1.5, 1.5, "F");
          doc.setFillColor(239, 68, 68);
          doc.rect(MARGIN, y, 2.5, origH, "F");
          doc.setDrawColor(254, 226, 226);
          doc.setLineWidth(0.2);
          doc.roundedRect(MARGIN, y, COL_W, origH, 1.5, 1.5, "D");
          doc.setFontSize(7.5);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(185, 28, 28);
          doc.text("ORIGINAL", MARGIN + 5, y + 4.5);
          doc.setFont("helvetica", "italic");
          doc.setTextColor(51, 65, 85);
          doc.text(origLines, MARGIN + 5, y + 9.5);
          y += origH + 2;

          const impLines = doc.splitTextToSize(`${b.improved}`, COL_W - 14);
          const impH = impLines.length * 4.2 + 8;
          ensureSpace(impH + 5);
          doc.setFillColor(240, 253, 244);
          doc.roundedRect(MARGIN, y, COL_W, impH, 1.5, 1.5, "F");
          doc.setFillColor(34, 197, 94);
          doc.rect(MARGIN, y, 2.5, impH, "F");
          doc.setDrawColor(187, 247, 208);
          doc.setLineWidth(0.2);
          doc.roundedRect(MARGIN, y, COL_W, impH, 1.5, 1.5, "D");
          doc.setFontSize(7.5);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(21, 128, 61);
          doc.text("AI OPTIMIZED", MARGIN + 5, y + 4.5);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(51, 65, 85);
          doc.text(impLines, MARGIN + 5, y + 9.5);
          y += impH + 6;
        });
        rule(6);
      }

      /* --- Footer on every page --- */
      const totalPages = doc.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.2);
        doc.line(MARGIN, PAGE_H - 10, PAGE_W - MARGIN, PAGE_H - 10);
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(148, 163, 184);
        doc.text(
          `ResumeAI  .  AI-Powered Resume Audit  .  Page ${p} of ${totalPages}`,
          PAGE_W / 2,
          PAGE_H - 6,
          { align: "center" }
        );
      }

      /* --- Save --- */
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
            Generating...
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
