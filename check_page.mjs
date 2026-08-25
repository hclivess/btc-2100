/**
 * Run the page's own script outside a browser and check what it produces.
 *
 *     node check_page.mjs
 *
 * There are no charts and no DOM here — the point is the arithmetic that fills them. A chart that plots
 * NaN, an Infinity from a division, or a scenario that produces no points at all are all things that look
 * fine in the source and wrong on the screen, and all three are caught here.
 */
import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const script = html.split("<script>\n")[1].split("</script>")[0];

const elements = {};
const charts = [];
globalThis.document = { getElementById: id => (elements[id] = elements[id] || { innerHTML: "", textContent: "" }) };
globalThis.Chart = class { constructor(_el, cfg) { charts.push(cfg); } };

const scope = new Function(script.replace(/document\.getElementById\("(\w+Chart)"\)/g, '"$1"') +
  "\nreturn {scenarios, measured, decay, anchors, elements: null};")();

const problems = [];
const { scenarios, measured, decay } = scope;

if (charts.length !== 3) problems.push(`${charts.length} charts built, expected 3`);
for (const chart of charts) {
  for (const dataset of chart.data.datasets) {
    for (const value of dataset.data) {
      const numbers = typeof value === "object" ? [value.x, value.y] : [value];
      if (numbers.some(n => !Number.isFinite(n))) {
        problems.push(`chart "${dataset.label}" contains a value that is not finite: ${JSON.stringify(value)}`);
        break;
      }
    }
  }
}
if (!scenarios.length) problems.push("no scenarios were produced");
for (const s of scenarios) {
  if (!s.points.length) problems.push(`scenario "${s.label}" produced no points`);
  if (!Number.isFinite(s.end) || !Number.isFinite(s.peak)) problems.push(`scenario "${s.label}" ends at ${s.end}`);
  const years = s.points.map(p => +p.date.slice(0, 4));
  if (Math.max(...years) > 2100) problems.push(`scenario "${s.label}" runs past 2100`);
}
if (!(decay > 0 && decay < 1)) problems.push(`the fitted decay is ${decay}, which is not a fading multiplier`);
for (const key of ["nextTest", "anchorNote", "cycleNote", "fitNote", "spreadNote"]) {
  const text = elements[key]?.textContent || "";
  if (text.length < 20) problems.push(`the page's "${key}" line came out empty`);
  if (/NaN|undefined|Infinity/.test(text)) problems.push(`the page's "${key}" line contains ${text}`);
}
for (const key of ["anchorTable", "cycleTable", "scenarioCards"]) {
  if (!(elements[key]?.innerHTML || "").includes("<")) problems.push(`the page's "${key}" came out empty`);
  if (/NaN|undefined|Infinity/.test(elements[key]?.innerHTML || "")) problems.push(`"${key}" contains NaN or undefined`);
}

console.log(`cycles measured: ${measured.map(c => `${c.bullDays}d ${c.multiple.toFixed(1)}x`).join(", ")}`);
console.log(`fitted decay: ${decay.toFixed(3)} per cycle`);
for (const s of scenarios) {
  console.log(`  ${s.label}: ${s.diesBy ? `under $1,000 by ${s.diesBy}` : "$" + Math.round(s.end).toLocaleString()}`);
}
for (const line of problems) console.log("FAILED:", line);
process.exit(problems.length ? 1 : 0);
