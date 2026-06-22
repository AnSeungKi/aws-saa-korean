"use client";

import Link from "next/link";
import { useQuestions } from "@/lib/useQuestions";
import { useProgress } from "@/lib/useProgress";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-token bg-surface p-4">
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-1 font-mono text-2xl font-bold text-accent">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}
    </div>
  );
}

export default function HomePage() {
  const { questions, loading } = useQuestions();
  const { correct, wrong, bookmarks, answered } = useProgress();

  const total = questions.length;
  const answeredCount = Object.keys(answered).length;
  const accuracy =
    answeredCount > 0
      ? Math.round((correct.length / (correct.length + wrong.length || 1)) * 100)
      : 0;

  return (
    <div className="space-y-8 pt-8">
      <section className="rounded-2xl border border-token bg-surface p-6 sm:p-8">
        <h1 className="text-2xl font-bold sm:text-3xl">
          AWS SAA-C03 한국어 문제집
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Solutions Architect Associate 시험 대비 {loading ? "…" : total}문항.
          보기를 선택하면 즉시 채점하고 상세 해설을 보여줍니다. 진행상황은
          브라우저에 저장됩니다.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/quiz"
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-black transition hover:brightness-110"
          >
            퀴즈 시작하기
          </Link>
          <Link
            href="/browse"
            className="rounded-lg border border-token bg-surface2 px-5 py-2.5 text-sm font-semibold transition hover:border-accent/50"
          >
            전체 문제 탐색
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="전체 문항" value={loading ? "…" : total} />
        <StatCard
          label="푼 문제"
          value={answeredCount}
          sub={total ? `${Math.round((answeredCount / total) * 100)}% 진행` : undefined}
        />
        <StatCard label="정답률" value={`${accuracy}%`} sub={`정답 ${correct.length} · 오답 ${wrong.length}`} />
        <StatCard label="즐겨찾기" value={bookmarks.length} />
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/review?filter=wrong"
          className="group rounded-xl border border-token bg-surface p-5 transition hover:border-accent/50"
        >
          <div className="text-sm font-semibold">틀린 문제 복습 →</div>
          <p className="mt-1 text-xs text-muted">
            오답으로 기록된 {wrong.length}문항을 다시 풉니다.
          </p>
        </Link>
        <Link
          href="/review?filter=bookmarks"
          className="group rounded-xl border border-token bg-surface p-5 transition hover:border-accent/50"
        >
          <div className="text-sm font-semibold">즐겨찾기 복습 →</div>
          <p className="mt-1 text-xs text-muted">
            저장한 {bookmarks.length}문항을 모아봅니다.
          </p>
        </Link>
      </section>
    </div>
  );
}
