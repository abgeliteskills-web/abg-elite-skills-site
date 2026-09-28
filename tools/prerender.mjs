// Writes the coach, camp, and testimonial markup from data.js straight into the HTML pages.
//
// The browser still renders these sections from data.js (script.js), so visitors always see
// current data. This copy exists for crawlers that don't run JavaScript, which includes most
// AI bots (GPTBot, ClaudeBot, PerplexityBot): without it they see empty sections.
//
// Run after editing data.js, before pushing:
//   node tools/prerender.mjs
//
// Pass --check to only report whether any page is out of date (exits 1 if so).

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const checkOnly = process.argv.includes("--check");

const PAGES = ["index.html", "camps.html", "coaches.html", "development.html", "about.html", "register.html"];
const START = "<!-- prerendered from data.js by tools/prerender.mjs -->";
const END = "<!-- /prerendered -->";

// Evaluate data.js and render.js exactly as the browser would, in an isolated context.
const context = vm.createContext({ window: {}, console });
vm.runInContext(readFileSync(join(root, "data.js"), "utf8"), context, { filename: "data.js" });
vm.runInContext(readFileSync(join(root, "render.js"), "utf8"), context, { filename: "render.js" });
const api = vm.runInContext(
  "({ siteData: window.siteData, renderCampGrid, renderCoachGrid, renderTestimonials })",
  context
);

const renderSection = (kind, mode) => {
  if (kind === "camp-grid") {
    return api.renderCampGrid(api.siteData);
  }
  if (kind === "coach-grid") {
    return api.renderCoachGrid(api.siteData, mode);
  }
  return api.renderTestimonials(api.siteData);
};

// Matches a section container plus whatever is inside it now (nothing, or a previous prerender).
const SECTION = new RegExp(
  `(<div\\b[^>]*\\bdata-(camp-grid|coach-grid|testimonial-slider)="([^"]*)"[^>]*>)` +
    `(\\s*${START.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${END.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*|\\s*)` +
    `(</div>)`,
  "g"
);

let stale = [];

for (const page of PAGES) {
  const path = join(root, page);
  const original = readFileSync(path, "utf8");
  let sections = 0;

  const updated = original.replace(SECTION, (match, openTag, kind, mode, _inner, closeTag) => {
    sections += 1;
    const markup = renderSection(kind, mode).trim();
    return `${openTag}${START}\n${markup}\n${END}${closeTag}`;
  });

  if (!sections) {
    continue;
  }

  if (updated !== original) {
    stale.push(`${page} (${sections} section${sections === 1 ? "" : "s"})`);
    if (!checkOnly) {
      writeFileSync(path, updated);
    }
  }
}

if (checkOnly) {
  if (stale.length) {
    console.log(`Out of date, run node tools/prerender.mjs: ${stale.join(", ")}`);
    process.exit(1);
  }
  console.log("Prerendered sections are up to date.");
} else {
  console.log(stale.length ? `Updated: ${stale.join(", ")}` : "Everything was already up to date.");
}
