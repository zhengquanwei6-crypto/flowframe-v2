import { providers } from "../data/providers";
import { createDemoTaskAsset, sampleTasks } from "../data/tasks";
import { getTemplateById, templates } from "../data/templates";
import type { Task, TemplateRunPayload } from "../types";
import { customComfyProvider, mockHostedProvider } from "./providerAdapters";
import { buildProviderPayload, resolveProviderId, summarizeInputs } from "./templateEngine";

let createdTaskCount = 100;

export async function listTemplates() {
  return templates;
}

export async function getTemplate(id: string) {
  return getTemplateById(id);
}

export async function listProviders() {
  return providers;
}

export async function listTasks() {
  return sampleTasks;
}

export async function getTask(id: string) {
  return refreshTaskStatus(id);
}

export async function listAssets() {
  return sampleTasks.flatMap((task) => task.assets);
}

export async function submitTemplateTask(payload: TemplateRunPayload): Promise<Task> {
  const template = getTemplateById(payload.templateId);

  if (!template) {
    throw new Error(`Template not found: ${payload.templateId}`);
  }

  const executionPayload = buildProviderPayload(payload);
  const providerId = resolveProviderId(payload.providerId);
  const isCustomComfy = providerId === "custom-comfyui";
  const providerResponse = isCustomComfy
    ? await customComfyProvider.submit(executionPayload, payload.providerConfig)
    : await mockHostedProvider.submit(executionPayload);
  const timestamp = new Date().toISOString();

  createdTaskCount += 1;

  const task: Task = {
    id: isCustomComfy ? `task-comfy-${createdTaskCount}` : `task-demo-${createdTaskCount}`,
    title: `${template.name}任务`,
    templateId: template.id,
    status: isCustomComfy ? providerResponse.status : "completed",
    progress: isCustomComfy ? 10 : 100,
    providerId,
    mode: payload.mode,
    createdAt: timestamp,
    updatedAt: timestamp,
    creditCost: template.creditCost,
    inputsSummary: summarizeInputs(template, payload.inputs),
    assets: isCustomComfy ? [] : [createDemoTaskAsset(`task-demo-${createdTaskCount}`)],
    providerTaskId: providerResponse.providerTaskId,
    providerConfig: payload.providerConfig
  };

  sampleTasks.unshift(task);
  return task;
}

export async function refreshTaskStatus(id: string): Promise<Task | undefined> {
  const task = sampleTasks.find((item) => item.id === id);

  if (!task) {
    return undefined;
  }

  if (
    task.providerId !== "custom-comfyui" ||
    !task.providerTaskId ||
    !task.providerConfig ||
    task.status === "completed" ||
    task.status === "failed" ||
    task.status === "canceled"
  ) {
    return task;
  }

  try {
    const status = await customComfyProvider.getStatus(task.providerTaskId, task.providerConfig);
    task.status = status.status;
    task.progress = status.progress;
    task.updatedAt = new Date().toISOString();

    if (status.assets?.length) {
      task.assets = status.assets.map((asset) => ({
        ...asset,
        taskId: task.id
      }));
    }

    if (status.errorMessage) {
      task.errorMessage = status.errorMessage;
    }
  } catch (error) {
    task.status = "failed";
    task.progress = 100;
    task.updatedAt = new Date().toISOString();
    task.errorMessage = error instanceof Error ? error.message : "任务状态查询失败";
  }

  return task;
}
