"use client";

import { useMemo, useState } from "react";
import { useQuestions } from "@/lib/useQuestions";
import { QuestionCard } from "@/components/QuestionCard";

const PER_PAGE = 10;
const PER_PAGE_OPTIONS = [5, 10, 20];

const WINDOW = 10;

/** Page numbers for the current group of 10, e.g. group containing page 2 -> [0..9]. */
function pageRange(current: number, count: number): number[] {
  const start = Math.floor(current / WINDOW) * WINDOW;
  const end = Math.min(start + WINDOW, count);
  return Array.from({ length: end - start }, (_, i) => start + i);
}

export default function PracticePage() {
  const { questions, loading, error } = useQuestions();
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(PER_PAGE);

  const pageCount = Math.ceil(questions.length / perPage);
  const current = useMemo(
    () => questions.slice(page * perPage, page * perPage + perPage),
    [questions, page, perPage]
  );

  const goto = (p: number) => {
    setPage(Math.max(0, Math.min(p, pageCount - 1)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading)
    return <div className="pt-20 text-center text-sm text-muted">문제를 불러오는 중…</div>;
  if (error)
    return <div className="pt-20 text-center text-sm text-red-500">{error}</div>;

  const pages = pageRange(page, pageCount);

  return (
    <div className="space-y-4 pt-6">
      <div className="sticky top-[57px] z-40 -mx-4 bg-app/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <h1 className="text-lg font-bold">전체 풀기</h1>
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <span>페이지당</span>
            {PER_PAGE_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => {
                  setPerPage(n);
                  setPage(0);
                }}
                className={`rounded-md border px-2 py-1 transition ${
                  perPage === n
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-token bg-surface2 hover:border-accent/40"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-2 text-xs text-muted">
          총 <span className="text-accent font-semibold">{questions.length}</span>개 문항
          {pageCount > 1 && ` · ${page + 1}/${pageCount} 페이지`}
        </div>
      </div>

      <div className="space-y-4">
        {current.map((q) => (
          <QuestionCard key={q.num} question={q} mode="quiz" />
        ))}
      </div>

      {pageCount > 1 && (
        <Pagination
          page={page}
          pageCount={pageCount}
          pages={pages}
          onGoto={goto}
        />
      )}
    </div>
  );
}

function Pagination({
  page,
  pageCount,
  pages,
  onGoto,
}: {
  page: number;
  pageCount: number;
  pages: number[];
  onGoto: (p: number) => void;
}) {
  const [jump, setJump] = useState("");
  const groupStart = pages[0];
  const groupEnd = pages[pages.length - 1];

  return (
    <div className="space-y-3 pt-4">
      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
        <button
          disabled={groupStart === 0}
          onClick={() => onGoto(groupStart - 1)}
          className="rounded-lg border border-token bg-surface2 px-2.5 py-1.5 text-xs transition disabled:opacity-40 enabled:hover:border-accent/50 sm:px-3 sm:py-2 sm:text-sm"
        >
          이전
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onGoto(p)}
            className={`min-w-[1.9rem] rounded-lg border px-2 py-1.5 text-xs font-mono transition sm:min-w-[2.25rem] sm:px-3 sm:py-2 sm:text-sm ${
              p === page
                ? "border-accent bg-accent text-black font-semibold"
                : "border-token bg-surface2 hover:border-accent/50"
            }`}
          >
            {p + 1}
          </button>
        ))}

        <button
          disabled={groupEnd + 1 >= pageCount}
          onClick={() => onGoto(groupEnd + 1)}
          className="rounded-lg border border-token bg-surface2 px-2.5 py-1.5 text-xs transition disabled:opacity-40 enabled:hover:border-accent/50 sm:px-3 sm:py-2 sm:text-sm"
        >
          다음
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const n = parseInt(jump, 10);
          if (!Number.isNaN(n)) onGoto(n - 1);
          setJump("");
        }}
        className="flex items-center justify-center gap-2 text-sm text-muted"
      >
        <span>페이지 이동</span>
        <input
          type="number"
          min={1}
          max={pageCount}
          value={jump}
          onChange={(e) => setJump(e.target.value)}
          placeholder={`1-${pageCount}`}
          className="w-20 rounded-lg border border-token bg-surface px-3 py-1.5 text-center outline-none transition focus:border-accent"
        />
        <button
          type="submit"
          className="rounded-lg border border-token bg-surface2 px-3 py-1.5 transition hover:border-accent/50"
        >
          이동
        </button>
      </form>
    </div>
  );
}
