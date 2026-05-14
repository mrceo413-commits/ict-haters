import CqChapterClient from "./CqChapterClient";

export default async function CqChapterPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter } = await params;
  return <CqChapterClient chapter={chapter} />;
}
