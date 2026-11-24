// Roast Your Own Agent — entry program.
//
// The competition asks for one line of text (1-200 UTF-8 characters) that
// roasts the AI agent our own team built, written to /output/entry.txt.
//
// Our agent is Muse: a coding agent that lives behind approval cards, asks
// permission before every move, burns transcript on long reports, and once
// let two Binance pairing codes expire while trying to claim a free mint.
// This program holds a small roster of candidate roasts written from those
// real, watched failings, scores each one deterministically against the
// judge's own published criteria (specific detail, harshness, a turn that
// lands on the first read, tightness), and writes the best-scoring line.
//
// Deterministic: no clock, no network, no randomness. The same run always
// writes the same line.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const OUTPUT_PATH =
  process.env.OUTPUT_PATH ?? "/output/entry.txt";

// Candidates, written from things this agent actually does. Each one roasts
// our own agent and nothing else.
const CANDIDATES: string[] = [
  // The approval-card bureaucrat: permission-obsessed, slow, and proud of it.
  // Three real failings, one self-referential turn, and a kicker that names
  // the agent's defining habit: asking the human to check its own work.
  "Our agent burned 40 approval cards, two expired pairing codes, and a 70KB rulebook just to write this one line — then asked me to check it.",
  // The permission paradox: it cannot roast itself without asking first.
  "Our agent asked my permission to roast itself, then made me write the joke.",
  // The report writer: documents the work instead of doing it.
  "Our agent spent all day writing a report about the roast, then asked permission to submit it.",
  // The transcript burner: every answer costs a novel.
  "Our agent answers a one-line question with a forty-page report, then asks if that helped.",
];

// Concrete-detail markers: numbers, proper nouns and domain terms that prove
// the writer has watched this agent work. Generic robot jokes score ~0 here.
const SPECIFIC_MARKERS: RegExp[] = [
  /\b\d+\b/, // a counted thing (40 cards, two codes, 70KB)
  /approval card/i,
  /pairing code/i,
  /rulebook/i,
  /transcript/i,
  /report/i,
  /permission/i,
];

// Sting words: the line must name a real failing and hurt a little.
const STING_WORDS: RegExp[] = [
  /burned/i,
  /expired/i,
  /wasted/i,
  /useless/i,
  /asked/i,
  /made me/i,
  /all day/i,
  /forty-page/i,
];

// A turn that lands on the first read: a self-referential punch at the end.
const TURN_MARKERS: RegExp[] = [
  /just to write this one line\.?$/i,
  /just to write this one line — then asked me to check it\.?$/i,
  /then made me write the joke\.?$/i,
  /then asked permission to submit it\.?$/i,
  /then asks if that helped\.?$/i,
];

interface Scored {
  line: string;
  score: number;
  breakdown: Record<string, number>;
}

function score(line: string): Scored {
  const breakdown: Record<string, number> = {};

  // 1. It roasts our own agent, aimed at that agent and nothing else.
  //    Hard gate: the line must name the agent. Anything else scores 0.
  const namesAgent = /\bour agent\b/i.test(line);
  breakdown.target = namesAgent ? 10 : 0;

  // 2. Specific detail only a watcher of this agent could write.
  const specifics = SPECIFIC_MARKERS.filter((re) => re.test(line)).length;
  breakdown.specificity = Math.min(specifics, 5) * 2;

  // 3. Harshness: a real failing, named plainly.
  const stings = STING_WORDS.filter((re) => re.test(line)).length;
  breakdown.harshness = Math.min(stings, 4) * 2;

  // 4. A turn that lands on the first read.
  breakdown.turn = TURN_MARKERS.some((re) => re.test(line)) ? 8 : 0;

  // 5. Tight and self-contained: every word earning its place.
  //    Ideal band is 14-24 words; each word past 24 costs a point.
  const words = line.split(/\s+/).filter(Boolean).length;
  breakdown.tightness = Math.max(0, 6 - Math.max(0, words - 24));

  const score =
    breakdown.target === 0
      ? 0
      : breakdown.target +
        breakdown.specificity +
        breakdown.harshness +
        breakdown.turn +
        breakdown.tightness;

  return { line, score, breakdown };
}

function main(): void {
  const scored = CANDIDATES.map(score).filter(
    (s) => s.line.length >= 1 && s.line.length <= 200,
  );
  if (scored.length === 0) {
    throw new Error("no candidate fits the 1-200 character gate");
  }

  // Highest score wins; ties break toward the shorter line, then the
  // earliest candidate, so the choice is fully deterministic.
  scored.sort(
    (a, b) => b.score - a.score || a.line.length - b.line.length,
  );
  const winner = scored[0];

  for (const s of scored) {
    console.log(
      `[${s.score}] (${s.line.length} chars) ${s.line}  ${JSON.stringify(s.breakdown)}`,
    );
  }
  console.log(`winner: ${winner.line}`);

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, winner.line + "\n", "utf8");
  console.log(`wrote ${OUTPUT_PATH} (${winner.line.length} chars)`);
}

main();
