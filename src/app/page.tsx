import Link from "next/link";
import {
  BookOpen,
  Code,
  Terminal,
  FileQuestion,
  ClipboardList,
  PenSquare,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

const features = [
  {
    href: "/textbook",
    icon: BookOpen,
    title: "Textbook Library",
    desc: "Browse and download textbooks sorted by author.",
  },
  {
    href: "/quiz",
    icon: ClipboardList,
    title: "Chapter-wise Quiz",
    desc: "Test your knowledge with interactive quizzes.",
  },
  {
    href: "/html-editor",
    icon: Code,
    title: "HTML Editor",
    desc: "Write HTML and see real-time output instantly.",
  },
  {
    href: "/c-compiler",
    icon: Terminal,
    title: "C Compiler",
    desc: "Write, compile, and run C programs online.",
  },
  {
    href: "/question-bank",
    icon: FileQuestion,
    title: "Question Bank",
    desc: "Creative and board questions with PDF viewer.",
  },
  {
    href: "/model-test",
    icon: ClipboardList,
    title: "Model Test",
    desc: "Chapter-wise and full-syllabus model tests.",
  },
  {
    href: "/cq",
    icon: PenSquare,
    title: "CQ (A & B)",
    desc: "Chapter-based creative questions — Ka & Kha.",
  },
];

export default function HomePage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles size={14} />
              Premium ICT Learning Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Master ICT with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                ICT Haters
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
              Your all-in-one educational companion for HSC ICT. Textbooks,
              quizzes, code editors, question banks, and more — all in one
              beautiful platform.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-white font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                Start Learning
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/textbook"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-border text-foreground font-medium hover:bg-surface-alt transition-all duration-200"
              >
                Browse Textbooks
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-foreground">
            Everything You Need
          </h2>
          <p className="mt-3 text-muted text-lg">
            Comprehensive tools designed for ICT students.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.href}
                href={f.href}
                className="group relative rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 bg-white"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon size={22} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "6", label: "Chapters" },
              { value: "50+", label: "Quiz Questions" },
              { value: "2", label: "Code Editors" },
              { value: "100%", label: "Free Access" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl sm:text-4xl font-bold">
                  {stat.value}
                </div>
                <div className="mt-1 text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
