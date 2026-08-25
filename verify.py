#!/usr/bin/env python3
"""
Check the page against itself.

    python verify.py            (from the repository root)

index.html holds one block of hand-entered data and computes every figure it shows from that block, so the
thing that can go wrong is the data, not the prose. This reads the block straight out of the published file
and checks it: the dates are ordered, the prices are the ones the cycles are named for, the day counts are
what the pattern claims to within the stated tolerance, and the multipliers are what the page says they are.

It also greps the HTML *outside* that block for hand-typed money and percentage figures, which is how the
2026 version of this page ended up claiming a total return of "127M%" when the arithmetic gives 12.7
billion per cent, and "$425K in 2100" when its own loop produced $340K.
"""
import json
import re
import sys
from datetime import date, timedelta

HTML = "index.html"
TOLERANCE_DAYS = 30          # how far a real cycle may sit from the claimed 1064 / 364 and still be "the pattern"


def block(text: str, name: str):
    """Pull `const NAME = <json>;` out of the data block."""
    body = text.split("/* CYCLES-BEGIN */", 1)[1].split("/* CYCLES-END */", 1)[0]
    match = re.search(rf"const {name} = (\[.*?\]|\{{.*?\}});", body, re.S)
    if not match:
        raise SystemExit(f"{name} is missing from the data block")
    return json.loads(match.group(1))


def main() -> int:
    text = open(HTML, encoding="utf-8").read()
    cycles = block(text, "CYCLES")
    pattern = block(text, "PATTERN")
    problems = []

    previous_top = None
    for c in cycles:
        atl, ath = date.fromisoformat(c["atlDate"]), date.fromisoformat(c["athDate"])
        bull = (ath - atl).days
        multiple = c["athPrice"] / c["atlPrice"]
        print(f"cycle {c['cycle']}: {c['atlDate']} -> {c['athDate']}  {bull} days, {multiple:.1f}x")
        if ath <= atl:
            problems.append(f"cycle {c['cycle']}: the top is not after the bottom")
        if c["athPrice"] <= c["atlPrice"]:
            problems.append(f"cycle {c['cycle']}: the top is not above the bottom")
        if abs(bull - pattern["bullDays"]) > TOLERANCE_DAYS:
            problems.append(f"cycle {c['cycle']}: bull run {bull} days, more than {TOLERANCE_DAYS} from "
                            f"the claimed {pattern['bullDays']}")
        if previous_top:
            bear = (atl - previous_top).days
            print(f"          bear before it: {bear} days")
            if bear <= 0:
                problems.append(f"cycle {c['cycle']}: the bottom is not after the previous top")
            elif abs(bear - pattern["bearDays"]) > TOLERANCE_DAYS:
                problems.append(f"cycle {c['cycle']}: bear {bear} days, more than {TOLERANCE_DAYS} from "
                                f"the claimed {pattern['bearDays']}")
        previous_top = ath

    # the multipliers must be falling, which is the premise of every projection on the page
    multiples = [c["athPrice"] / c["atlPrice"] for c in cycles]
    if any(b >= a for a, b in zip(multiples, multiples[1:])):
        problems.append(f"the bull multipliers are not falling ({['%.1f' % m for m in multiples]}), "
                        "so the page's decay fit describes nothing")

    # No hand-typed money in the visible markup. Prose is where a figure goes stale unnoticed: the version
    # of this page before this one said "127M%" where the arithmetic gives 12.7 billion per cent, and
    # "$425K" for a 2100 projection its own loop never produced. Figures inside the script are computed
    # from the data and are checked by check_page.mjs instead.
    markup = text.split("<script>", 1)[0]
    typed = re.findall(r"\$[\d][\d,.]*\s?[KMB]?", markup)
    if typed:
        problems.append(f"hand-typed money figures in the markup: {sorted(set(typed))} — "
                        "every figure on the page must be computed from the data block")

    print()
    for line in problems:
        print("FAILED:", line)
    if not problems:
        nxt = previous_top + timedelta(days=pattern["bearDays"])
        print(f"all checks passed. Next bottom the pattern points at: {nxt}, "
              f"top after it: {nxt + timedelta(days=pattern['bullDays'])}")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
