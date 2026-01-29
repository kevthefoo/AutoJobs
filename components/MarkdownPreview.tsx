"use client";

import ReactMarkdown from "react-markdown";

interface Props {
  content: string;
}

export default function MarkdownPreview({ content }: Props) {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
