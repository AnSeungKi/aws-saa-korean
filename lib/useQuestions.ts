"use client";

import { useEffect, useState } from "react";
import type { Question } from "./types";

let cache: Question[] | null = null;
let inflight: Promise<Question[]> | null = null;

async function loadQuestions(): Promise<Question[]> {
  if (cache) return cache;
  if (!inflight) {
    inflight = fetch("/questions.json")
      .then((r) => {
        if (!r.ok) throw new Error("문제 데이터를 불러오지 못했습니다.");
        return r.json();
      })
      .then((data: Question[]) => {
        cache = data;
        return data;
      });
  }
  return inflight;
}

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>(cache ?? []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache) return;
    let active = true;
    loadQuestions()
      .then((data) => {
        if (active) {
          setQuestions(data);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (active) {
          setError(e.message);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return { questions, loading, error };
}
