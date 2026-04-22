import type { Provider } from "../types";

export const providers: Provider[] = [
  {
    id: "hosted-demo",
    name: "FlowFrame 托管演示",
    type: "hosted_comfyui",
    description: "MVP 默认托管执行入口，用于演示完整任务闭环。",
    status: "ready",
    isDefault: true,
    supports: [
      "txt2img",
      "img2img",
      "background_replace",
      "inpaint",
      "portrait_style",
      "commerce_polish",
      "upscale",
      "style_transfer"
    ]
  },
  {
    id: "custom-comfyui",
    name: "自定义 ComfyUI",
    type: "custom_comfyui",
    description: "预留给高级用户绑定自己的 ComfyUI URL。",
    status: "needs_setup",
    supports: ["txt2img", "img2img", "inpaint", "upscale"]
  },
  {
    id: "managed-cloud",
    name: "多后端云执行",
    type: "managed_provider",
    description: "预留给未来接入更多模型和托管算力。",
    status: "coming_soon",
    supports: ["txt2img", "img2img", "video", "batch"]
  }
];

export function getDefaultProvider() {
  return providers.find((provider) => provider.isDefault) ?? providers[0];
}
