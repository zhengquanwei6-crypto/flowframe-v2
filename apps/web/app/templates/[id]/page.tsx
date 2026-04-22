import Link from "next/link";
import { getTemplateById } from "@flowframe/core";
import { notFound } from "next/navigation";

export default async function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const template = getTemplateById(id);

  if (!template) {
    notFound();
  }

  return (
    <main className="page">
      <section className="detail-hero">
        <div>
          <p className="eyebrow">模板详情</p>
          <h1>{template.name}</h1>
          <p className="lead">{template.longDescription}</p>
          <div className="meta-row">
            <span>预计 {template.estimatedSeconds} 秒</span>
            <span>消耗 {template.creditCost} 点</span>
            <span>{template.difficulty === "starter" ? "新手友好" : "进阶模板"}</span>
          </div>
          <div className="row-actions">
            <Link className="primary-button" href={`/templates/${template.id}/run`}>
              <span aria-hidden="true">+</span>
              使用模板
            </Link>
            <Link className="secondary-button" href="/advanced">
              高级模式
            </Link>
          </div>
        </div>
        <img src={template.coverImage} alt={`${template.name} 封面`} />
      </section>

      <section className="section two-grid grid">
        <div className="panel">
          <p className="eyebrow">普通模式表单</p>
          <h2>默认只展示必要输入</h2>
          <div className="settings-list">
            {template.inputFields.map((field) => (
              <div key={field.id}>
                <span>{field.label}</span>
                <strong>{field.required ? "必填" : "可选"}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <p className="eyebrow">高级能力</p>
          <h2>二级入口，不干扰默认体验</h2>
          <div className="settings-list">
            {template.advancedFields.map((field) => (
              <div key={field.id}>
                <span>{field.label}</span>
                <strong>高级</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
