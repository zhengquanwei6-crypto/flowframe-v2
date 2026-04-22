import { getTask, listAssets, sampleTasks } from "@flowframe/core";
import Link from "next/link";
import { LiveTaskPanel } from "../_components/LiveTaskPanel";

export default async function ResultsPage({
  searchParams
}: {
  searchParams?: Promise<{ task?: string }>;
}) {
  const params = await searchParams;
  const taskId = params?.task;
  const task = taskId ? await getTask(taskId) : undefined;
  const assets = taskId ? task?.assets ?? [] : await listAssets();

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">结果库</p>
          <h1>{task ? task.title : "集中查看和复用生成结果。"}</h1>
          <p className="lead">
            {task
              ? "这是当前任务的生成结果，可以继续下载、复用或再次运行模板。"
              : "MVP 先提供结果查看。批量管理、团队共享和长期存储会作为 Pro / Team 能力后续接入。"}
          </p>
        </div>
      </div>

      {task ? (
        <LiveTaskPanel initialTask={task} resultOnly />
      ) : (
        <div className="grid three-grid">
          {assets.map((asset) => {
            const task = sampleTasks.find((item) => item.id === asset.taskId);
            return (
              <Link className="result-card" href={`/tasks/${asset.taskId}`} key={asset.id}>
                <img src={asset.url} alt={task?.title ?? "生成结果"} />
                <div className="result-card-body">
                  <h3>{task?.title ?? "生成结果"}</h3>
                  <p className="muted">
                    {asset.width} x {asset.height} · {new Date(asset.createdAt).toLocaleDateString("zh-CN")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      {!task && assets.length === 0 ? (
        <div className="panel">
          <h3>还没有结果</h3>
          <p className="muted">提交并完成一个模板任务后，结果会显示在这里。</p>
          <Link className="primary-button" href="/templates">
            去选择模板
          </Link>
        </div>
      ) : null}
    </main>
  );
}
