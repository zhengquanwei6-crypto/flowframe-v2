import { sampleTasks } from "@flowframe/core";
import { EmptyState, TaskRow } from "../_components/shared";

export default function TasksPage() {
  return (
    <main className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">任务中心</p>
          <h1>查看排队、生成中和已完成任务。</h1>
          <p className="lead">
            Web 端承载更完整的任务历史和筛选能力，Android 端保留轻量状态查看与完成通知。
          </p>
        </div>
      </div>

      <div className="grid">
        {sampleTasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </div>
      {sampleTasks.length === 0 ? (
        <EmptyState title="还没有任务" description="选择一个模板并提交任务后，状态会显示在这里。" />
      ) : null}
    </main>
  );
}
