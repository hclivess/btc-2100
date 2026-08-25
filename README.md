# btc-2100

A page about the **1064/364 day Bitcoin cycle pattern**: three cycles of evidence, what the dates actually
say, and what extrapolating them honestly implies.

**→ [hclivess.github.io/btc-2100](https://hclivess.github.io/btc-2100/)**

## The pattern

Posted on /biz/ in December 2023: a bull run lasts **1064 days** from the bottom, and the bear that follows
lasts **364 days**. Measured against the three cycles since 2015:

| # | Bottom | Top | Bull | Multiple | Bear that followed |
|---|---|---|---|---|---|
| 1 | 2015-01-14 · $170 | 2017-12-17 · $19,783 | 1068 d | 116.4× | 363 d, −84% |
| 2 | 2018-12-15 · $3,122 | 2021-11-10 · $68,789 | 1061 d | 22.0× | 376 d, −78% |
| 3 | 2022-11-21 · $15,460 | 2025-10-06 · $126,210 | 1050 d | 8.2× | pending |

So the pattern is good to a fortnight, not to the day — and the cycle it called in advance is the one
furthest from 1064. The page audits that prediction properly: chained from the 2021 top the pattern points
at 2025-10-08, **two days** from the top that happened; chained from the 2022 bottom it points at 2025-10-20,
fourteen days out. Which of those was named in advance is what decides how impressive it was, because after
the fact one of four anchors can always be chosen.

## What changed in this version

The previous version of this page stated things its own arithmetic did not support. Every one of these is
now either fixed or computed from the data:

- **"Total return 127M%"** — from $0.00099 to $126,210 is 127 million **times**, which is 12.7 **billion**
  per cent. The figure was out by a factor of a hundred and had the wrong unit.
- **"2100 projection: $425K"** — the page's own loop ended at $340K, and no line of code produced $425K.
- **"Verified 1064/364 · Exact date hit"** — the three bull runs are 1068, 1061 and 1050 days and the two
  bears 363 and 376. Nothing here is exact, and the page now shows the misses instead of the claim.
- **The projection ignored the pattern it was named after.** It advanced `year += 3` for each bull and
  `year += 1` for each bear — four-year cycles — while 1064 + 364 days is 3.91 years, and it placed every
  top in September and every bottom in October regardless. (The unpublished `btc_complete.jsx` in the repo
  did this part correctly; the published page did not. That file has been removed rather than left to
  disagree with the page.)
- **The first projected cycle peaked below the previous top** ($111K against $126,210) with nothing said
  about it, under a headline promising a rising staircase.
- **The x-axis was a category axis**, so 2009→2010 took the same width as 2094→2098: the shape of the curve
  was an artefact of the label list. It is a real time axis now.
- **An assumed 78% drawdown for cycle 3 sat in the table of historical cycles** as though it had happened.

## What it says now

Each cycle multiplies the bottom by less than the last: 116×, 22×, 8×. On a log scale those steps shrink by
a factor of **0.60**, and that single number — two differences between three points — is the whole fit.
Continued, it takes the multiplier towards 1× and growth towards nothing.

What 2100 looks like then depends entirely on the drawdowns, which is where the honesty lives:

| Continuation | Fitted from the data | Chosen | End of the century |
|---|---|---|---|
| Drawdowns stay ~81% as observed | multiplier decay, both cycle lengths | that the drawdown never softens | under $1,000 by 2045, falling |
| Drawdowns soften at the same rate | multiplier decay, cycle lengths, first drawdown | that drawdowns fade exactly as multipliers do | ≈ $126K |
| The old page's hand-picked pairs | nothing | all nineteen multipliers and drawdowns | ≈ $483K |

Same history, same pattern, answers from nothing to half a million. The distance between them is not
evidence about Bitcoin; it is two rules nobody can fit to three data points. The part that *is* fitted says
something narrower and duller: the multiplier is heading for 1×, so on this pattern's own terms the ceiling
is not far above where the price already is.

## The next test

The pattern puts the next bottom at **2026-10-05** and the top after it at **2029-09-03**. The page counts
down to the first of those, and neither has been confirmed here.

## Checking it yourself

`index.html` is self-contained: one block of hand-entered data, and every figure on the page computed from
it, so no number in the prose can drift out of step with the numbers in the chart.

```
python verify.py        # reads the data block out of the published page and checks the arithmetic
node check_page.mjs     # runs the page's own script headlessly: finite values, no NaN, no empty sections
```

`verify.py` also refuses any hand-typed money figure in the visible markup, which is exactly how "127M%"
and "$425K" survived in the first place. Both run in CI on every push.

## Not investment advice

Three cycles is three data points. One prediction landing is one prediction landing — the forecasts that
missed are not collected anywhere. This is pattern extrapolation, published because it is interesting.

## License

MIT — see [LICENSE](LICENSE). The pattern itself came from a public post in December 2023.
