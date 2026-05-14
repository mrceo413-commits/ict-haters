"use client";

import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import { Code, Play, RotateCcw } from "lucide-react";

const DEFAULT_HTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: system-ui, sans-serif;
      padding: 2rem;
      background: #f8fafc;
    }
    h1 {
      color: #1e3a5f;
    }
    .card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      margin-top: 1rem;
    }
  </style>
</head>
<body>
  <h1>Hello, ICT Haters!</h1>
  <div class="card">
    <p>Start editing the HTML on the left to see your changes here in real-time.</p>
    <p>Try adding some <strong>bold text</strong> or an <em>italic</em> word.</p>
  </div>
</body>
</html>`;

export default function HtmlEditorPage() {
  const [code, setCode] = useState(DEFAULT_HTML);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Code className="text-primary" size={28} />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                HTML Editor
              </h1>
              <p className="text-sm text-muted">
                Write HTML and see real-time output
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCode(DEFAULT_HTML)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted hover:text-foreground hover:bg-surface-alt transition-all"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-220px)]">
          {/* Editor */}
          <div className="flex flex-col rounded-xl border border-border overflow-hidden bg-white">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-alt border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs font-medium text-muted ml-2">
                index.html
              </span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none bg-white text-foreground"
              spellCheck={false}
              placeholder="Write your HTML here..."
            />
          </div>

          {/* Preview */}
          <div className="flex flex-col rounded-xl border border-border overflow-hidden bg-white">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-alt border-b border-border">
              <Play size={14} className="text-green-600" />
              <span className="text-xs font-medium text-muted">
                Live Preview
              </span>
            </div>
            <iframe
              srcDoc={code}
              title="HTML Preview"
              className="flex-1 w-full bg-white"
              sandbox="allow-scripts"
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
