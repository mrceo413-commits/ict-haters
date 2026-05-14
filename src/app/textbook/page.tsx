import { readStore } from "@/lib/data";
import PageWrapper from "@/components/PageWrapper";
import { BookOpen, Download, User } from "lucide-react";

export default function TextbookPage() {
  const { books } = readStore();

  const grouped = books.reduce<Record<string, typeof books>>((acc, book) => {
    if (!acc[book.author]) acc[book.author] = [];
    acc[book.author].push(book);
    return acc;
  }, {});

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BookOpen className="text-primary" size={28} />
            Textbook Library
          </h1>
          <p className="mt-2 text-muted">
            Browse textbooks sorted by author. Click to download.
          </p>
        </div>

        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-20 text-muted">
            <BookOpen size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg">No textbooks available yet.</p>
            <p className="text-sm">Check back soon or ask your admin to upload books.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([author, authorBooks]) => (
              <div key={author}>
                <div className="flex items-center gap-2 mb-4">
                  <User size={18} className="text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">
                    {author}
                  </h2>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {authorBooks.length} book{authorBooks.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {authorBooks.map((book) => (
                    <a
                      key={book.id}
                      href={book.pdfUrl}
                      download
                      className="group flex items-center gap-4 p-5 rounded-xl border border-border bg-white hover:border-primary/30 hover:shadow-md transition-all duration-200"
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <BookOpen size={20} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">
                          {book.title}
                        </h3>
                        <p className="text-sm text-muted">{book.author}</p>
                      </div>
                      <Download
                        size={18}
                        className="text-muted group-hover:text-primary transition-colors shrink-0"
                      />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
