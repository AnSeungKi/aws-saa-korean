"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuestions } from "@/lib/useQuestions";
import { useProgress } from "@/lib/useProgress";
import { QuestionCard } from "@/components/QuestionCard";

function ReviewInner() {
  const params = useSearchParams();
  const router = useRouter();
  const filter = params.get("filter") === "bookmarks" ? "bookmarks" : "wrong";

  const { questions, loading } = useQuestions();
  const { wrong, bookmarks } = useProgress();

  const nums = filter === "bookmarks" ? bookmarks : wrong;
  const list = useMemo(
    () =>
      questions
        .filter((q) => nums.includes(q.num))
        .sort((a, b) => a.num - b.num),
    [questions, nums]
  );

  const tabCls = (active: boolean) =>
    `rounded-lg px-4 py-2 text-sm transition ${
      active
        ? "bg-accent-soft text-accent"
        : "border border-token bg-surface2 text-muted hover:text-default"
    }`;

  return (
    <div className="space-y-4 pt-6">
      <h1 className="text-2xl font-bold">복습</h1>
      <div className="flex gap-2">
        <button
          onClick={() => router.replace("/review?filter=wrong")}
          className={tabCls(filter === "wrong")}
        >
          틀린 문제 ({wrong.length})
        </button>
        <button
          onClick={() => router.replace("/review?filter=bookmarks")}
          className={tabCls(filter === "bookmarks")}
        >
          즐겨찾기 ({bookmarks.length})
        </button>
      </div>

      {loading ? (
        <div className="pt-16 text-center text-sm text-muted">불러오는 중…</div>
      ) : list.length === 0 ? (
        <div className="py-20 text-center text-sm text-muted">
          {filter === "bookmarks"
            ? "즐겨찾기한 문항이 없습니다."
            : "틀린 문항이 없습니다. 잘하고 있어요!"}
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((q) => (
            <QuestionCard key={q.num} question={q} mode="quiz" />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="pt-20 text-center text-sm text-muted">…</div>}>
      <ReviewInner />
    </Suspense>
  );
}
