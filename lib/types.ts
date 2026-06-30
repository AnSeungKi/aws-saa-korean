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

/**
 * Normalize an answer string into its sorted unique choice letters.
 * Handles single answers ("A," -> "A") and multi-answers ("A, B" -> "AB").
 */
export function normalizeAnswer(raw: string): string {
  const letters = (raw || "").toUpperCase().match(/[A-F]/g);
  if (!letters) return "";
  return [...new Set(letters)].sort().join("");
}

/** True when a question expects more than one correct choice. */
export function isMultiAnswer(raw: string): boolean {
  return normalizeAnswer(raw).length > 1;
}
