# btc-2100

**1064 days from the bottom to the top, 364 back down.** That is the whole rule. This repository is a page
that measures it against the three cycles it came from and lists every date it points at to 2100.

**→ [hclivess.github.io/btc-2100](https://hclivess.github.io/btc-2100/)**

## The rule against the cycles it is drawn from

| # | Bottom | Top | Bull | vs 1064 | Bear that followed | vs 364 |
|---|---|---|---|---|---|---|
| 1 | 2015-01-14 | 2017-12-17 | 1068 d | +4 | 363 d | −1 |
| 2 | 2018-12-15 | 2021-11-10 | 1061 d | −3 | 376 d | +12 |
| 3 | 2022-11-21 | 2025-10-06 | 1050 d | −14 | pending | — |

Good to a fortnight, not to the day — and the cycle it called in advance is the one furthest from 1064.

## How well it called the 2025 top

Counted from the 2021 top (+364, +1064) it points at **2025-10-08**, two days from the top that happened.
Counted from the 2022 bottom (+1064) it points at 2025-10-20, fourteen days out. Which of those was the one
posted in December 2023 decides how good the call was, because after the fact any anchor can be picked.

## What comes next

| | Bottom | Top |
|---|---|---|
| Cycle 4 | 2026-10-05 | 2029-09-03 |
| Cycle 5 | 2030-09-02 | 2033-08-01 |
| Cycle 6 | 2034-07-31 | 2037-06-29 |

…and so on every 1428 days (3.91 years). The page lists all nineteen turns to 2100 and counts down to the
next one.

## Checking it

`index.html` holds one block of hand-entered dates and computes everything else from it, so no figure on the
page can drift out of step with the data.

```
python verify.py        # the dates, the day counts against the rule, and no hand-typed figures in the markup
node check_page.mjs     # runs the page's script headlessly: every scheduled turn exactly 1064/364 apart
```

Both run in CI on every push.

## Not investment advice

Three cycles is three data points, and one prediction landing is one prediction landing. Pattern
extrapolation, published because it is interesting.

## License

MIT — see [LICENSE](LICENSE). The pattern itself came from a public post in December 2023.
