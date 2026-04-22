import { providers, templates } from "@flowframe/core";

export default function AdvancedPage() {
  return (
    <main className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">高级模式</p>
          <h1>高级能力是二级入口，不是默认首页。</h1>
          <p className="lead">
            这里展示 provider、模板绑定和高级参数预留。普通用户默认不会接触 workflow JSON、节点图或模型路径。
          </p>
        </div>
      </div>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Provider</p>
            <h2>多执行后端预留</h2>
          </div>
        </div>
        <div className="grid three-grid">
          {providers.map((provider) => (
            <div className="provider-card" key={provider.id}>
              <div className={`status ${provider.status === "ready" ? "completed" : "queued"}`}>
                {provider.status === "ready"
                  ? "可用"
                  : provider.status === "needs_setup"
                    ? "待配置"
                    : "预留"}
              </div>
              <h3>{provider.name}</h3>
              <p className="muted">{provider.description}</p>
              <div className="badge-row">
                {provider.supports.slice(0, 4).map((item) => (
                  <span className="badge" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">模板绑定</p>
            <h2>表单字段映射到底层执行变量</h2>
          </div>
        </div>
        <div className="grid two-grid">
          {templates.slice(0, 4).map((template) => (
            <div className="panel" key={template.id}>
              <h3>{template.name}</h3>
              <p className="muted">
                能力：{template.binding.providerCapability} · 版本：{template.binding.version}
              </p>
              <div className="settings-list">
                {template.advancedFields.map((field) => (
                  <div key={field.id}>
                    <span>{field.label}</span>
                    <strong>{field.mappingKey}</strong>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
