"use client";

import { useState, useEffect } from "react";
import PageWrapper from "@/components/PageWrapper";
import { FileQuestion, BookOpen, Calendar } from "lucide-react";
import { SkeletonList } from "@/components/Skeleton";

interface QBItem {
  id: string;
  title: string;
  chapter?: number;
  year?: number;
  pdfUrl: string;
}

interface QBData {
  creative: QBItem[];
  board: QBItem[];
}

export default function QuestionBankPage() {
  const [tab, setTab] = useState<"creative" | "board">("creative");
  const [data, setData] = useState<QBData | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/questions")
      .then((r) => r.json())
      .then((d) => setData(d));
  }, []);

  const items = data ? data[tab] : [];

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <FileQuestion className="text-primary" size={28} />
            Question Bank
          </h1>
          <p className="mt-2 text-muted">
            Browse creative questions and board questions with PDF viewer.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => {
              setTab("creative");
              setSelectedPdf(null);
            }}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === "creative"
                ? "bg-primary text-white shadow-sm"
                : "bg-surface-alt text-muted hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <BookOpen size={16} /> Creative Questions (CQ)
            </span>
          </button>
          <button
            onClick={() => {
              setTab("board");
              setSelectedPdf(null);
            }}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === "board"
                ? "bg-primary text-white shadow-sm"
                : "bg-surface-alt text-muted hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <Calendar size={16} /> Board Questions (Year-wise)
            </span>
          </button>
        </div>

        {!data ? (
          <SkeletonList count={6} />
        ) : selectedPdf ? (
          <div>
            <button
              onClick={() => setSelectedPdf(null)}
              className="mb-4 text-sm text-muted hover:text-foreground transition-colors"
            >
              &larr; Back to list
            </button>
            <iframe
              src={selectedPdf}
              className="pdf-viewer"
              title="PDF Viewer"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedPdf(item.pdfUrl)}
                className="text-left p-5 rounded-xl border border-border bg-white hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <h3 className="font-semibold text-foreground mb-1">
                  {item.title}
                </h3>
                {item.year && (
                  <p className="text-sm text-muted">Year: {item.year}</p>
                )}
                {item.chapter !== undefined && (
                  <p className="text-sm text-muted">
                    Chapter: {item.chapter}
                  </p>
                )}
                <span className="mt-2 inline-block text-xs text-primary font-medium">
                  View PDF &rarr;
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
