import type {
  Asset,
  ProviderAdapter,
  ProviderConfig,
  ProviderExecutionPayload
} from "../types";

type ComfyImage = {
  filename: string;
  subfolder?: string;
  type?: string;
};

type ComfyHistoryItem = {
  outputs?: Record<string, { images?: ComfyImage[] }>;
  status?: {
    completed?: boolean;
    status_str?: string;
  };
};

type ComfyHistoryResponse = Record<string, ComfyHistoryItem>;

function normalizeBaseUrl(baseUrl?: string) {
  const value = baseUrl?.trim();

  if (!value) {
    throw new Error("请填写 ComfyUI 地址，例如 http://127.0.0.1:8188");
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error("ComfyUI 地址格式不正确，请使用 http:// 或 https:// 开头的完整地址");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("ComfyUI 地址只支持 http:// 或 https://");
  }

  return parsed.toString().replace(/\/$/, "");
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(20000)
    });
  } catch {
    throw new Error("无法连接 ComfyUI，请确认地址可从服务器访问");
  }

  const text = await response.text();
  let body: unknown = {};

  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { message: text };
    }
  }

  if (!response.ok) {
    const message =
      typeof body === "object" && body && "error" in body
        ? JSON.stringify((body as { error: unknown }).error)
        : text || response.statusText;
    throw new Error(`ComfyUI 请求失败：${message}`);
  }

  return body as T;
}

function resolveSize(aspectRatio: unknown) {
  if (aspectRatio === "3:4") {
    return { width: 768, height: 1024 };
  }

  if (aspectRatio === "16:9") {
    return { width: 1024, height: 576 };
  }

  return { width: 1024, height: 1024 };
}

function resolveStylePrompt(style: unknown) {
  const styleMap: Record<string, string> = {
    modern: "modern commercial design, clean composition, high quality",
    cinematic: "cinematic lighting, dramatic atmosphere, high detail",
    illustration: "editorial illustration, expressive shapes, rich color",
    minimal: "minimal design, clean background, elegant layout"
  };

  return styleMap[String(style ?? "modern")] ?? styleMap.modern;
}

async function resolveCheckpoint(baseUrl: string, config?: ProviderConfig) {
  if (config?.checkpointName?.trim()) {
    return config.checkpointName.trim();
  }

  const objectInfo = await fetchJson<Record<string, any>>(
    `${baseUrl}/object_info/CheckpointLoaderSimple`
  );
  const choices =
    objectInfo?.CheckpointLoaderSimple?.input?.required?.ckpt_name?.[0] ??
    objectInfo?.input?.required?.ckpt_name?.[0];

  if (Array.isArray(choices) && typeof choices[0] === "string") {
    return choices[0];
  }

  throw new Error("未找到可用 checkpoint，请在表单中填写 ComfyUI 已安装的模型文件名");
}

function buildTextToImagePrompt(
  payload: ProviderExecutionPayload,
  checkpointName: string
) {
  const variables = payload.variables;
  const { width, height } = resolveSize(variables.aspect_ratio);
  const prompt = String(variables.positive_prompt ?? "").trim();
  const stylePrompt = resolveStylePrompt(variables.style_preset);
  const negativePrompt =
    String(variables.negative_prompt ?? "").trim() ||
    "blurry, low quality, deformed, watermark, text artifacts";
  const steps = Number(variables.sampler_steps ?? 24);
  const seedInput = Number(variables.seed ?? 0);
  const seed =
    Number.isFinite(seedInput) && seedInput > 0
      ? Math.floor(seedInput)
      : Math.floor(Math.random() * 999999999);

  return {
    "3": {
      class_type: "KSampler",
      inputs: {
        seed,
        steps,
        cfg: 7,
        sampler_name: "euler",
        scheduler: "normal",
        denoise: 1,
        model: ["4", 0],
        positive: ["6", 0],
        negative: ["7", 0],
        latent_image: ["5", 0]
      }
    },
    "4": {
      class_type: "CheckpointLoaderSimple",
      inputs: {
        ckpt_name: checkpointName
      }
    },
    "5": {
      class_type: "EmptyLatentImage",
      inputs: {
        width,
        height,
        batch_size: 1
      }
    },
    "6": {
      class_type: "CLIPTextEncode",
      inputs: {
        text: `${prompt}, ${stylePrompt}`,
        clip: ["4", 1]
      }
    },
    "7": {
      class_type: "CLIPTextEncode",
      inputs: {
        text: negativePrompt,
        clip: ["4", 1]
      }
    },
    "8": {
      class_type: "VAEDecode",
      inputs: {
        samples: ["3", 0],
        vae: ["4", 2]
      }
    },
    "9": {
      class_type: "SaveImage",
      inputs: {
        filename_prefix: "flowframe_v2",
        images: ["8", 0]
      }
    }
  };
}

