import type { Task } from "../types";

export const sampleTasks: Task[] = [
  {
    id: "task-240422-001",
    title: "夏季饮料发布海报",
    templateId: "text-to-image-poster",
    status: "completed",
    progress: 100,
    providerId: "hosted-demo",
    mode: "normal",
    createdAt: "2026-04-22T08:20:00.000Z",
    updatedAt: "2026-04-22T08:21:05.000Z",
    creditCost: 2,
    inputsSummary: {
      需求: "清爽夏季饮料海报",
      风格: "现代商业",
      比例: "1:1"
    },
    assets: [
      {
        id: "asset-001",
        taskId: "task-240422-001",
        kind: "image",
        url: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=900&q=80",
        width: 1024,
        height: 1024,
        createdAt: "2026-04-22T08:21:05.000Z"
      }
    ]
  },
  {
    id: "task-240422-002",
    title: "耳机商品图优化",
    templateId: "product-photo-polish",
    status: "running",
    progress: 68,
    providerId: "hosted-demo",
    mode: "normal",
    createdAt: "2026-04-22T09:05:00.000Z",
    updatedAt: "2026-04-22T09:05:42.000Z",
    creditCost: 4,
    inputsSummary: {
      商品: "蓝牙耳机",
      场景: "广告投放"
    },
    assets: []
  },
  {
    id: "task-240422-003",
    title: "头像电影感风格化",
    templateId: "portrait-style",
    status: "queued",
    progress: 12,
    providerId: "hosted-demo",
    mode: "normal",
    createdAt: "2026-04-22T09:10:00.000Z",
    updatedAt: "2026-04-22T09:10:15.000Z",
    creditCost: 3,
    inputsSummary: {
      风格: "电影肖像",
      人脸保留: "75%"
    },
    assets: []
  }
];

export function getTaskById(id: string) {
  const existingTask = sampleTasks.find((task) => task.id === id);

  if (existingTask) {
    return existingTask;
  }

  if (id.startsWith("task-demo-")) {
    const timestamp = new Date().toISOString();

    return {
      id,
      title: "创意海报生成任务",
      templateId: "text-to-image-poster",
      status: "queued",
      progress: 8,
      providerId: "hosted-demo",
      mode: "normal",
      createdAt: timestamp,
      updatedAt: timestamp,
      creditCost: 2,
      inputsSummary: {
        需求: "来自执行页的新任务",
        风格: "现代商业",
        比例: "1:1"
      },
      assets: []
    } satisfies Task;
  }

  return undefined;
}
