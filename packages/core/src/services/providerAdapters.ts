import type { ProviderAdapter } from "../types";

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

export const customComfyProviderStub: ProviderAdapter = {
  async submit(payload) {
    if (!payload.workflowRef.startsWith("workflow://")) {
      throw new Error("Invalid workflow binding");
    }

    return {
      providerTaskId: `custom-comfy-${Date.now()}`,
      status: "queued"
    };
  },
  async getStatus() {
    return {
      status: "queued",
      progress: 5
    };
  },
  async cancel() {
    return undefined;
  }
};
