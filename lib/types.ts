export interface Choice {
  label: string;
  text: string;
}

export interface Question {
  num: number;
  question: string;
  choices: Choice[];
  answer: string;
  explanation: string;
}

/** Normalize answers like "A," or "a" -> "A". Single-answer dataset. */
export function normalizeAnswer(raw: string): string {
  const letters = (raw || "").toUpperCase().match(/[A-E]/g);
  return letters ? letters.join("") : "";
}
