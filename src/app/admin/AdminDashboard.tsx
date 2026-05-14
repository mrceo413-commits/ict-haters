"use client";

import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import {
  BookOpen,
  ClipboardList,
  FileQuestion,
  PenSquare,
  LogOut,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Props {
  token: string;
  onLogout: () => void;
}

type Tab = "books" | "quizzes" | "questions" | "model-tests" | "cq";

export default function AdminDashboard({ token, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("books");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
    { id: "books", label: "Books", icon: BookOpen },
    { id: "quizzes", label: "Quizzes", icon: ClipboardList },
    { id: "questions", label: "Question Bank", icon: FileQuestion },
    { id: "model-tests", label: "Model Tests", icon: ClipboardList },
    { id: "cq", label: "CQ (A & B)", icon: PenSquare },
  ];

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const submitForm = async (formData: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed");
      showMessage("success", "Content updated successfully!");
    } catch {
      showMessage("error", "Failed to update content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted">
              Manage all platform content
            </p>
          </div>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted hover:text-red-600 hover:border-red-200 transition-all"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-2 text-sm ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface-alt text-muted hover:text-foreground"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Panels */}
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
          {activeTab === "books" && (
            <BookForm loading={loading} onSubmit={submitForm} />
          )}
          {activeTab === "quizzes" && (
            <QuizForm loading={loading} onSubmit={submitForm} />
          )}
          {activeTab === "questions" && (
            <QuestionForm loading={loading} onSubmit={submitForm} />
          )}
          {activeTab === "model-tests" && (
            <ModelTestForm loading={loading} onSubmit={submitForm} />
          )}
          {activeTab === "cq" && (
            <CqForm loading={loading} onSubmit={submitForm} />
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

function BookForm({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (fd: FormData) => void;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("action", "addBook");
    onSubmit(fd);
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Plus size={18} /> Upload New Book
      </h2>
      <div>
        <label className="block text-sm font-medium mb-1">Book Title</label>
        <input
          name="title"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="e.g., ICT Textbook - HSC"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Author Name</label>
        <input
          name="author"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="e.g., Pronob Ghosh"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">PDF File</label>
        <input
          name="file"
          type="file"
          accept=".pdf"
          required
          className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium file:cursor-pointer"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50"
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        Upload Book
      </button>
    </form>
  );
}

function QuizForm({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (fd: FormData) => void;
}) {
  const [questionsText, setQuestionsText] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("action", "addQuiz");
    fd.set("questions", questionsText);
    onSubmit(fd);
    e.currentTarget.reset();
    setQuestionsText("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Plus size={18} /> Add Quiz
      </h2>
      <div>
        <label className="block text-sm font-medium mb-1">Chapter</label>
        <select
          name="chapter"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {[1, 2, 3, 4, 5, 6].map((ch) => (
            <option key={ch} value={ch}>
              Chapter {ch}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Quiz Title</label>
        <input
          name="title"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="e.g., Quiz 3"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Questions (JSON)
        </label>
        <textarea
          value={questionsText}
          onChange={(e) => setQuestionsText(e.target.value)}
          rows={8}
          required
          className="w-full px-4 py-2.5 rounded-lg border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder={`[{"question":"...","options":["A","B","C","D"],"answer":0}]`}
        />
        <p className="text-xs text-muted mt-1">
          Each question: question, options (array of 4), answer (0-3 index)
        </p>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50"
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        Add Quiz
      </button>
    </form>
  );
}

function QuestionForm({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (fd: FormData) => void;
}) {
  const [qbType, setQbType] = useState<"creative" | "board">("creative");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("action", "addQuestion");
    fd.set("type", qbType);
    onSubmit(fd);
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Plus size={18} /> Add Question
      </h2>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setQbType("creative")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            qbType === "creative"
              ? "bg-primary text-white"
              : "bg-surface-alt text-muted"
          }`}
        >
          Creative
        </button>
        <button
          type="button"
          onClick={() => setQbType("board")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            qbType === "board"
              ? "bg-primary text-white"
              : "bg-surface-alt text-muted"
          }`}
        >
          Board
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          name="title"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
      {qbType === "creative" && (
        <div>
          <label className="block text-sm font-medium mb-1">Chapter</label>
          <input
            name="chapter"
            type="number"
            min="1"
            max="6"
            className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      )}
      {qbType === "board" && (
        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <input
            name="year"
            type="number"
            className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="e.g., 2024"
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1">PDF File</label>
        <input
          name="file"
          type="file"
          accept=".pdf"
          required
          className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium file:cursor-pointer"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50"
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        Add Question
      </button>
    </form>
  );
}

function ModelTestForm({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (fd: FormData) => void;
}) {
  const [mtType, setMtType] = useState<"chapter" | "full">("chapter");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("action", "addModelTest");
    fd.set("type", mtType);
    onSubmit(fd);
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Plus size={18} /> Add Model Test
      </h2>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMtType("chapter")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mtType === "chapter"
              ? "bg-primary text-white"
              : "bg-surface-alt text-muted"
          }`}
        >
          Chapter-wise
        </button>
        <button
          type="button"
          onClick={() => setMtType("full")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mtType === "full"
              ? "bg-primary text-white"
              : "bg-surface-alt text-muted"
          }`}
        >
          Full Syllabus
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          name="title"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
      {mtType === "chapter" && (
        <div>
          <label className="block text-sm font-medium mb-1">Chapter</label>
          <input
            name="chapter"
            type="number"
            min="1"
            max="6"
            className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1">PDF File</label>
        <input
          name="file"
          type="file"
          accept=".pdf"
          required
          className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium file:cursor-pointer"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50"
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        Add Model Test
      </button>
    </form>
  );
}

function CqForm({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (fd: FormData) => void;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("action", "updateCq");
    onSubmit(fd);
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Plus size={18} /> Update CQ Content
      </h2>
      <div>
        <label className="block text-sm font-medium mb-1">Chapter</label>
        <select
          name="chapter"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {[1, 2, 3, 4, 5, 6].map((ch) => (
            <option key={ch} value={ch}>
              Chapter {ch}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <select
          name="cqType"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="ka">Ka (ক)</option>
          <option value="kha">Kha (খ)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          name="title"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="e.g., Chapter 1 - Ka"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          PDF File (optional — replaces existing)
        </label>
        <input
          name="file"
          type="file"
          accept=".pdf"
          className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium file:cursor-pointer"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50"
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        Update CQ
      </button>
    </form>
  );
}
