"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const nav = [
  { href: "/", label: "홈" },
  { href: "/quiz", label: "퀴즈" },
  { href: "/browse", label: "문제 탐색" },
  { href: "/review", label: "복습" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-token bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="rounded-md border border-accent/30 bg-accent-soft px-2.5 py-1 font-mono text-xs font-semibold text-accent"
        >
          SAA-C03
        </Link>
        <span className="hidden text-sm font-bold sm:block">AWS 솔루션스 아키텍트 문제집</span>

        <nav className="ml-auto flex items-center gap-1">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-accent-soft text-accent"
                    : "text-muted hover:text-default"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="ml-1">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
