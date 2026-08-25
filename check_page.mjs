/**
 * Run the page's own script the way a browser runs it, and check what it produces.
 *
 *     node check_page.mjs
 *
 * The script is evaluated as **global code in a context holding the browser's unforgeable globals** —
 * window, self, top, location, document, defined non-configurable exactly as a browser defines them. That
 * matters: `let top = ...` at the top level of a classic script is a SyntaxError in a browser and takes the
 * whole page down with it, and an earlier version of this checker missed exactly that by evaluating the
 * script inside a function, where `top` is just another local name. Everything below the parse is
 * arithmetic: a chart that plots NaN, a schedule with no turns, a section that renders empty.
 */
import { readFileSync } from "node:fs";
import vm from "node:vm";

const html = readFileSync("index.html", "utf8");
const script = html.split("<script>\n")[1].split("</script>")[0];

const elements = {};
const charts = [];
const sandbox = {
  console, Date, Math, JSON, Number, String, Array, Object, Intl, RegExp, parseInt, parseFloat, isFinite,
  __document: { getElementById: id => (elements[id] = elements[id] || { innerHTML: "", textContent: "" }) },
  __Chart: class { constructor(_target, config) { charts.push(config); } },
};
vm.createContext(sandbox);
// defined from inside the context so they are real own properties of its global object — that is what
// makes `let top` a SyntaxError there, exactly as in a browser
vm.runInContext(`
  document = __document; Chart = __Chart;
  for (const name of ["window", "self", "top", "location", "document", "parent", "frames"]) {
    Object.defineProperty(globalThis, name, {
      value: name === "document" ? __document : globalThis, writable: false, configurable: false });
  }`, sandbox);

try {
  vm.runInContext(script + "\n;globalThis.__out = {schedule, measured, anchors, cycleDays, PATTERN};", sandbox);
} catch (error) {
  console.log("FAILED: the page's script does not run in a browser:", error.constructor.name + ":", error.message);
  process.exit(1);
}

const { schedule, measured, anchors, cycleDays, PATTERN } = sandbox.__out;
const problems = [];

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

// the whole point of the page: every scheduled turn is exactly the rule away from the one before it
if (!schedule.length) problems.push("the schedule is empty");
let previousTop = null;
for (const row of schedule) {
  const bottom = new Date(row.bottom + "T00:00:00Z"), turn = new Date(row.top + "T00:00:00Z");
  const bull = Math.round((turn - bottom) / 86400000);
  if (bull !== PATTERN.bullDays) problems.push(`cycle ${row.cycle}: ${bull} days bottom to top, not ${PATTERN.bullDays}`);
  if (previousTop) {
    const bear = Math.round((bottom - previousTop) / 86400000);
    if (bear !== PATTERN.bearDays) problems.push(`cycle ${row.cycle}: ${bear} days from the last top, not ${PATTERN.bearDays}`);
  }
  if (+row.bottom.slice(0, 4) > 2100) problems.push(`the schedule runs past 2100: ${row.bottom}`);
  previousTop = turn;
}
if (cycleDays !== PATTERN.bullDays + PATTERN.bearDays) problems.push("the cycle length is not the two halves added up");
if (anchors.length < 2) problems.push("the anchors table has nothing to compare");

for (const key of ["ruleTitle", "ruleLine", "nextTest", "cycleNote", "anchorNote", "vsBull", "vsBear"]) {
  const text = elements[key]?.textContent || "";
  if (text.length < 3) problems.push(`the page's "${key}" line came out empty`);
  if (/NaN|undefined|Infinity/.test(text)) problems.push(`the page's "${key}" line contains ${text}`);
}
for (const key of ["cycleTable", "scheduleTable", "anchorTable"]) {
  const markup = elements[key]?.innerHTML || "";
  if (!markup.includes("<")) problems.push(`the page's "${key}" came out empty`);
  if (/NaN|undefined|Infinity/.test(markup)) problems.push(`"${key}" contains NaN or undefined`);
}

console.log(`the rule: ${PATTERN.bullDays} / ${PATTERN.bearDays} = ${cycleDays} days`);
console.log(`cycles measured: ${measured.map(c => c.bullDays + "d").join(", ")}`);
console.log(`schedule: ${schedule.length} turns, ${schedule[0].bottom} to ${schedule[schedule.length - 1].top}`);
for (const line of problems) console.log("FAILED:", line);
process.exit(problems.length ? 1 : 0);
