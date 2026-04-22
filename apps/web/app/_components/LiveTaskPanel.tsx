"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Task, TaskStatus } from "@flowframe/core";
import { StatusBadge } from "./shared";

const liveStatuses = new Set<TaskStatus>(["queued", "running"]);

export function LiveTaskPanel({
  initialTask,
  resultOnly = false
}: {
  initialTask: Task;
  resultOnly?: boolean;
}) {
  const [task, setTask] = useState(initialTask);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!liveStatuses.has(task.status)) {
      return;
    }

    const timer = window.setInterval(async () => {
      try {
        const response = await fetch(`/api/tasks/${task.id}`, { cache: "no-store" });
        const data = (await response.json()) as { task?: Task; error?: string };

        if (!response.ok || !data.task) {
          throw new Error(data.error ?? "状态查询失败");
        }

        setTask(data.task);
        setError(null);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "状态查询失败");
      }
    }, 2500);

    return () => window.clearInterval(timer);
  }, [task.id, task.status]);

  return (
    <div className="grid">
      {!resultOnly ? (
        <div className="panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">实时状态</p>
              <h2>
                {task.status === "completed"
                  ? "任务成功"
                  : task.status === "failed"
                    ? "任务失败"
                    : "任务运行中"}
              </h2>
            </div>
            <StatusBadge status={task.status} />
          </div>
          <div className="progress" aria-label={`进度 ${task.progress}%`}>
            <span style={{ width: `${task.progress}%` }} />
          </div>
          <div className="badge-row">
            <span className="badge">已提交</span>
            <span className="badge">{task.providerId}</span>
            <span className="badge">
              {task.status === "completed" ? "结果已返回" : "自动刷新中"}
            </span>
          </div>
          {task.errorMessage ? <p className="status failed">{task.errorMessage}</p> : null}
          {error ? <p className="status failed">{error}</p> : null}
        </div>
      ) : null}

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">真实结果</p>
            <h2>{task.assets.length > 0 ? "ComfyUI 返回的图片" : "等待 ComfyUI 返回结果"}</h2>
          </div>
          <div className="row-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={async () => {
                const response = await fetch(`/api/tasks/${task.id}`, { cache: "no-store" });
                const data = (await response.json()) as { task?: Task };
                if (data.task) {
                  setTask(data.task);
                }
              }}
            >
              刷新
            </button>
            <Link className="secondary-button" href={`/templates/${task.templateId}/run`}>
              再次运行
            </Link>
            <Link className="primary-button" href={`/results?task=${task.id}`}>
              结果页
            </Link>
          </div>
        </div>

        <div className="grid three-grid">
          {task.assets.map((asset) => (
            <div className="result-card" key={asset.id}>
              <img src={asset.url} alt="ComfyUI 生成结果" />
              <div className="result-card-body">
                <h3>真实生成结果</h3>
                <p className="muted">来自 custom_comfyui provider。</p>
              </div>
            </div>
          ))}
        </div>

        {task.assets.length === 0 ? (
          <div className="panel">
            <h3>{task.status === "failed" ? "没有返回结果" : "结果还在生成"}</h3>
            <p className="muted">
              {task.status === "failed"
                ? task.errorMessage ?? "ComfyUI 没有返回可展示图片。"
                : "页面会自动刷新任务状态，也可以手动点击刷新。"}
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
