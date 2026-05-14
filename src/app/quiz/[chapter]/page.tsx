import { readStore } from "@/lib/data";
import QuizClient from "./QuizClient";

export default async function ChapterQuizPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter } = await params;
  const { quizzes } = readStore();
  const chapterQuizzes = quizzes[chapter] || [];

  return <QuizClient chapter={chapter} quizzes={chapterQuizzes} />;
}
