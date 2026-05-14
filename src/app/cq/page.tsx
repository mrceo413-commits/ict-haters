import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";
import { PenSquare, ChevronRight } from "lucide-react";

const chapters = [
  { num: "1", name: "Information & Communication Technology" },
  { num: "2", name: "Number Systems & Digital Devices" },
  { num: "3", name: "Creative Programming (C)" },
  { num: "4", name: "Web Design (HTML/CSS)" },
  { num: "5", name: "Database Management" },
  { num: "6", name: "Cyber Security & E-Commerce" },
];

export default function CqPage() {
  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <PenSquare className="text-primary" size={28} />
            CQ (A & B)
          </h1>
          <p className="mt-2 text-muted">
            Select a chapter to view Ka and Kha creative questions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((ch) => (
            <Link
              key={ch.num}
              href={`/cq/${ch.num}`}
              className="group relative rounded-2xl border border-border p-6 bg-white hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold text-lg">
                  {ch.num}
                </span>
                <ChevronRight
                  size={20}
                  className="text-muted group-hover:text-primary transition-colors"
                />
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                Chapter {ch.num}
              </h3>
              <p className="text-sm text-muted">{ch.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
