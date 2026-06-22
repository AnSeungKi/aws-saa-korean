import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "AWS SAA-C03 문제집 (한국어)",
  description: "AWS Certified Solutions Architect Associate SAA-C03 한국어 문제 풀이",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="font-sans min-h-screen bg-app text-default">
        <Providers>
          <Header />
          <main className="mx-auto max-w-4xl px-4 sm:px-6 pb-20">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