function collectImages(historyItem?: ComfyHistoryItem) {
  return Object.values(historyItem?.outputs ?? {}).flatMap((output) => output.images ?? []);
}

async function imageToDataUrl(baseUrl: string, taskId: string, image: ComfyImage, index: number) {
  const url = new URL(`${baseUrl}/view`);
  url.searchParams.set("filename", image.filename);
  url.searchParams.set("type", image.type ?? "output");

  if (image.subfolder) {
    url.searchParams.set("subfolder", image.subfolder);
  }

  const response = await fetch(url, { signal: AbortSignal.timeout(20000) });

  if (!response.ok) {
    throw new Error("ComfyUI 已完成任务，但结果图片下载失败");
  }

  const contentType = response.headers.get("content-type") ?? "image/png";
  const bytes = new Uint8Array(await response.arrayBuffer());
  let binary = "";

  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }

  return {
    id: `asset-${taskId}-${index}`,
    taskId,
    kind: "image",
    url: `data:${contentType};base64,${btoa(binary)}`,
    createdAt: new Date().toISOString()
  } satisfies Asset;
}

export const mockHostedProvider: ProviderAdapter = {
  async submit() {
    return {
      providerTaskId: `mock-${Date.now()}`,
      status: "queued"
    };
  },
  async getStatus() {
    return {
      status: "running",
      progress: 64
    };
  },
  async cancel() {
    return undefined;
  }
};

export const customComfyProvider: ProviderAdapter = {
  async submit(payload, config) {
    const baseUrl = normalizeBaseUrl(config?.baseUrl);
    const checkpointName = await resolveCheckpoint(baseUrl, config);

    if (payload.providerCapability !== "txt2img") {
      throw new Error("当前真实链路只支持文生图模板");
    }

    const response = await fetchJson<{
      prompt_id?: string;
      node_errors?: Record<string, unknown>;
    }>(`${baseUrl}/prompt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: `flowframe-${Date.now()}`,
        prompt: buildTextToImagePrompt(payload, checkpointName)
      })
    });

    if (response.node_errors && Object.keys(response.node_errors).length > 0) {
      throw new Error(`ComfyUI workflow 参数错误：${JSON.stringify(response.node_errors)}`);
    }

    if (!response.prompt_id) {
      throw new Error("ComfyUI 没有返回 prompt_id");
    }

    return {
      providerTaskId: response.prompt_id,
      status: "queued"
    };
  },

  async getStatus(providerTaskId, config) {
    const baseUrl = normalizeBaseUrl(config?.baseUrl);
    const history = await fetchJson<ComfyHistoryResponse>(
      `${baseUrl}/history/${encodeURIComponent(providerTaskId)}`
    );
    const historyItem = history[providerTaskId];

    if (!historyItem) {
      return {
        status: "running",
        progress: 35
      };
    }

    const statusText = historyItem.status?.status_str ?? "";
    const images = collectImages(historyItem);

    if (historyItem.status?.completed && images.length > 0) {
      return {
        status: "completed",
        progress: 100,
        assets: await Promise.all(
          images.map((image, index) => imageToDataUrl(baseUrl, providerTaskId, image, index))
        )
      };
    }

    if (historyItem.status?.completed && images.length === 0) {
      return {
        status: "failed",
        progress: 100,
        errorMessage: "ComfyUI 任务已结束，但没有返回图片结果"
      };
    }

    if (statusText && statusText !== "success" && statusText !== "running") {
      return {
        status: "failed",
        progress: 100,
        errorMessage: `ComfyUI 任务失败：${statusText}`
      };
    }

    return {
      status: "running",
      progress: 70
    };
  },

  async cancel() {
    return undefined;
  }
};

export const customComfyProviderStub = customComfyProvider;
