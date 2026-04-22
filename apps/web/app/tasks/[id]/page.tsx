import Link from "next/link";
import { getTaskById, getTemplateById } from "@flowframe/core";
import { notFound } from "next/navigation";
import { StatusBadge } from "../../_components/shared";

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = getTaskById(id);

  if (!task) {
    notFound();
  }

  const template = getTemplateById(task.templateId);

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">任务详情</p>
          <h1>{task.title}</h1>
          <p className="lead">{template?.shortDescription}</p>
        </div>
        <StatusBadge status={task.status} />
      </div>

      <section className="two-grid grid">
        <div className="panel">
          <h2>状态</h2>
          <div className="progress" aria-label={`进度 ${task.progress}%`}>
            <span style={{ width: `${task.progress}%` }} />
          </div>
          <div className="badge-row" aria-label="任务状态更新">
            <span className="badge">已提交</span>
            <span className="badge">队列已接收</span>
            <span className="badge">{task.status === "completed" ? "结果已生成" : "生成中"}</span>
          </div>
          <div className="settings-list">
            <div>
              <span>执行模式</span>
              <strong>{task.mode === "normal" ? "普通" : "高级"}</strong>
            </div>
            <div>
              <span>Provider</span>
              <strong>{task.providerId}</strong>
            </div>
            <div>
              <span>消耗</span>
              <strong>{task.creditCost} 点</strong>
            </div>
          </div>
        </div>
        <div className="panel">
          <h2>输入摘要</h2>
          <div className="settings-list">
            {Object.entries(task.inputsSummary).map(([key, value]) => (
              <div key={key}>
                <span>{key}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">结果</p>
            <h2>{task.assets.length > 0 ? "生成结果" : "结果生成中"}</h2>
          </div>
          {template ? (
            <div className="row-actions">
              <Link className="secondary-button" href={`/templates/${template.id}/run`}>
                再次运行
              </Link>
              <Link className="primary-button" href={`/results?task=${task.id}`}>
                查看结果页
              </Link>
            </div>
          ) : null}
        </div>
        <div className="grid three-grid">
          {task.assets.map((asset) => (
            <div className="result-card" key={asset.id}>
              <img src={asset.url} alt="任务结果" />
              <div className="result-card-body">
                <h3>{asset.width} x {asset.height}</h3>
                <p className="muted">可下载、保存或用于再次运行。</p>
              </div>
            </div>
          ))}
        </div>
        {task.assets.length === 0 ? (
          <div className="panel">
            <h3>结果还在生成</h3>
            <p className="muted">任务完成后会在这里显示结果，也会进入结果库。</p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
