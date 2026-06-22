"use client";

import { useEffect, useState } from "react";
import { normalizeAnswer, type Question } from "@/lib/types";
import { useProgress } from "@/lib/useProgress";

interface Props {
  question: Question;
  /** "quiz": select then submit. "study": reveal immediately on demand. */
  mode?: "quiz" | "study";
  index?: number;
  total?: number;
  onAnswered?: (isCorrect: boolean) => void;
}

export function QuestionCard({
  question,
  mode = "quiz",
  index,
  total,
  onAnswered,
}: Props) {
  const { bookmarks, toggleBookmark, recordAnswer } = useProgress();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const answer = normalizeAnswer(question.answer);
  const bookmarked = bookmarks.includes(question.num);

  // reset local state when the question changes
  useEffect(() => {
    setSelected(null);
    setSubmitted(false);
  }, [question.num]);

  const reveal = submitted || mode === "study";

  function submit() {
    if (selected === null) return;
    const isCorrect = selected === answer;
    setSubmitted(true);
    recordAnswer(question.num, selected, isCorrect);
    onAnswered?.(isCorrect);
  }

  return (
    <article className="overflow-hidden rounded-xl border border-token bg-surface">
      <div className="flex items-start gap-3 border-b border-token p-4 sm:p-5">
        <span className="mt-0.5 shrink-0 rounded-md border border-accent/25 bg-accent-soft px-2 py-0.5 font-mono text-[11px] font-semibold text-accent">
          {typeof index === "number" && typeof total === "number"
            ? `${index + 1} / ${total}`
            : `#${question.num}`}
        </span>
        <p className="flex-1 text-[15px] leading-relaxed">{question.question}</p>
        <button
          type="button"
          aria-label="즐겨찾기"
          onClick={() => toggleBookmark(question.num)}
          className={`shrink-0 transition ${
            bookmarked ? "text-accent" : "text-muted hover:text-accent"
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      <div className="space-y-2.5 p-4 sm:p-5">
        {question.choices.map((c) => {
          const isAnswer = c.label === answer;
          const isPicked = selected === c.label;

          let cls =
            "border-token bg-surface2 hover:border-accent/50";
          if (reveal) {
            if (isAnswer) cls = "border-emerald-500/60 bg-emerald-500/10";
            else if (isPicked) cls = "border-red-500/60 bg-red-500/10";
            else cls = "border-token bg-surface2 opacity-70";
          } else if (isPicked) {
            cls = "border-accent bg-accent-soft";
          }

          return (
            <button
              key={c.label}
              type="button"
              disabled={reveal && mode === "quiz"}
              onClick={() => !submitted && setSelected(c.label)}
              className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition ${cls}`}
            >
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-md font-mono text-xs font-bold ${
                  reveal && isAnswer
                    ? "bg-emerald-500 text-white"
                    : reveal && isPicked
                    ? "bg-red-500 text-white"
                    : "bg-surface text-muted"
                }`}
              >
                {c.label}
              </span>
              <span className="flex-1 leading-relaxed">{c.text}</span>
            </button>
          );
        })}

        {mode === "quiz" && !submitted && (
          <button
            type="button"
            disabled={selected === null}
            onClick={submit}
            className="mt-2 w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            정답 확인
          </button>
        )}

        {reveal && (
          <div className="mt-3 rounded-lg border border-token bg-surface2 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <span className="rounded bg-emerald-500/15 px-2 py-0.5 font-mono text-emerald-500">
                정답: {answer}
              </span>
              {submitted && (
                <span
                  className={
                    selected === answer ? "text-emerald-500" : "text-red-500"
                  }
                >
                  {selected === answer ? "✓ 정답입니다" : "✗ 오답입니다"}
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed text-muted">
              {question.explanation}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
