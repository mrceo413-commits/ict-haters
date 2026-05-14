"use client";

import { useState, useEffect } from "react";
import PageWrapper from "@/components/PageWrapper";
import { ClipboardList } from "lucide-react";
import { SkeletonList } from "@/components/Skeleton";

interface ModelTestItem {
  id: string;
  title: string;
  type: "chapter" | "full";
  chapter?: number;
  pdfUrl: string;
}

export default function ModelTestPage() {
  const [tab, setTab] = useState<"chapter" | "full">("chapter");
  const [tests, setTests] = useState<ModelTestItem[] | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/model-tests")
      .then((r) => r.json())
      .then((d) => setTests(d));
  }, []);

  const filtered = tests ? tests.filter((t) => t.type === tab) : [];

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <ClipboardList className="text-primary" size={28} />
            Model Tests
          </h1>
          <p className="mt-2 text-muted">
            Chapter-wise and full-syllabus model tests in PDF format.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => {
              setTab("chapter");
              setSelectedPdf(null);
            }}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === "chapter"
                ? "bg-primary text-white shadow-sm"
                : "bg-surface-alt text-muted hover:text-foreground"
            }`}
          >
            Chapter-wise
          </button>
          <button
            onClick={() => {
              setTab("full");
              setSelectedPdf(null);
            }}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === "full"
                ? "bg-primary text-white shadow-sm"
                : "bg-surface-alt text-muted hover:text-foreground"
            }`}
          >
            Full Syllabus
          </button>
        </div>

        {!tests ? (
          <SkeletonList count={4} />
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
              title="Model Test PDF"
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <p className="text-lg">No model tests in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((test) => (
              <button
                key={test.id}
                onClick={() => setSelectedPdf(test.pdfUrl)}
                className="text-left p-5 rounded-xl border border-border bg-white hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <h3 className="font-semibold text-foreground mb-1">
                  {test.title}
                </h3>
                {test.chapter !== undefined && (
                  <p className="text-sm text-muted">
                    Chapter {test.chapter}
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
