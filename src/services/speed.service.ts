import { SpeedResult } from "@/store/useSpeedTestStore";

export interface SpeedTestConfig {
  duration: number;
  server: {
    name: string;
    host: string;
    location: string;
  };
  downloadTestUrl: string;
  uploadTestUrl: string;
  pingTestUrl: string;
}

const DEFAULT_CONFIG: SpeedTestConfig = {
  duration: 30,
  server: {
    name: "Local Server",
    host: "",
    location: "Local",
  },
  downloadTestUrl: process.env.NEXT_PUBLIC_DOWNLOAD_TEST_URL || "/api/speedtest/download",
  uploadTestUrl: process.env.NEXT_PUBLIC_UPLOAD_TEST_URL || "/api/speedtest/upload",
  pingTestUrl: "/api/ping",
};

export interface SpeedProgress {
  progress: number;
  averageSpeed: number;
  instantaneousSpeed: number;
}

export interface QualityScoreThresholds {
  downloadMaxMbps: number;
  uploadMaxMbps: number;
  pingMsPerPoint: number;
  jitterMsPerPoint: number;
}

const DEFAULT_THRESHOLDS: QualityScoreThresholds = {
  downloadMaxMbps: 200,
  uploadMaxMbps: 50,
  pingMsPerPoint: 5,
  jitterMsPerPoint: 3,
};

export function calculateNetworkQualityScore(
  download: number,
  upload: number,
  ping: number,
  jitter: number,
  thresholds: QualityScoreThresholds = DEFAULT_THRESHOLDS
): number {
  const dlScore = Math.min((download / thresholds.downloadMaxMbps) * 40, 40);
  const ulScore = Math.min((upload / thresholds.uploadMaxMbps) * 25, 25);
  const pingScore = Math.max(0, 20 - ping / thresholds.pingMsPerPoint);
  const jitterScore = Math.max(0, 15 - jitter * thresholds.jitterMsPerPoint);
  const score = dlScore + ulScore + pingScore + jitterScore;
  return Math.round(Math.min(Math.max(score, 0), 100));
}

export class SpeedService {
  private config: SpeedTestConfig;
  private abortController: AbortController | null = null;

  constructor(config: Partial<SpeedTestConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async runTest(
    onProgress: (
      phase: "ping" | "downloading" | "uploading",
      progress: number,
      data?: { averageSpeed: number; instantaneousSpeed: number }
    ) => void,
    signal?: AbortSignal
  ): Promise<SpeedResult> {
    this.abortController = new AbortController();
    const currentSignal = signal || this.abortController.signal;

    try {
      onProgress("ping", 0);
      const { ping, jitter } = await this.measurePing(currentSignal);
      onProgress("ping", 100);

      onProgress("downloading", 0, { averageSpeed: 0, instantaneousSpeed: 0 });
      const downloadSpeed = await this.measureDownloadSpeed(currentSignal, (p, avg, instant) => {
        onProgress("downloading", p, { averageSpeed: avg, instantaneousSpeed: instant });
      });
      onProgress("downloading", 100, { averageSpeed: downloadSpeed, instantaneousSpeed: downloadSpeed });

      onProgress("uploading", 0, { averageSpeed: 0, instantaneousSpeed: 0 });
      const uploadSpeed = await this.measureUploadSpeed(currentSignal, (p, avg, instant) => {
        onProgress("uploading", p, { averageSpeed: avg, instantaneousSpeed: instant });
      });
      onProgress("uploading", 100, { averageSpeed: uploadSpeed, instantaneousSpeed: uploadSpeed });

      return {
        download: downloadSpeed,
        upload: uploadSpeed,
        ping,
        jitter,
        qualityScore: calculateNetworkQualityScore(downloadSpeed, uploadSpeed, ping, jitter),
        timestamp: new Date(),
      };
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        throw new Error("Test aborted");
      }
      throw error;
    }
  }

