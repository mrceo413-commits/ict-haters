import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "store.json");

export interface Book {
  id: string;
  title: string;
  author: string;
  pdfUrl: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface QuestionBankItem {
  id: string;
  title: string;
  chapter?: number;
  year?: number;
  pdfUrl: string;
}

export interface ModelTest {
  id: string;
  title: string;
  type: "chapter" | "full";
  chapter?: number;
  pdfUrl: string;
}

export interface CqEntry {
  title: string;
  pdfUrl: string;
}

export interface StoreData {
  books: Book[];
  quizzes: Record<string, Quiz[]>;
  questionBank: {
    creative: QuestionBankItem[];
    board: QuestionBankItem[];
  };
  modelTests: ModelTest[];
  cqContent: Record<string, { ka: CqEntry; kha: CqEntry }>;
}

export function readStore(): StoreData {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

export function writeStore(data: StoreData): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}
