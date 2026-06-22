"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "saa-progress-v1";

export interface ProgressState {
  /** num -> selected choice label that was last submitted */
  answered: Record<number, string>;
  /** nums answered correctly */
  correct: number[];
  /** nums answered incorrectly (current state) */
  wrong: number[];
  /** bookmarked nums */
  bookmarks: number[];
}

const empty: ProgressState = {
  answered: {},
  correct: [],
  wrong: [],
  bookmarks: [],
};

function read(): ProgressState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

function write(state: ProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / private mode errors */
  }
}

// shared in-memory state so multiple components stay in sync
let listeners: Array<(s: ProgressState) => void> = [];
let current: ProgressState | null = null;

function setShared(next: ProgressState) {
  current = next;
  write(next);
  listeners.forEach((l) => l(next));
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>(() => current ?? empty);

  useEffect(() => {
    if (current === null) current = read();
    setState(current);
    const listener = (s: ProgressState) => setState(s);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const recordAnswer = useCallback(
    (num: number, selected: string, isCorrect: boolean) => {
      const s = current ?? read();
      const answered = { ...s.answered, [num]: selected };
      const correct = new Set(s.correct);
      const wrong = new Set(s.wrong);
      if (isCorrect) {
        correct.add(num);
        wrong.delete(num);
      } else {
        wrong.add(num);
        correct.delete(num);
      }
      setShared({
        ...s,
        answered,
        correct: [...correct],
        wrong: [...wrong],
      });
    },
    []
  );

  const toggleBookmark = useCallback((num: number) => {
    const s = current ?? read();
    const set = new Set(s.bookmarks);
    if (set.has(num)) set.delete(num);
    else set.add(num);
    setShared({ ...s, bookmarks: [...set] });
  }, []);

  const reset = useCallback(() => {
    setShared({ ...empty });
  }, []);

  return { ...state, recordAnswer, toggleBookmark, reset };
}