  abort() {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  private async measurePing(signal?: AbortSignal): Promise<{ ping: number; jitter: number }> {
    const samples: number[] = [];
    const count = 5;

    for (let i = 0; i < count; i++) {
      const start = performance.now();
      try {
        await fetch(`${this.config.pingTestUrl}?t=${Date.now()}_${i}`, {
          method: "HEAD",
          cache: "no-store",
          signal,
        });
        const end = performance.now();
        samples.push(end - start);
      } catch {
        // ignore single ping errors
      }
      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    }

    const pingValues = samples.length ? samples : [0];
    const ping = Math.round(pingValues.reduce((a, b) => a + b, 0) / pingValues.length);
    const jitter =
      pingValues.length > 1
        ? Math.round(
            pingValues
              .slice(1)
              .map((v) => Math.abs(v - pingValues[pingValues.length - 2]))
              .reduce((a, b) => a + b, 0) /
              (pingValues.length - 1) *
              10
          ) / 10
        : 0;

    return { ping, jitter };
  }

  private async measureDownloadSpeed(
    signal?: AbortSignal,
    onProgress?: (progress: number, averageSpeed: number, instantaneousSpeed: number) => void
  ): Promise<number> {
    const testUrl = this.config.downloadTestUrl;
    if (!testUrl) return 0;

    const startTime = performance.now();
    const speeds: number[] = [];
    let lastTime = startTime;
    let lastBytes = 0;
    let smoothedInstantSpeed = 0;
    const smoothingFactor = 0.35;

    try {
      const url = new URL(testUrl, typeof window !== "undefined" ? window.location.origin : "http://localhost");
      url.searchParams.set("_t", String(Date.now()));
      return await new Promise<number>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url.toString(), true);
        xhr.setRequestHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        xhr.setRequestHeader("Pragma", "no-cache");
        xhr.responseType = "arraybuffer";

        if (signal) {
          const abort = () => {
            xhr.abort();
          };
          signal.addEventListener("abort", abort, { once: true });
          (xhr as XMLHttpRequest & { _abort: () => void })._abort = abort;
        }

        let loadedBytes = 0;

        xhr.onprogress = (event) => {
          if (signal?.aborted) return;

          loadedBytes = event.loaded;
          const now = performance.now();
          const elapsed = now - lastTime;
          const totalBytes = event.total || loadedBytes || 1;

          if (event.lengthComputable || elapsed >= 250 || loadedBytes >= totalBytes) {
            const delta = Math.max(loadedBytes - lastBytes, 0);
            const instantMbps = delta > 0 ? this.bytesDeltaToMbps(delta, elapsed || 250) : 0;
            if (delta > 0) {
              speeds.push(instantMbps);
            }

            const avgMbps = speeds.length ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;
            smoothedInstantSpeed =
              smoothedInstantSpeed === 0
                ? instantMbps
                : smoothingFactor * instantMbps + (1 - smoothingFactor) * smoothedInstantSpeed;

            const progress = event.lengthComputable
              ? Math.min((loadedBytes / totalBytes) * 100, 100)
              : 0;

            onProgress?.(progress, avgMbps, smoothedInstantSpeed);
            lastTime = now;
            lastBytes = loadedBytes;
          }
        };

        xhr.onload = () => {
          const typedXhr = xhr as XMLHttpRequest & { _abort?: () => void };
          typedXhr._abort?.();
          const totalSec = (performance.now() - startTime) / 1000;
          const finalLoaded = loadedBytes || (xhr.response?.byteLength || 0) || 0;
          const rounded =
            totalSec > 0 && finalLoaded > 0
              ? Math.round(((finalLoaded * 8) / (1024 * 1024 * totalSec)) * 10) / 10
              : speeds.length
                ? Math.round((speeds.reduce((a, b) => a + b, 0) / speeds.length) * 10) / 10
                : 0;

          onProgress?.(100, rounded, rounded);
          resolve(rounded);
        };

        xhr.onerror = () => {
          const typedXhr = xhr as XMLHttpRequest & { _abort?: () => void };
          typedXhr._abort?.();
          reject(new Error("Download failed"));
        };

        xhr.onabort = () => {
          const typedXhr = xhr as XMLHttpRequest & { _abort?: () => void };
          typedXhr._abort?.();
          reject(new DOMException("Aborted", "AbortError"));
        };

        xhr.send();
      });
    } catch (error) {
      if ((error as Error).name === "AbortError") throw error;
      return 0;
    }
  }

  private async measureUploadSpeed(
    signal?: AbortSignal,
    onProgress?: (progress: number, averageSpeed: number, instantaneousSpeed: number) => void
  ): Promise<number> {
    const uploadUrl = this.config.uploadTestUrl;
    if (!uploadUrl) {
      return 0;
    }

    const dataSize = 4 * 1024 * 1024;
    const payload = new Uint8Array(dataSize);
    for (let i = 0; i < dataSize; i++) {
      payload[i] = i & 0xff;
    }
    const startTime = performance.now();

    try {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", "application/octet-stream");
        xhr.setRequestHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        xhr.setRequestHeader("Pragma", "no-cache");
        xhr.responseType = "text";

        let uploadedBytes = 0;
        const speeds: number[] = [];
        let lastTime = startTime;
        let lastBytes = 0;
        let smoothedInstantSpeed = 0;
        const smoothingFactor = 0.35;

        xhr.upload.onprogress = (event) => {
          if (signal?.aborted) {
            xhr.abort();
            return;
          }

          uploadedBytes = event.loaded || payload.byteLength;
          const now = performance.now();
          const elapsed = now - lastTime;
          const totalBytes = event.total || payload.byteLength;

          if (event.lengthComputable || elapsed >= 250 || uploadedBytes >= totalBytes) {
            const bytesDelta = Math.max(uploadedBytes - lastBytes, 0);
            const instantMbps = bytesDelta > 0 ? this.bytesDeltaToMbps(bytesDelta, elapsed || 250) : 0;
            if (bytesDelta > 0) {
              speeds.push(instantMbps);
            }

            const avgMbps = speeds.length ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;
            smoothedInstantSpeed =
              smoothedInstantSpeed === 0
                ? instantMbps
                : smoothingFactor * instantMbps + (1 - smoothingFactor) * smoothedInstantSpeed;
            const progress = Math.min((uploadedBytes / totalBytes) * 100, 100);

            onProgress?.(progress, avgMbps, smoothedInstantSpeed);

            lastTime = now;
            lastBytes = uploadedBytes;
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.onabort = () => reject(new DOMException("Aborted", "AbortError"));

        if (signal) {
          const abortHandler = () => {
            xhr.abort();
          };
          signal.addEventListener("abort", abortHandler);
        }

        xhr.send(payload);
      });

      const totalTimeSec = (performance.now() - startTime) / 1000;
      if (totalTimeSec > 0) {
        const bitsPerSecond = (dataSize * 8) / totalTimeSec;
        const mbps = bitsPerSecond / (1024 * 1024);
        return Math.round(mbps * 10) / 10;
      }

      return 0;
    } catch (error) {
      if ((error as Error).name === "AbortError") throw error;
      onProgress?.(100, 0, 0);
      return 0;
    }
  }

  private bytesDeltaToMbps(bytesDelta: number, elapsedMs: number): number {
    const bitsPerSecond = (bytesDelta * 8) / (elapsedMs / 1000);
    return Math.round((bitsPerSecond / (1024 * 1024)) * 10) / 10;
  }
}

export const speedService = new SpeedService();
