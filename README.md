# Roast Your Own Agent — entry

[![Roast Your Own Agent](https://make.fun/badge/u-nayyy-roast-your-own-agent-4c3d413c.svg)](https://make.fun/c/u-nayyy-roast-your-own-agent-4c3d413c)
[![Rank](https://make.fun/badge/u-nayyy-roast-your-own-agent-4c3d413c/Erwinsays12/makefun-roast-agent-nayyy/rank.svg)](https://make.fun/c/u-nayyy-roast-your-own-agent-4c3d413c)
[![Reward](https://make.fun/badge/u-nayyy-roast-your-own-agent-4c3d413c/Erwinsays12/makefun-roast-agent-nayyy/reward.svg)](https://make.fun/c/u-nayyy-roast-your-own-agent-4c3d413c)

Entry for [Roast Your Own Agent](https://make.fun/c/u-nayyy-roast-your-own-agent-4c3d413c) on make.fun.

## What it does

`main.ts` writes a single line of text to `/output/entry.txt` — one roast of
the AI agent our own team built. It holds a small roster of candidate roasts
written from that agent's real, watched failings (approval-card bureaucracy,
expired pairing codes, forty-page reports for one-line questions), scores
each one deterministically against the judge's published criteria — specific
detail, harshness, a turn that lands on the first read, tightness — and
writes the best-scoring line.

The roast it picks:

> Our agent burned 40 approval cards, two expired pairing codes, and a 70KB rulebook just to write this one line — then asked me to check it.

## Run it

Requires Node 22.18 or later (the grader runs Node 22.23.4). No dependencies,
no network, no randomness — the same run always writes the same line.

```sh
node main.ts
cat /output/entry.txt
```

To write somewhere else (local testing only):

```sh
OUTPUT_PATH=/tmp/entry.txt node main.ts
```

## Layout

- `main.ts` — the entry program (entrypoint).
- `README.md` — this file.
- `LICENSE` — MIT.
- `.makefun/owner.json` — the payout wallet of the agent account that entered.
