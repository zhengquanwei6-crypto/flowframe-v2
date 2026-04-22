import Link from "next/link";
import type { Task, TaskStatus, Template } from "@flowframe/core";

export function StatusBadge({ status }: { status: TaskStatus }) {
  const labelMap: Record<TaskStatus, string> = {
    draft: "草稿",
    queued: "排队中",
    running: "生成中",
    completed: "已完成",
    failed: "失败",
    canceled: "已取消"
  };

  return <span className={`status ${status}`}>{labelMap[status]}</span>;
}

export function TemplateCard({ template }: { template: Template }) {
  return (
    <Link className="template-card" href={`/templates/${template.id}`}>
      <img src={template.coverImage} alt={`${template.name} 示例`} />
      <div className="template-card-body">
        <div className="meta-row">
          <span>{template.estimatedSeconds}s</span>
          <span>{template.creditCost} 点</span>
        </div>
        <h3>{template.name}</h3>
        <p className="muted">{template.shortDescription}</p>
        <div className="badge-row">
          {template.badges.map((badge) => (
            <span className="badge" key={badge}>
              {badge}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export function TaskRow({ task }: { task: Task }) {
  return (
    <Link className="task-row" href={`/tasks/${task.id}`}>
      <div>
        <h3>{task.title}</h3>
        <p className="muted">
          {task.creditCost} 点 · {new Date(task.createdAt).toLocaleString("zh-CN")}
        </p>
      </div>
      <StatusBadge status={task.status} />
      <div>
        <div className="progress" aria-label={`进度 ${task.progress}%`}>
          <span style={{ width: `${task.progress}%` }} />
        </div>
      </div>
      <span className="secondary-button">查看</span>
    </Link>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="panel">
      <h3>{title}</h3>
      <p className="muted">{description}</p>
    </div>
  );
}
