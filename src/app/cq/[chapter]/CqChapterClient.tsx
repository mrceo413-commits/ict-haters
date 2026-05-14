"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";
import { ArrowLeft } from "lucide-react";

interface CqEntry {
  title: string;
  pdfUrl: string;
}

interface CqData {
  ka: CqEntry;
  kha: CqEntry;
}

export default function CqChapterClient({ chapter }: { chapter: string }) {
  const [data, setData] = useState<CqData | null>(null);
  const [selected, setSelected] = useState<"ka" | "kha" | null>(null);

  useEffect(() => {
    fetch(`/api/cq?chapter=${chapter}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((d) => setData(d))
      .catch(() => setData(null));
  }, [chapter]);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/cq"
          className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Chapters
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-2">
          Chapter {chapter} — CQ (A & B)
        </h1>
        <p className="text-muted mb-8">
          Select Ka or Kha to view the PDF.
        </p>

        {!data ? (
          <div className="flex gap-4">
            <div className="skeleton h-32 w-48 rounded-xl" />
            <div className="skeleton h-32 w-48 rounded-xl" />
          </div>
        ) : (
          <>
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setSelected("ka")}
                className={`px-8 py-6 rounded-xl border text-center font-semibold text-lg transition-all duration-200 min-w-[140px] ${
                  selected === "ka"
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                    : "border-border bg-white hover:border-primary/30 hover:shadow-md text-foreground"
                }`}
              >
                Ka (ক)
                <p className="text-xs font-normal mt-1 opacity-75">
                  {data.ka.title}
                </p>
              </button>
              <button
                onClick={() => setSelected("kha")}
                className={`px-8 py-6 rounded-xl border text-center font-semibold text-lg transition-all duration-200 min-w-[140px] ${
                  selected === "kha"
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                    : "border-border bg-white hover:border-primary/30 hover:shadow-md text-foreground"
                }`}
              >
                Kha (খ)
                <p className="text-xs font-normal mt-1 opacity-75">
                  {data.kha.title}
                </p>
              </button>
            </div>

            {selected && (
              <iframe
                src={data[selected].pdfUrl}
                className="pdf-viewer"
                title={`CQ ${selected === "ka" ? "Ka" : "Kha"} PDF`}
              />
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}
