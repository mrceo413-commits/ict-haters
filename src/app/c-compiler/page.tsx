"use client";

import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import { Terminal, Play, Loader2, RotateCcw } from "lucide-react";

const DEFAULT_C = `#include <stdio.h>

int main() {
    printf("Hello, ICT Haters!\\n");
    
    int a = 10, b = 20;
    printf("Sum of %d and %d = %d\\n", a, b, a + b);
    
    return 0;
}`;

export default function CCompilerPage() {
  const [code, setCode] = useState(DEFAULT_C);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRun = async () => {
    setLoading(true);
    setOutput("");
    setError("");

    try {
      const res = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: "c",
          version: "10.2.0",
          files: [{ name: "main.c", content: code }],
          stdin: stdin,
        }),
      });

      if (!res.ok) throw new Error("Compilation service unavailable");

      const data = await res.json();
      const compileResult = data.compile;
      const runResult = data.run;

      if (compileResult?.stderr) {
        setError(compileResult.stderr);
      } else if (runResult?.stderr) {
        setError(runResult.stderr);
      }
      if (runResult?.stdout) {
        setOutput(runResult.stdout);
      }
      if (!runResult?.stdout && !runResult?.stderr && !compileResult?.stderr) {
        setOutput("(No output)");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to compile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Terminal className="text-primary" size={28} />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                C Compiler
              </h1>
              <p className="text-sm text-muted">
                Write C code, compile, and run — powered by Piston API
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCode(DEFAULT_C);
                setOutput("");
                setError("");
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted hover:text-foreground hover:bg-surface-alt transition-all"
            >
              <RotateCcw size={14} /> Reset
            </button>
            <button
              onClick={handleRun}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Play size={14} />
              )}
              {loading ? "Running..." : "Run Code"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Editor */}
          <div className="flex flex-col rounded-xl border border-border overflow-hidden bg-white h-[calc(100vh-220px)]">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-alt border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs font-medium text-muted ml-2">
                main.c
              </span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none bg-[#1e293b] text-green-400"
              spellCheck={false}
              placeholder="Write your C code here..."
            />
          </div>

          {/* Output */}
          <div className="flex flex-col gap-4 h-[calc(100vh-220px)]">
            {/* Stdin */}
            <div className="rounded-xl border border-border overflow-hidden bg-white">
              <div className="px-4 py-2.5 bg-surface-alt border-b border-border">
                <span className="text-xs font-medium text-muted">
                  Standard Input (stdin)
                </span>
              </div>
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                className="w-full p-4 font-mono text-sm resize-none focus:outline-none h-24"
                placeholder="Enter input for your program..."
              />
            </div>

            {/* Output */}
            <div className="flex-1 rounded-xl border border-border overflow-hidden bg-white">
              <div className="px-4 py-2.5 bg-surface-alt border-b border-border flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    error
                      ? "bg-red-500"
                      : output
                        ? "bg-green-500"
                        : "bg-muted"
                  }`}
                />
                <span className="text-xs font-medium text-muted">Output</span>
              </div>
              <div className="p-4 font-mono text-sm overflow-auto h-full bg-[#0f172a] text-green-400">
                {loading && (
                  <div className="flex items-center gap-2 text-muted">
                    <Loader2 size={14} className="animate-spin" />
                    Compiling and running...
                  </div>
                )}
                {error && (
                  <pre className="text-red-400 whitespace-pre-wrap">
                    {error}
                  </pre>
                )}
                {output && (
                  <pre className="whitespace-pre-wrap">{output}</pre>
                )}
                {!loading && !error && !output && (
                  <span className="text-muted/50">
                    Click &quot;Run Code&quot; to see output here...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
