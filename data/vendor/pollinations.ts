/**
 * Toonflow AI供应商模板 - Pollinations (Free)
 * @version 2.0
 */

type VideoMode = "singleImage" | "startEndRequired" | "endFrameOptional" | "startFrameOptional" | "text" | (`videoReference:${number}` | `imageReference:${number}` | `audioReference:${number}`)[];

interface TextModel { name: string; modelName: string; type: "text"; think: boolean; }
interface ImageModel { name: string; modelName: string; type: "image"; mode: ("text" | "singleImage" | "multiReference")[]; associationSkills?: string; }
interface VideoModel { name: string; modelName: string; type: "video"; mode: VideoMode[]; associationSkills?: string; audio: "optional" | false | true; durationResolutionMap: { duration: number[]; resolution: string[] }[]; }
interface TTSModel { name: string; modelName: string; type: "tts"; voices: { title: string; voice: string }[]; }

interface VendorConfig {
  id: string;
  version: string;
  name: string;
  author: string;
  description?: string;
  icon?: string;
  inputs: { key: string; label: string; type: "text" | "password" | "url"; required: boolean; placeholder?: string }[];
  inputValues: Record<string, string>;
  models: (TextModel | ImageModel | VideoModel | TTSModel)[];
}

type ReferenceList =
  | { type: "image"; sourceType: "base64"; base64: string }
  | { type: "audio"; sourceType: "base64"; base64: string }
  | { type: "video"; sourceType: "base64"; base64: string };

interface ImageConfig {
  prompt: string;
  referenceList?: Extract<ReferenceList, { type: "image" }>[];
  size: "1K" | "2K" | "4K";
  aspectRatio: `${number}:${number}`;
}

interface VideoConfig { duration: number; resolution: string; aspectRatio: "16:9" | "9:16"; prompt: string; referenceList?: ReferenceList[]; audio?: boolean; mode: VideoMode[]; }
interface TTSConfig { text: string; voice: string; speechRate: number; pitchRate: number; volume: number; referenceList?: Extract<ReferenceList, { type: "audio" }>[]; }
interface PollResult { completed: boolean; data?: string; error?: string; }

declare const axios: any;
declare const logger: (msg: string) => void;
declare const jsonwebtoken: any;
declare const zipImage: (base64: string, size: number) => Promise<string>;
declare const zipImageResolution: (base64: string, w: number, h: number) => Promise<string>;
declare const mergeImages: (base64Arr: string[], maxSize?: string) => Promise<string>;
declare const urlToBase64: (url: string) => Promise<string>;
declare const pollTask: (fn: () => Promise<PollResult>, interval?: number, timeout?: number) => Promise<PollResult>;
declare const exports: any;

const vendor: VendorConfig = {
  id: "pollinations",
  version: "2.0",
  author: "Toonflow Community",
  name: "Pollinations (免费画图)",
  description: "## Pollinations.ai 免费绘画接口\n\n完全免费的生图接口，**无需任何 API Key**，支持高质量图片生成。",
  inputs: [],
  inputValues: {},
  models: [
    { 
      name: "Pollinations Flux", 
      modelName: "pollinations-flux", 
      type: "image", 
      mode: ["text"] 
    }
  ],
};

const textRequest = (model: TextModel) => {
  throw new Error("不支持文本模型");
};

const imageRequest = async (config: ImageConfig, model: ImageModel): Promise<string> => {
  logger("开始请求 Pollinations.ai 免费生图...");
  
  let width = 1024;
  let height = 1024;
  
  if (config.aspectRatio === "16:9") {
    width = 1280;
    height = 720;
  } else if (config.aspectRatio === "9:16") {
    width = 720;
    height = 1280;
  }
  
  if (config.size === "2K") {
    width = Math.floor(width * 1.5);
    height = Math.floor(height * 1.5);
  } else if (config.size === "4K") {
    width = Math.floor(width * 2);
    height = Math.floor(height * 2);
  }

  const encodedPrompt = encodeURIComponent(config.prompt);
  // 添加随机 seed 避免浏览器缓存
  const seed = Math.floor(Math.random() * 1000000);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&seed=${seed}`;
  
  logger(`请求URL: ${url}`);
  
  // urlToBase64 处理下载并转换
  const base64 = await urlToBase64(url);
  if (!base64) {
    throw new Error("图片生成失败，可能由于网络原因");
  }
  
  logger("图片生成成功");
  return base64;
};

const videoRequest = async (config: VideoConfig, model: VideoModel): Promise<string> => {
  return "";
};

const ttsRequest = async (config: TTSConfig, model: TTSModel): Promise<string> => {
  return "";
};

const checkForUpdates = async (): Promise<{ hasUpdate: boolean; latestVersion: string; notice: string }> => {
  return { hasUpdate: false, latestVersion: "2.0", notice: "## 无更新" };
};

const updateVendor = async (): Promise<string> => {
  return "";
};

exports.vendor = vendor;
exports.textRequest = textRequest;
exports.imageRequest = imageRequest;
exports.videoRequest = videoRequest;
exports.ttsRequest = ttsRequest;
exports.checkForUpdates = checkForUpdates;
exports.updateVendor = updateVendor;

export {};
