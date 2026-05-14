import Link from "next/link";
import { readStore } from "@/lib/data";
import PageWrapper from "@/components/PageWrapper";
import { ClipboardList, ChevronRight } from "lucide-react";

const chapterNames: Record<string, string> = {
  "1": "Information & Communication Technology",
  "2": "Number Systems & Digital Devices",
  "3": "Creative Programming (C)",
  "4": "Web Design (HTML/CSS)",
  "5": "Database Management",
  "6": "Cyber Security & E-Commerce",
};

export default function QuizPage() {
  const { quizzes } = readStore();

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <ClipboardList className="text-primary" size={28} />
            Chapter-wise Quiz
          </h1>
          <p className="mt-2 text-muted">
            Select a chapter to start your quiz. See scores and answers
            instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(quizzes).map(([chapter, chapterQuizzes]) => (
            <Link
              key={chapter}
              href={`/quiz/${chapter}`}
              className="group relative rounded-2xl border border-border p-6 bg-white hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold text-lg">
                  {chapter}
                </span>
                <ChevronRight
                  size={20}
                  className="text-muted group-hover:text-primary transition-colors"
                />
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                Chapter {chapter}
              </h3>
              <p className="text-sm text-muted mb-3">
                {chapterNames[chapter] || `Chapter ${chapter}`}
              </p>
              <span className="text-xs bg-surface-alt px-2.5 py-1 rounded-full text-muted">
                {chapterQuizzes.length} quiz
                {chapterQuizzes.length > 1 ? "zes" : ""}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
