import { getTemplateById } from "@flowframe/core";
import { notFound } from "next/navigation";
import { RunTemplateForm } from "./RunTemplateForm";

export default async function RunTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const template = getTemplateById(id);

  if (!template) {
    notFound();
  }

  return (
    <main className="page">
      <RunTemplateForm templateId={id} />
    </main>
  );
}
