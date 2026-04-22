import { listAssets, sampleTasks } from "@flowframe/core";
import Link from "next/link";

export default async function ResultsPage() {
  const assets = await listAssets();

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">结果库</p>
          <h1>集中查看和复用生成结果。</h1>
          <p className="lead">
            MVP 先提供结果查看。批量管理、团队共享和长期存储会作为 Pro / Team 能力后续接入。
          </p>
        </div>
      </div>

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
    </main>
  );
}
