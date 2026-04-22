import { templateCategories, templates } from "@flowframe/core";
import { TemplateCard } from "../_components/shared";

export default function TemplatesPage() {
  return (
    <main className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">模板中心</p>
          <h1>从任务开始，而不是从 workflow 开始。</h1>
          <p className="lead">
            每个模板都把复杂执行流程包装成少量表单项，普通用户可以直接提交，进阶用户再进入高级模式。
          </p>
        </div>
      </div>

      <div className="badge-row">
        {templateCategories.map((category) => (
          <span className="badge" key={category.id}>
            {category.label}
          </span>
        ))}
      </div>

      <section className="section">
        <div className="grid template-grid">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </section>
    </main>
  );
}
