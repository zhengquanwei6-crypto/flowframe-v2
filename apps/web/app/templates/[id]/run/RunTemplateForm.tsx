"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  createInitialInputs,
  getFieldsForMode,
  getTemplateById,
  type Task,
  type TemplateInputField,
  type TemplateRunPayload,
  type UserMode
} from "@flowframe/core";

function FieldControl({
  field,
  value,
  onChange
}: {
  field: TemplateInputField;
  value: string | number | boolean | string[];
  onChange: (value: string | number | boolean | string[]) => void;
}) {
  if (field.type === "textarea") {
    return (
      <textarea
        className="textarea-input"
        value={String(value ?? "")}
        maxLength={field.maxLength}
        placeholder={field.placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  if (field.type === "text") {
    return (
      <input
        className="text-input"
        value={String(value ?? "")}
        maxLength={field.maxLength}
        placeholder={field.placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select
        className="select-input"
        value={String(value ?? field.defaultValue ?? "")}
        onChange={(event) => onChange(event.target.value)}
      >
        {field.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "image") {
    return (
      <input
        className="file-input"
        type="file"
        accept={field.accept}
        multiple={field.maxFiles > 1}
        onChange={(event) =>
          onChange(Array.from(event.target.files ?? []).map((file) => file.name))
        }
      />
    );
  }

  if (field.type === "boolean") {
    return (
      <label className="secondary-button" style={{ justifyContent: "flex-start" }}>
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
        />
        开启
      </label>
    );
  }

  if (field.type === "range" || field.type === "number") {
    return (
      <div className="range-row">
        <input
          type={field.type === "number" ? "number" : "range"}
          min={field.min}
          max={field.max}
          step={field.step}
          value={Number(value ?? field.defaultValue ?? field.min)}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <strong>
          {String(value ?? field.defaultValue ?? field.min)}
          {field.unit ?? ""}
        </strong>
      </div>
    );
  }

  return null;
}

export function RunTemplateForm({ templateId }: { templateId: string }) {
  const template = getTemplateById(templateId)!;
  const [mode, setMode] = useState<UserMode>("normal");
  const [baseUrl, setBaseUrl] = useState("");
  const [checkpointName, setCheckpointName] = useState("");
  const [inputs, setInputs] = useState<Record<string, string | number | boolean | string[]>>(() =>
    createInitialInputs(template, "normal")
  );
  const [submittedTaskId, setSubmittedTaskId] = useState<string | null>(null);
  const [submittedStatus, setSubmittedStatus] = useState<Task["status"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fields = useMemo(() => getFieldsForMode(template, mode), [mode, template]);
  const isRealTemplate = template.id === "text-to-image-poster";

  function switchMode(nextMode: UserMode) {
    setMode(nextMode);
    setInputs((current) => ({
      ...createInitialInputs(template, nextMode),
      ...current
    }));
  }

  async function handleSubmit() {
    setError(null);
    setSubmittedTaskId(null);

    if (!isRealTemplate) {
      setError("当前真实执行链路只开放“创意海报生成”文生图模板。");
      return;
    }

    if (!baseUrl.trim()) {
      setError("请填写可从服务器访问的 ComfyUI 地址。");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: TemplateRunPayload = {
        templateId: template.id,
        providerId: "custom-comfyui",
        mode,
        inputs,
        providerConfig: {
          type: "custom_comfyui",
          baseUrl: baseUrl.trim(),
          checkpointName: checkpointName.trim() || undefined
        }
      };
      const response = await fetch("/api/tasks/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const data = (await response.json()) as { task?: Task; error?: string };

      if (!response.ok || !data.task) {
        throw new Error(data.error ?? "任务提交失败");
      }

      setSubmittedTaskId(data.task.id);
      setSubmittedStatus(data.task.status);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "任务提交失败");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="two-grid grid">
      <div className="panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">真实执行</p>
            <h2>{template.name}</h2>
          </div>
          <div className="mode-toggle" aria-label="模式切换">
            <button
              className={mode === "normal" ? "active" : ""}
              type="button"
              onClick={() => switchMode("normal")}
            >
              普通
            </button>
            <button
              className={mode === "advanced" ? "active" : ""}
              type="button"
              onClick={() => switchMode("advanced")}
            >
              高级
            </button>
          </div>
        </div>

        <div className="field-stack">
          {fields.map((field) => (
            <div className="form-field" key={field.id}>
              <label htmlFor={field.id}>
                {field.label}
                {field.required ? " *" : ""}
              </label>
              {field.helper ? <small>{field.helper}</small> : null}
              <FieldControl
                field={field}
                value={inputs[field.id]}
                onChange={(value) => setInputs((current) => ({ ...current, [field.id]: value }))}
              />
            </div>
          ))}

          <div className="form-field">
            <label htmlFor="comfy-url">ComfyUI 地址 *</label>
            <small>填写服务器能访问到的 ComfyUI 地址，例如 http://your-host:8188。</small>
            <input
              className="text-input"
              id="comfy-url"
              placeholder="http://127.0.0.1:8188"
              value={baseUrl}
              onChange={(event) => setBaseUrl(event.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="checkpoint">Checkpoint 模型文件名</label>
            <small>可选。不填时会自动读取 ComfyUI 的第一个 checkpoint。</small>
            <input
              className="text-input"
              id="checkpoint"
              placeholder="例如 sd_xl_base_1.0.safetensors"
              value={checkpointName}
              onChange={(event) => setCheckpointName(event.target.value)}
            />
          </div>

          {error ? <p className="status failed">{error}</p> : null}

          <button className="primary-button" type="button" onClick={handleSubmit} disabled={isSubmitting}>
            <span aria-hidden="true">+</span>
            {isSubmitting ? "正在提交到 ComfyUI" : `提交真实任务，消耗 ${template.creditCost} 点`}
          </button>
        </div>
      </div>

      <aside className="panel">
        <p className="eyebrow">custom_comfyui</p>
        <h2>表单会映射成 ComfyUI workflow</h2>
        <p className="muted">
          用户只填写创作需求和 ComfyUI 地址。系统内部会生成最小文生图 workflow，并用
          custom_comfyui provider 提交到 `/prompt`。
        </p>
        <div className="settings-list">
          <div>
            <span>真实模板</span>
            <strong>{isRealTemplate ? "文生图" : "未开放"}</strong>
          </div>
          <div>
            <span>Provider</span>
            <strong>custom_comfyui</strong>
          </div>
          <div>
            <span>状态刷新</span>
            <strong>任务页自动轮询</strong>
          </div>
        </div>
        {submittedTaskId ? (
          <div className="success-callout">
            <p className="eyebrow">提交成功</p>
            <h3>任务已提交到 ComfyUI</h3>
            <p className="muted">
              当前状态：{submittedStatus ?? "queued"}。进入任务页后会自动查询真实状态和结果。
            </p>
            <div className="row-actions">
              <Link className="primary-button" href={`/tasks/${submittedTaskId}`}>
                查看任务状态
              </Link>
              <Link className="secondary-button" href={`/results?task=${submittedTaskId}`}>
                查看结果
              </Link>
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
