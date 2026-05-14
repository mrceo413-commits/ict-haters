import { NextRequest } from "next/server";
import { readStore, writeStore } from "@/lib/data";
import { isValidToken } from "@/app/api/auth/route";
import fs from "fs";
import path from "path";

function getAuthToken(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

function sanitizeFileName(name: string): string {
  return path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(request: NextRequest) {
  const token = getAuthToken(request);
  if (!token || !isValidToken(token)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const action = formData.get("action") as string;
  const store = readStore();

  switch (action) {
    case "addBook": {
      const title = formData.get("title") as string;
      const author = formData.get("author") as string;
      const file = formData.get("file") as File;
      if (!title || !author || !file) {
        return Response.json({ error: "Missing fields" }, { status: 400 });
      }
      const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads", "books");
      fs.mkdirSync(uploadDir, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(path.join(uploadDir, fileName), buffer);
      store.books.push({
        id: Date.now().toString(),
        title,
        author,
        pdfUrl: `/uploads/books/${fileName}`,
      });
      writeStore(store);
      return Response.json({ success: true });
    }

    case "deleteBook": {
      const bookId = formData.get("id") as string;
      store.books = store.books.filter((b) => b.id !== bookId);
      writeStore(store);
      return Response.json({ success: true });
    }

    case "addQuiz": {
      const chapter = formData.get("chapter") as string;
      const quizTitle = formData.get("title") as string;
      const questionsJson = formData.get("questions") as string;
      if (!chapter || !quizTitle || !questionsJson) {
        return Response.json({ error: "Missing fields" }, { status: 400 });
      }
      let questions;
      try {
        questions = JSON.parse(questionsJson);
      } catch {
        return Response.json({ error: "Invalid JSON in questions" }, { status: 400 });
      }
      if (!store.quizzes[chapter]) store.quizzes[chapter] = [];
      store.quizzes[chapter].push({
        id: `q${chapter}-${Date.now()}`,
        title: quizTitle,
        questions,
      });
      writeStore(store);
      return Response.json({ success: true });
    }

    case "addQuestion": {
      const qbType = formData.get("type") as "creative" | "board";
      const qTitle = formData.get("title") as string;
      const qFile = formData.get("file") as File;
      const qChapter = formData.get("chapter") as string;
      const qYear = formData.get("year") as string;
      if (!qbType || !qTitle || !qFile) {
        return Response.json({ error: "Missing fields" }, { status: 400 });
      }
      const qFileName = `${Date.now()}-${sanitizeFileName(qFile.name)}`;
      const qUploadDir = path.join(process.cwd(), "public", "uploads", "questions");
      fs.mkdirSync(qUploadDir, { recursive: true });
      const qBuffer = Buffer.from(await qFile.arrayBuffer());
      fs.writeFileSync(path.join(qUploadDir, qFileName), qBuffer);
      const newItem: Record<string, unknown> = {
        id: Date.now().toString(),
        title: qTitle,
        pdfUrl: `/uploads/questions/${qFileName}`,
      };
      if (qChapter) newItem.chapter = parseInt(qChapter);
      if (qYear) newItem.year = parseInt(qYear);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (store.questionBank[qbType] as any[]).push(newItem);
      writeStore(store);
      return Response.json({ success: true });
    }

    case "addModelTest": {
      const mtType = formData.get("type") as "chapter" | "full";
      const mtTitle = formData.get("title") as string;
      const mtFile = formData.get("file") as File;
      const mtChapter = formData.get("chapter") as string;
      if (!mtType || !mtTitle || !mtFile) {
        return Response.json({ error: "Missing fields" }, { status: 400 });
      }
      const mtFileName = `${Date.now()}-${sanitizeFileName(mtFile.name)}`;
      const mtUploadDir = path.join(process.cwd(), "public", "uploads", "model-tests");
      fs.mkdirSync(mtUploadDir, { recursive: true });
      const mtBuffer = Buffer.from(await mtFile.arrayBuffer());
      fs.writeFileSync(path.join(mtUploadDir, mtFileName), mtBuffer);
      const mtItem: Record<string, unknown> = {
        id: Date.now().toString(),
        title: mtTitle,
        type: mtType,
        pdfUrl: `/uploads/model-tests/${mtFileName}`,
      };
      if (mtChapter) mtItem.chapter = parseInt(mtChapter);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (store.modelTests as any[]).push(mtItem);
      writeStore(store);
      return Response.json({ success: true });
    }

    case "updateCq": {
      const cqChapter = formData.get("chapter") as string;
      const cqType = formData.get("cqType") as "ka" | "kha";
      const cqTitle = formData.get("title") as string;
      const cqFile = formData.get("file") as File;
      if (!cqChapter || !cqType || !cqTitle) {
        return Response.json({ error: "Missing fields" }, { status: 400 });
      }
      if (!store.cqContent[cqChapter]) {
        store.cqContent[cqChapter] = {
          ka: { title: "", pdfUrl: "" },
          kha: { title: "", pdfUrl: "" },
        };
      }
      let pdfUrl = store.cqContent[cqChapter][cqType].pdfUrl;
      if (cqFile && cqFile.size > 0) {
        const cqFileName = `${Date.now()}-${sanitizeFileName(cqFile.name)}`;
        const cqUploadDir = path.join(process.cwd(), "public", "uploads", "cq");
        fs.mkdirSync(cqUploadDir, { recursive: true });
        const cqBuffer = Buffer.from(await cqFile.arrayBuffer());
        fs.writeFileSync(path.join(cqUploadDir, cqFileName), cqBuffer);
        pdfUrl = `/uploads/cq/${cqFileName}`;
      }
      store.cqContent[cqChapter][cqType] = { title: cqTitle, pdfUrl };
      writeStore(store);
      return Response.json({ success: true });
    }

    default:
      return Response.json({ error: "Unknown action" }, { status: 400 });
  }
}
