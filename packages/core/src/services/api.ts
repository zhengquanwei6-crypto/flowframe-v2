import { providers } from "../data/providers";
import { createDemoTaskAsset, sampleTasks } from "../data/tasks";
import { getTemplateById, templates } from "../data/templates";
import type { Task, TemplateRunPayload } from "../types";
import { mockHostedProvider } from "./providerAdapters";
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
  return sampleTasks.find((task) => task.id === id);
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
  const providerResponse = await mockHostedProvider.submit(executionPayload);
  const timestamp = new Date().toISOString();

  createdTaskCount += 1;

  const task: Task = {
    id: `task-demo-${createdTaskCount}`,
    title: `${template.name}任务`,
    templateId: template.id,
    status: "completed",
    progress: 100,
    providerId: resolveProviderId(payload.providerId),
    mode: payload.mode,
    createdAt: timestamp,
    updatedAt: timestamp,
    creditCost: template.creditCost,
    inputsSummary: summarizeInputs(template, payload.inputs),
    assets: [createDemoTaskAsset(`task-demo-${createdTaskCount}`)]
  };

  sampleTasks.unshift(task);
  return task;
}
