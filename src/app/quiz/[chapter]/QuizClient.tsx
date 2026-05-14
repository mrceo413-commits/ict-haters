"use client";

import { useState } from "react";
import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
} from "lucide-react";
import type { Quiz } from "@/lib/data";

interface Props {
  chapter: string;
  quizzes: Quiz[];
}

export default function QuizClient({ chapter, quizzes }: Props) {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qIndex: number, optIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmit = () => {
    if (!activeQuiz) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const score = activeQuiz
    ? activeQuiz.questions.reduce(
        (acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0),
        0
      )
    : 0;

  if (!activeQuiz) {
    return (
      <PageWrapper>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft size={18} /> Back to Chapters
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Chapter {chapter} — Quizzes
          </h1>
          <p className="text-muted mb-8">
            Select a quiz to begin.
          </p>

          {quizzes.length === 0 ? (
            <div className="text-center py-20 text-muted">
              <p className="text-lg">No quizzes for this chapter yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((quiz) => (
                <button
                  key={quiz.id}
                  onClick={() => {
                    setActiveQuiz(quiz);
                    handleReset();
                  }}
                  className="text-left p-6 rounded-xl border border-border bg-white hover:border-primary/30 hover:shadow-md transition-all duration-200"
                >
                  <h3 className="font-semibold text-foreground mb-1">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-muted">
                    {quiz.questions.length} questions
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => {
            setActiveQuiz(null);
            handleReset();
          }}
          className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Quizzes
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Chapter {chapter} — {activeQuiz.title}
            </h1>
            <p className="text-muted text-sm mt-1">
              {activeQuiz.questions.length} questions
            </p>
          </div>
          {submitted && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {score}/{activeQuiz.questions.length}
                </div>
                <div className="text-xs text-muted">Score</div>
              </div>
              <Trophy
                size={28}
                className={
                  score === activeQuiz.questions.length
                    ? "text-yellow-500"
                    : "text-muted"
                }
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          {activeQuiz.questions.map((q, qIdx) => {
            const userAnswer = answers[qIdx];
            const isCorrect = userAnswer === q.answer;
            return (
              <div
                key={qIdx}
                className={`p-6 rounded-xl border transition-all duration-200 ${
                  submitted
                    ? isCorrect
                      ? "border-green-200 bg-green-50/50"
                      : userAnswer !== undefined
                        ? "border-red-200 bg-red-50/50"
                        : "border-border bg-white"
                    : "border-border bg-white"
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0">
                    {qIdx + 1}
                  </span>
                  <p className="font-medium text-foreground">{q.question}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-10">
                  {q.options.map((opt, oIdx) => {
                    const selected = userAnswer === oIdx;
                    const isAnswer = q.answer === oIdx;
                    let optClass =
                      "px-4 py-3 rounded-lg border text-sm text-left transition-all duration-150 cursor-pointer ";
                    if (submitted) {
                      if (isAnswer) {
                        optClass +=
                          "border-green-300 bg-green-50 text-green-800 font-medium";
                      } else if (selected && !isCorrect) {
                        optClass +=
                          "border-red-300 bg-red-50 text-red-800 line-through";
                      } else {
                        optClass += "border-border text-muted";
                      }
                    } else {
                      optClass += selected
                        ? "border-primary bg-primary/5 text-primary font-medium"
                        : "border-border hover:border-primary/30 hover:bg-surface-alt";
                    }
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelect(qIdx, oIdx)}
                        disabled={submitted}
                        className={optClass}
                      >
                        <span className="flex items-center gap-2">
                          {submitted && isAnswer && (
                            <CheckCircle2
                              size={16}
                              className="text-green-600 shrink-0"
                            />
                          )}
                          {submitted && selected && !isCorrect && (
                            <XCircle
                              size={16}
                              className="text-red-500 shrink-0"
                            />
                          )}
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex items-center gap-4">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={
                Object.keys(answers).length < activeQuiz.questions.length
              }
              className="px-8 py-3 rounded-full bg-primary text-white font-medium shadow-lg shadow-primary/25 hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit Answers
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-border text-foreground font-medium hover:bg-surface-alt transition-all"
            >
              <RotateCcw size={16} /> Try Again
            </button>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
