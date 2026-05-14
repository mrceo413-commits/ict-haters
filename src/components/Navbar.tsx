"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  Home,
  Code,
  Terminal,
  FileQuestion,
  ClipboardList,
  PenSquare,
  Menu,
  X,
  Shield,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/textbook", label: "Textbook", icon: BookOpen },
  { href: "/quiz", label: "Chapter-wise Quiz", icon: ClipboardList },
  { href: "/html-editor", label: "HTML Editor", icon: Code },
  { href: "/c-compiler", label: "C Compiler", icon: Terminal },
  { href: "/question-bank", label: "Question Bank", icon: FileQuestion },
  { href: "/model-test", label: "Model Test", icon: ClipboardList },
  { href: "/cq", label: "CQ (A & B)", icon: PenSquare },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">ICT</span>
            </div>
            <span className="font-semibold text-lg text-primary hidden sm:inline">
              ICT Haters
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted hover:text-foreground hover:bg-surface-alt"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <Link
              href="/admin"
              className="ml-2 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-surface-alt transition-all duration-200"
            >
              <Shield size={16} />
              <span>Admin</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-alt transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="lg:hidden border-t border-border bg-white/95 backdrop-blur-lg">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-primary text-white"
                      : "text-muted hover:text-foreground hover:bg-surface-alt"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-surface-alt transition-all"
            >
              <Shield size={18} />
              <span>Admin Panel</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
