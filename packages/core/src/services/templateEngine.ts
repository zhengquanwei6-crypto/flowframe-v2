import { getDefaultProvider } from "../data/providers";
import { getTemplateById } from "../data/templates";
import type {
  ProviderExecutionPayload,
  Template,
  TemplateInputField,
  TemplateRunPayload
} from "../types";

export class TemplateValidationError extends Error {
  constructor(public readonly fieldIds: string[]) {
    super("Missing required template fields");
  }
}

export function getFieldsForMode(template: Template, mode: "normal" | "advanced") {
  return mode === "advanced"
    ? [...template.inputFields, ...template.advancedFields]
    : template.inputFields;
}

export function validateTemplateInputs(
  template: Template,
  mode: "normal" | "advanced",
  inputs: TemplateRunPayload["inputs"]
) {
  const fields = getFieldsForMode(template, mode);
  const missing = fields
    .filter((field) => field.required)
    .filter((field) => {
      const value = inputs[field.id];
      return value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
    })
    .map((field) => field.id);

  if (missing.length > 0) {
    throw new TemplateValidationError(missing);
  }
}

export function getDefaultInputValue(field: TemplateInputField) {
  if (field.defaultValue !== undefined) {
    return field.defaultValue;
  }

  if (field.type === "boolean") {
    return false;
  }

  if (field.type === "image") {
    return [];
  }

  return "";
}

export function createInitialInputs(template: Template, mode: "normal" | "advanced") {
  return Object.fromEntries(
    getFieldsForMode(template, mode).map((field) => [field.id, getDefaultInputValue(field)])
  );
}

export function buildProviderPayload(payload: TemplateRunPayload): ProviderExecutionPayload {
  const template = getTemplateById(payload.templateId);

  if (!template) {
    throw new Error(`Template not found: ${payload.templateId}`);
  }

  validateTemplateInputs(template, payload.mode, payload.inputs);

  const variables = Object.fromEntries(
    Object.entries(payload.inputs).map(([fieldId, value]) => {
      const mappingKey = template.binding.variableMap[fieldId] ?? fieldId;
      return [mappingKey, value];
    })
  );

  return {
    providerCapability: template.binding.providerCapability,
    templateId: template.id,
    workflowRef: template.binding.hiddenWorkflowRef,
    workflowVersion: template.binding.version,
    variables
  };
}

export function summarizeInputs(template: Template, inputs: TemplateRunPayload["inputs"]) {
  const fields = [...template.inputFields, ...template.advancedFields];
  const entries = fields
    .map((field) => {
      const value = inputs[field.id];
      if (value === undefined || value === "" || Array.isArray(value)) {
        return undefined;
      }

      if (field.type === "select") {
        const label = field.options.find((option) => option.value === value)?.label ?? String(value);
        return [field.label, label] as const;
      }

      if (field.type === "boolean") {
        return [field.label, value ? "开启" : "关闭"] as const;
      }

      return [field.label, String(value)] as const;
    })
    .filter((entry): entry is readonly [string, string] => Boolean(entry));

  return Object.fromEntries(entries);
}

export function resolveProviderId(providerId?: string) {
  return providerId ?? getDefaultProvider().id;
}
