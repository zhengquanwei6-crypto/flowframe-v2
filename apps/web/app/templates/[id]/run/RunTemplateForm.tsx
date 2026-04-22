"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  createInitialInputs,
  getFieldsForMode,
  getTemplateById,
  providers,
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
  const [providerId, setProviderId] = useState("hosted-demo");
  const [inputs, setInputs] = useState<Record<string, string | number | boolean | string[]>>(() =>
    createInitialInputs(template, "normal")
  );
  const [submittedTaskId, setSubmittedTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fields = useMemo(() => getFieldsForMode(template, mode), [mode, template]);

  function switchMode(nextMode: UserMode) {
    setMode(nextMode);
    setInputs((current) => ({
      ...createInitialInputs(template, nextMode),
      ...current
    }));
  }

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);

    try {
      const payload: TemplateRunPayload = {
        templateId: template.id,
        providerId,
        mode,
        inputs
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
            <p className="eyebrow">执行模板</p>
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

          {mode === "advanced" ? (
            <div className="form-field">
              <label htmlFor="provider">执行 provider</label>
              <select
                className="select-input"
                id="provider"
                value={providerId}
                onChange={(event) => setProviderId(event.target.value)}
              >
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {error ? <p className="status failed">{error}</p> : null}

          <button className="primary-button" type="button" onClick={handleSubmit} disabled={isSubmitting}>
            <span aria-hidden="true">+</span>
            {isSubmitting ? "提交中" : `提交任务，消耗 ${template.creditCost} 点`}
          </button>
        </div>
      </div>

      <aside className="panel">
        <p className="eyebrow">任务预览</p>
        <h2>普通用户不需要看到节点</h2>
        <p className="muted">
          此页面只展示模板需要的业务输入。服务端会把表单转换成 provider 执行 payload，并隐藏 workflow 绑定细节。
        </p>
        <div className="settings-list">
          <div>
            <span>预计耗时</span>
            <strong>{template.estimatedSeconds} 秒</strong>
          </div>
          <div>
            <span>消耗额度</span>
            <strong>{template.creditCost} 点</strong>
          </div>
          <div>
            <span>当前模式</span>
            <strong>{mode === "normal" ? "普通" : "高级"}</strong>
          </div>
        </div>
        {submittedTaskId ? (
          <div className="row-actions">
            <Link className="primary-button" href={`/tasks/${submittedTaskId}`}>
              查看任务状态
            </Link>
            <Link className="secondary-button" href="/templates">
              再选模板
            </Link>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
