"use client";

import { useMemo, useState } from "react";
import { useQuestions } from "@/lib/useQuestions";
import { QuestionCard } from "@/components/QuestionCard";

const PER_PAGE = 15;

export default function BrowsePage() {
  const { questions, loading, error } = useQuestions();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return questions;
    return questions.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.explanation.toLowerCase().includes(q) ||
        item.choices.some((c) => c.text.toLowerCase().includes(q)) ||
        String(item.num) === q
    );
  }, [questions, query]);

  const pageCount = Math.ceil(filtered.length / PER_PAGE);
  const current = filtered.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  if (loading)
    return <div className="pt-20 text-center text-sm text-muted">문제를 불러오는 중…</div>;
  if (error)
    return <div className="pt-20 text-center text-sm text-red-500">{error}</div>;

  return (
    <div className="space-y-4 pt-6">
      <div className="sticky top-[57px] z-40 -mx-4 bg-app/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
          placeholder="문제 / 보기 / 해설 검색 (번호도 가능)"
          className="w-full rounded-lg border border-token bg-surface px-4 py-2.5 text-sm outline-none transition focus:border-accent"
        />
        <div className="mt-2 text-xs text-muted">
          총 <span className="text-accent font-semibold">{filtered.length}</span>개 문항
          {pageCount > 1 && ` · ${page + 1}/${pageCount} 페이지`}
        </div>
      </div>

      <div className="space-y-4">
        {current.map((q) => (
          <QuestionCard key={q.num} question={q} mode="study" />
        ))}
        {current.length === 0 && (
          <div className="py-20 text-center text-sm text-muted">
            검색 결과가 없습니다.
          </div>
        )}
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            disabled={page === 0}
            onClick={() => {
              setPage((p) => p - 1);
              window.scrollTo({ top: 0 });
            }}
            className="rounded-lg border border-token bg-surface2 px-4 py-2 text-sm transition disabled:opacity-40 enabled:hover:border-accent/50"
          >
            이전
          </button>
          <span className="px-2 font-mono text-sm text-muted">
            {page + 1} / {pageCount}
          </span>
          <button
            disabled={page + 1 >= pageCount}
            onClick={() => {
              setPage((p) => p + 1);
              window.scrollTo({ top: 0 });
            }}
            className="rounded-lg border border-token bg-surface2 px-4 py-2 text-sm transition disabled:opacity-40 enabled:hover:border-accent/50"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
