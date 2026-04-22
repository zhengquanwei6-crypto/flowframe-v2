import type { Template } from "../types";

export const templateCategories = [
  { id: "generate", label: "生成创作" },
  { id: "edit", label: "图片编辑" },
  { id: "commerce", label: "商品内容" },
  { id: "portrait", label: "头像人像" },
  { id: "enhance", label: "增强修复" }
] as const;

export const templates: Template[] = [
  {
    id: "text-to-image-poster",
    name: "创意海报生成",
    shortDescription: "输入一句需求，生成适合社媒和活动页的视觉海报。",
    longDescription:
      "面向普通用户的文生图模板，隐藏模型和采样细节，只保留主题、风格、比例和数量。",
    category: "generate",
    difficulty: "starter",
    estimatedSeconds: 45,
    creditCost: 2,
    badges: ["热门", "新手友好"],
    coverImage:
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=1200&q=80",
    exampleOutputs: [
      "https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80"
    ],
    supportedModes: ["normal", "advanced"],
    inputFields: [
      {
        id: "prompt",
        label: "你想生成什么",
        helper: "描述主体、用途和希望的氛围。",
        type: "textarea",
        required: true,
        placeholder: "例如：一张夏季新品饮料发布海报，清爽、明亮、有水花",
        maxLength: 500,
        mobilePriority: "primary",
        mappingKey: "positive_prompt"
      },
      {
        id: "style",
        label: "视觉风格",
        type: "select",
        required: true,
        defaultValue: "modern",
        mobilePriority: "primary",
        mappingKey: "style_preset",
        options: [
          { label: "现代商业", value: "modern" },
          { label: "电影质感", value: "cinematic" },
          { label: "插画", value: "illustration" },
          { label: "极简", value: "minimal" }
        ]
      },
      {
        id: "aspectRatio",
        label: "画面比例",
        type: "select",
        required: true,
        defaultValue: "1:1",
        mappingKey: "aspect_ratio",
        options: [
          { label: "1:1 方图", value: "1:1" },
          { label: "3:4 竖图", value: "3:4" },
          { label: "16:9 横图", value: "16:9" }
        ]
      }
    ],
    advancedFields: [
      {
        id: "negativePrompt",
        label: "负面提示词",
        type: "textarea",
        placeholder: "不希望出现的内容",
        mappingKey: "negative_prompt"
      },
      {
        id: "steps",
        label: "迭代步数",
        type: "range",
        min: 12,
        max: 40,
        step: 1,
        defaultValue: 24,
        mappingKey: "sampler_steps"
      },
      {
        id: "seed",
        label: "随机种子",
        type: "number",
        min: 0,
        max: 99999999,
        step: 1,
        defaultValue: 0,
        mappingKey: "seed"
      }
    ],
    binding: {
      providerCapability: "txt2img",
      version: "v1",
      hiddenWorkflowRef: "workflow://poster/txt2img/v1",
      variableMap: {
        prompt: "positive_prompt",
        style: "style_preset",
        aspectRatio: "aspect_ratio",
        negativePrompt: "negative_prompt",
        steps: "sampler_steps",
        seed: "seed"
      }
    }
  },
  {
    id: "image-to-image-remix",
    name: "参考图再创作",
    shortDescription: "上传参考图，保留构图并生成新的视觉版本。",
    longDescription:
      "适合把草图、旧图或参考素材转换成更完整的风格化结果。",
    category: "edit",
    difficulty: "starter",
    estimatedSeconds: 55,
    creditCost: 3,
    badges: ["图生图", "移动友好"],
    coverImage:
      "https://images.unsplash.com/photo-1518895312237-a9e23508077d?auto=format&fit=crop&w=1200&q=80",
    exampleOutputs: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80"
    ],
    supportedModes: ["normal", "advanced"],
    inputFields: [
      {
        id: "referenceImage",
        label: "参考图片",
        type: "image",
        required: true,
        accept: "image/*",
        maxFiles: 1,
        mobilePriority: "primary",
        mappingKey: "input_image"
      },
      {
        id: "prompt",
        label: "改成什么效果",
        type: "textarea",
        required: true,
        placeholder: "例如：改成高级杂志封面风，背景更干净",
        maxLength: 400,
        mobilePriority: "primary",
        mappingKey: "positive_prompt"
      },
      {
        id: "strength",
        label: "变化强度",
        type: "range",
        min: 10,
        max: 90,
        step: 5,
        unit: "%",
        defaultValue: 55,
        mappingKey: "denoise_strength"
      }
    ],
    advancedFields: [
      {
        id: "controlWeight",
        label: "参考约束",
        type: "range",
        min: 0,
        max: 100,
        step: 5,
        unit: "%",
        defaultValue: 70,
        mappingKey: "control_weight"
      }
    ],
    binding: {
      providerCapability: "img2img",
      version: "v1",
      hiddenWorkflowRef: "workflow://remix/img2img/v1",
      variableMap: {
        referenceImage: "input_image",
        prompt: "positive_prompt",
        strength: "denoise_strength",
        controlWeight: "control_weight"
      }
    }
  },
  {
    id: "background-replace",
    name: "一键换背景",
    shortDescription: "上传主体图，快速替换成干净棚拍、户外或品牌背景。",
    longDescription:
      "为普通用户包装抠图、局部重绘和背景生成流程，适合商品、头像和素材处理。",
    category: "edit",
    difficulty: "starter",
    estimatedSeconds: 50,
    creditCost: 3,
    badges: ["高频", "电商可用"],
    coverImage:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    exampleOutputs: [
      "https://images.unsplash.com/photo-1511511450040-677116ff389e?auto=format&fit=crop&w=900&q=80"
    ],
    supportedModes: ["normal", "advanced"],
    inputFields: [
      {
        id: "subjectImage",
        label: "主体图片",
        type: "image",
        required: true,
        accept: "image/*",
        maxFiles: 1,
        mobilePriority: "primary",
        mappingKey: "subject_image"
      },
      {
        id: "background",
        label: "新背景",
        type: "select",
        required: true,
        defaultValue: "studio",
        mobilePriority: "primary",
        mappingKey: "background_preset",
        options: [
          { label: "白底棚拍", value: "studio" },
          { label: "自然户外", value: "outdoor" },
          { label: "高级家居", value: "interior" },
          { label: "自定义描述", value: "custom" }
        ]
      },
      {
        id: "customBackground",
        label: "背景描述",
        type: "text",
        placeholder: "例如：浅灰色极简展台，柔和阴影",
        mappingKey: "background_prompt"
      }
    ],
    advancedFields: [
      {
        id: "edgeRefine",
        label: "边缘细化",
        type: "boolean",
        defaultValue: true,
        mappingKey: "edge_refine"
      }
    ],
    binding: {
      providerCapability: "background_replace",
      version: "v1",
      hiddenWorkflowRef: "workflow://edit/background-replace/v1",
      variableMap: {
        subjectImage: "subject_image",
        background: "background_preset",
        customBackground: "background_prompt",
        edgeRefine: "edge_refine"
      }
    }
  },
  {
    id: "inpaint-fix",
    name: "局部重绘修图",
    shortDescription: "上传图片并描述要修复的区域，生成自然替换结果。",
    longDescription:
      "MVP 先以描述式局部修复为主，后续可接入移动端涂抹蒙版。",
    category: "edit",
    difficulty: "advanced",
    estimatedSeconds: 65,
    creditCost: 4,
    badges: ["进阶", "修图"],
    coverImage:
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1200&q=80",
    exampleOutputs: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
    ],
    supportedModes: ["normal", "advanced"],
    inputFields: [
      {
        id: "sourceImage",
        label: "原始图片",
        type: "image",
        required: true,
        accept: "image/*",
        maxFiles: 1,
        mobilePriority: "primary",
        mappingKey: "source_image"
      },
      {
        id: "editInstruction",
        label: "想修哪里",
        type: "textarea",
        required: true,
        placeholder: "例如：去掉画面右侧路人，并补齐背景",
        maxLength: 360,
        mobilePriority: "primary",
        mappingKey: "edit_instruction"
      }
    ],
    advancedFields: [
      {
        id: "maskBlur",
        label: "边缘融合",
        type: "range",
        min: 0,
        max: 32,
        step: 1,
        defaultValue: 12,
        mappingKey: "mask_blur"
      }
    ],
    binding: {
      providerCapability: "inpaint",
      version: "v1",
      hiddenWorkflowRef: "workflow://edit/inpaint/v1",
      variableMap: {
        sourceImage: "source_image",
        editInstruction: "edit_instruction",
        maskBlur: "mask_blur"
      }
    }
  },
  {
    id: "portrait-style",
    name: "头像风格化",
    shortDescription: "上传自拍或头像，生成统一风格的社媒头像。",
    longDescription:
      "适合移动端快速上传照片，并生成商务、插画、电影感等风格头像。",
    category: "portrait",
    difficulty: "starter",
    estimatedSeconds: 60,
    creditCost: 3,
    badges: ["移动优先", "头像"],
    coverImage:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=80",
    exampleOutputs: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80"
    ],
    supportedModes: ["normal", "advanced"],
    inputFields: [
      {
        id: "faceImage",
        label: "头像照片",
        type: "image",
        required: true,
        accept: "image/*",
        maxFiles: 1,
        mobilePriority: "primary",
        mappingKey: "face_image"
      },
      {
        id: "portraitStyle",
        label: "头像风格",
        type: "select",
        required: true,
        defaultValue: "business",
        mappingKey: "portrait_style",
        options: [
          { label: "商务证件", value: "business" },
          { label: "电影肖像", value: "cinematic" },
          { label: "3D 卡通", value: "toon3d" },
          { label: "水彩插画", value: "watercolor" }
        ]
      }
    ],
    advancedFields: [
      {
        id: "identityStrength",
        label: "人脸保留",
        type: "range",
        min: 30,
        max: 95,
        step: 5,
        unit: "%",
        defaultValue: 75,
        mappingKey: "identity_strength"
      }
    ],
    binding: {
      providerCapability: "portrait_style",
      version: "v1",
      hiddenWorkflowRef: "workflow://portrait/style/v1",
      variableMap: {
        faceImage: "face_image",
        portraitStyle: "portrait_style",
        identityStrength: "identity_strength"
      }
    }
  },
  {
    id: "product-photo-polish",
    name: "商品图优化",
    shortDescription: "把普通商品照片优化成更适合详情页和广告投放的图片。",
    longDescription:
      "围绕商品主体、背景、光影和清晰度做一体化处理，适合电商卖家。",
    category: "commerce",
    difficulty: "starter",
    estimatedSeconds: 70,
    creditCost: 4,
    badges: ["电商", "Pro 预留"],
    coverImage:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    exampleOutputs: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
    ],
    supportedModes: ["normal", "advanced"],
    inputFields: [
      {
        id: "productImage",
        label: "商品图片",
        type: "image",
        required: true,
        accept: "image/*",
        maxFiles: 1,
        mobilePriority: "primary",
        mappingKey: "product_image"
      },
      {
        id: "platform",
        label: "使用场景",
        type: "select",
        required: true,
        defaultValue: "detail",
        mappingKey: "commerce_scene",
        options: [
          { label: "详情页主图", value: "detail" },
          { label: "广告投放", value: "ad" },
          { label: "小红书封面", value: "social" }
        ]
      }
    ],
    advancedFields: [
      {
        id: "shadowLevel",
        label: "阴影强度",
        type: "range",
        min: 0,
        max: 100,
        step: 5,
        unit: "%",
        defaultValue: 45,
        mappingKey: "shadow_level"
      }
    ],
    binding: {
      providerCapability: "commerce_polish",
      version: "v1",
      hiddenWorkflowRef: "workflow://commerce/photo-polish/v1",
      variableMap: {
        productImage: "product_image",
        platform: "commerce_scene",
        shadowLevel: "shadow_level"
      }
    }
  },
  {
    id: "image-upscale",
    name: "高清放大",
    shortDescription: "上传低清图片，生成更清晰的大图版本。",
    longDescription:
      "优先服务普通用户的高清修复需求，隐藏具体超分模型和后处理参数。",
    category: "enhance",
    difficulty: "starter",
    estimatedSeconds: 40,
    creditCost: 2,
    badges: ["快速", "高清"],
    coverImage:
      "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=1200&q=80",
    exampleOutputs: [
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80"
    ],
    supportedModes: ["normal", "advanced"],
    inputFields: [
      {
        id: "sourceImage",
        label: "需要放大的图片",
        type: "image",
        required: true,
        accept: "image/*",
        maxFiles: 1,
        mobilePriority: "primary",
        mappingKey: "source_image"
      },
      {
        id: "scale",
        label: "放大倍率",
        type: "select",
        required: true,
        defaultValue: "2x",
        mappingKey: "scale_factor",
        options: [
          { label: "2 倍", value: "2x" },
          { label: "4 倍", value: "4x" }
        ]
      }
    ],
    advancedFields: [
      {
        id: "faceEnhance",
        label: "人脸增强",
        type: "boolean",
        defaultValue: false,
        mappingKey: "face_enhance"
      }
    ],
    binding: {
      providerCapability: "upscale",
      version: "v1",
      hiddenWorkflowRef: "workflow://enhance/upscale/v1",
      variableMap: {
        sourceImage: "source_image",
        scale: "scale_factor",
        faceEnhance: "face_enhance"
      }
    }
  },
  {
    id: "style-transfer",
    name: "风格迁移",
    shortDescription: "把一张图转换成指定艺术或品牌视觉风格。",
    longDescription:
      "用于内容运营、品牌素材和创意探索，普通模式只保留风格选择和强度。",
    category: "generate",
    difficulty: "starter",
    estimatedSeconds: 58,
    creditCost: 3,
    badges: ["创意", "可复用"],
    coverImage:
      "https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&w=1200&q=80",
    exampleOutputs: [
      "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=900&q=80"
    ],
    supportedModes: ["normal", "advanced"],
    inputFields: [
      {
        id: "sourceImage",
        label: "原图",
        type: "image",
        required: true,
        accept: "image/*",
        maxFiles: 1,
        mobilePriority: "primary",
        mappingKey: "source_image"
      },
      {
        id: "style",
        label: "目标风格",
        type: "select",
        required: true,
        defaultValue: "editorial",
        mappingKey: "style_preset",
        options: [
          { label: "杂志大片", value: "editorial" },
          { label: "复古胶片", value: "film" },
          { label: "赛博霓虹", value: "neon" },
          { label: "品牌插画", value: "brand_illustration" }
        ]
      },
      {
        id: "strength",
        label: "风格强度",
        type: "range",
        min: 10,
        max: 90,
        step: 5,
        unit: "%",
        defaultValue: 60,
        mappingKey: "style_strength"
      }
    ],
    advancedFields: [
      {
        id: "preserveStructure",
        label: "保留构图",
        type: "boolean",
        defaultValue: true,
        mappingKey: "preserve_structure"
      }
    ],
    binding: {
      providerCapability: "style_transfer",
      version: "v1",
      hiddenWorkflowRef: "workflow://generate/style-transfer/v1",
      variableMap: {
        sourceImage: "source_image",
        style: "style_preset",
        strength: "style_strength",
        preserveStructure: "preserve_structure"
      }
    }
  }
];

export function getTemplateById(id: string) {
  return templates.find((template) => template.id === id);
}
