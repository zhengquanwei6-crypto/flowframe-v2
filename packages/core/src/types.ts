export type UserMode = "normal" | "advanced";

export type TemplateCategory =
  | "generate"
  | "edit"
  | "commerce"
  | "portrait"
  | "enhance";

export type TemplateDifficulty = "starter" | "advanced";

export type TemplateFieldType =
  | "text"
  | "textarea"
  | "select"
  | "image"
  | "range"
  | "number"
  | "boolean";

export type TemplateOption = {
  label: string;
  value: string;
};

export type TemplateFieldBase = {
  id: string;
  label: string;
  helper?: string;
  required?: boolean;
  defaultValue?: string | number | boolean;
  mobilePriority?: "primary" | "secondary";
  mappingKey: string;
};

export type TextTemplateField = TemplateFieldBase & {
  type: "text" | "textarea";
  placeholder?: string;
  maxLength?: number;
};

export type SelectTemplateField = TemplateFieldBase & {
  type: "select";
  options: TemplateOption[];
};

export type ImageTemplateField = TemplateFieldBase & {
  type: "image";
  accept: "image/*";
  maxFiles: number;
};

export type RangeTemplateField = TemplateFieldBase & {
  type: "range" | "number";
  min: number;
  max: number;
  step: number;
  unit?: string;
};

export type BooleanTemplateField = TemplateFieldBase & {
  type: "boolean";
};

export type TemplateInputField =
  | TextTemplateField
  | SelectTemplateField
  | ImageTemplateField
  | RangeTemplateField
  | BooleanTemplateField;

export type TemplateBinding = {
  providerCapability: string;
  version: string;
  hiddenWorkflowRef: string;
  variableMap: Record<string, string>;
};

export type Template = {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: TemplateCategory;
  difficulty: TemplateDifficulty;
  estimatedSeconds: number;
  creditCost: number;
  badges: string[];
  coverImage: string;
  exampleOutputs: string[];
  inputFields: TemplateInputField[];
  advancedFields: TemplateInputField[];
  supportedModes: UserMode[];
  binding: TemplateBinding;
};

export type AssetKind = "image" | "video" | "file";

export type Asset = {
  id: string;
  taskId: string;
  kind: AssetKind;
  url: string;
  width?: number;
  height?: number;
  createdAt: string;
};

export type TaskStatus =
  | "draft"
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "canceled";

export type ProviderType =
  | "custom_comfyui"
  | "hosted_comfyui"
  | "managed_provider";

export type Provider = {
  id: string;
  name: string;
  type: ProviderType;
  description: string;
  status: "ready" | "needs_setup" | "coming_soon";
  supports: string[];
  isDefault?: boolean;
};

export type ProviderConfig = {
  type: "custom_comfyui";
  baseUrl: string;
  checkpointName?: string;
};

export type Task = {
  id: string;
  title: string;
  templateId: string;
  status: TaskStatus;
  progress: number;
  providerId: string;
  mode: UserMode;
  createdAt: string;
  updatedAt: string;
  creditCost: number;
  inputsSummary: Record<string, string>;
  assets: Asset[];
  providerTaskId?: string;
  providerConfig?: ProviderConfig;
  errorMessage?: string;
};

export type TemplateRunPayload = {
  templateId: string;
  providerId?: string;
  mode: UserMode;
  inputs: Record<string, string | number | boolean | string[]>;
  providerConfig?: ProviderConfig;
};

export type ProviderExecutionPayload = {
  providerCapability: string;
  templateId: string;
  workflowRef: string;
  workflowVersion: string;
  variables: Record<string, string | number | boolean | string[]>;
};

export type ProviderAdapter = {
  submit(payload: ProviderExecutionPayload, config?: ProviderConfig): Promise<{
    providerTaskId: string;
    status: TaskStatus;
  }>;
  getStatus(providerTaskId: string, config?: ProviderConfig): Promise<{
    status: TaskStatus;
    progress: number;
    assets?: Asset[];
    errorMessage?: string;
  }>;
  cancel(providerTaskId: string, config?: ProviderConfig): Promise<void>;
};

export type PlanKey = "free" | "pro" | "team";

export type CreditPlan = {
  key: PlanKey;
  name: string;
  monthlyCredits: number;
  maxResolution: string;
  queue: "standard" | "priority";
  historyDays: number;
  features: string[];
};
