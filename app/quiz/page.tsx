"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuestions } from "@/lib/useQuestions";
import { QuestionCard } from "@/components/QuestionCard";
import type { Question } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "setup" | "run" | "result";

const SIZES = [10, 20, 50, 0]; // 0 = 전체

export default function QuizPage() {
  const { questions, loading, error } = useQuestions();
  const [phase, setPhase] = useState<Phase>("setup");
  const [size, setSize] = useState(20);
  const [random, setRandom] = useState(true);
  const [set, setSet] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answeredThis, setAnsweredThis] = useState(false);

  const start = () => {
    const base = random ? shuffle(questions) : questions;
    const picked = size === 0 ? base : base.slice(0, size);
    setSet(picked);
    setIdx(0);
    setScore(0);
    setAnsweredThis(false);
    setPhase("run");
  };

  const onAnswered = (correct: boolean) => {
    if (correct) setScore((s) => s + 1);
    setAnsweredThis(true);
  };

  const next = () => {
    if (idx + 1 >= set.length) {
      setPhase("result");
    } else {
      setIdx((i) => i + 1);
      setAnsweredThis(false);
    }
  };

  const progressPct = useMemo(
    () => (set.length ? Math.round((idx / set.length) * 100) : 0),
    [idx, set.length]
  );

  if (loading) return <Loading />;
  if (error) return <ErrorBox message={error} />;

  if (phase === "setup") {
    return (
      <div className="space-y-6 pt-8">
        <h1 className="text-2xl font-bold">퀴즈 설정</h1>
        <div className="rounded-xl border border-token bg-surface p-6 space-y-6">
          <div>
            <div className="mb-3 text-sm font-semibold">문항 수</div>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`rounded-lg border px-4 py-2 text-sm transition ${
                    size === s
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-token bg-surface2 hover:border-accent/40"
                  }`}
                >
                  {s === 0 ? `전체 (${questions.length})` : `${s}문항`}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-3 text-sm font-semibold">출제 순서</div>
            <div className="flex gap-2">
              <button
                onClick={() => setRandom(true)}
                className={`rounded-lg border px-4 py-2 text-sm transition ${
                  random
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-token bg-surface2 hover:border-accent/40"
                }`}
              >
                랜덤
              </button>
              <button
                onClick={() => setRandom(false)}
                className={`rounded-lg border px-4 py-2 text-sm transition ${
                  !random
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-token bg-surface2 hover:border-accent/40"
                }`}
              >
                번호순
              </button>
            </div>
          </div>
          <button
            onClick={start}
            className="w-full rounded-lg bg-accent py-3 text-sm font-semibold text-black transition hover:brightness-110"
          >
            시작
          </button>
        </div>
      </div>
    );
  }

  if (phase === "result") {
    const pct = set.length ? Math.round((score / set.length) * 100) : 0;
    return (
      <div className="space-y-6 pt-12">
        <div className="rounded-2xl border border-token bg-surface p-8 text-center">
          <div className="text-sm text-muted">결과</div>
          <div className="my-3 font-mono text-5xl font-bold text-accent">{pct}점</div>
          <p className="text-sm text-muted">
            {set.length}문항 중 <span className="text-emerald-500 font-semibold">{score}개 정답</span>
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => setPhase("setup")}
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-black transition hover:brightness-110"
            >
              다시 풀기
            </button>
            <Link
              href="/review?filter=wrong"
              className="rounded-lg border border-token bg-surface2 px-5 py-2.5 text-sm font-semibold transition hover:border-accent/50"
            >
              오답 복습
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // run
  const q = set[idx];
  return (
    <div className="space-y-4 pt-6">
      <div className="sticky top-[57px] z-40 -mx-4 bg-app/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex items-center justify-between text-xs text-muted">
          <span className="font-mono">{idx + 1} / {set.length}</span>
          <span className="font-mono">정답 {score}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface2">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <QuestionCard
        key={q.num}
        question={q}
        mode="quiz"
        index={idx}
        total={set.length}
        onAnswered={onAnswered}
      />

      {answeredThis && (
        <button
          onClick={next}
          className="w-full rounded-lg bg-accent py-3 text-sm font-semibold text-black transition hover:brightness-110"
        >
          {idx + 1 >= set.length ? "결과 보기" : "다음 문제 →"}
        </button>
      )}
    </div>
  );
}

function Loading() {
  return (
    <div className="pt-20 text-center text-sm text-muted">문제를 불러오는 중…</div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="pt-20 text-center text-sm text-red-500">{message}</div>
  );
}
