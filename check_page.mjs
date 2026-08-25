/**
 * Run the page's own script outside a browser and check what it produces.
 *
 *     node check_page.mjs
 *
 * There are no charts and no DOM here — the point is the arithmetic that fills them. A chart that plots
 * NaN, an Infinity from a division, or a schedule that produces no turns at all are all things that look
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
  "\nreturn {schedule, measured, anchors, cycleDays, PATTERN};")();

const problems = [];
const { schedule, measured, anchors, cycleDays, PATTERN } = scope;

if (charts.length !== 1) problems.push(`${charts.length} charts built, expected 1`);
for (const chart of charts) {
  for (const dataset of chart.data.datasets) {
    for (const value of dataset.data) {
      if (![value.x, value.y].every(Number.isFinite)) {
        problems.push(`chart "${dataset.label}" holds a value that is not finite: ${JSON.stringify(value)}`);
        break;
      }
    }
  }
}
if (!schedule.length) problems.push("the schedule is empty");
let previous = null;
for (const row of schedule) {
  const bottom = new Date(row.bottom + "T00:00:00Z"), top = new Date(row.top + "T00:00:00Z");
  const bull = Math.round((top - bottom) / 86400000);
  if (bull !== PATTERN.bullDays) problems.push(`cycle ${row.cycle}: ${bull} days from bottom to top, not ${PATTERN.bullDays}`);
  if (previous) {
    const bear = Math.round((bottom - previous) / 86400000);
    if (bear !== PATTERN.bearDays) problems.push(`cycle ${row.cycle}: ${bear} days from the last top, not ${PATTERN.bearDays}`);
  }
  if (+row.bottom.slice(0, 4) > 2100) problems.push(`the schedule runs past 2100: ${row.bottom}`);
  previous = top;
}
if (cycleDays !== PATTERN.bullDays + PATTERN.bearDays) problems.push("the cycle length is not the two halves added up");
if (anchors.length < 2) problems.push("the anchors table has nothing to compare");

for (const key of ["ruleTitle", "ruleLine", "nextTest", "cycleNote", "anchorNote"]) {
  const text = elements[key]?.textContent || "";
  if (text.length < 5) problems.push(`the page's "${key}" line came out empty`);
  if (/NaN|undefined|Infinity/.test(text)) problems.push(`the page's "${key}" line contains ${text}`);
}
for (const key of ["cycleTable", "scheduleTable", "anchorTable"]) {
  const html = elements[key]?.innerHTML || "";
  if (!html.includes("<")) problems.push(`the page's "${key}" came out empty`);
  if (/NaN|undefined|Infinity/.test(html)) problems.push(`"${key}" contains NaN or undefined`);
}

console.log(`the rule: ${PATTERN.bullDays} / ${PATTERN.bearDays} = ${cycleDays} days`);
console.log(`cycles measured: ${measured.map(c => c.bullDays + "d").join(", ")}`);
console.log(`schedule: ${schedule.length} turns, ${schedule[0].bottom} to ${schedule[schedule.length - 1].top}`);
for (const line of problems) console.log("FAILED:", line);
process.exit(problems.length ? 1 : 0);
