export interface RetryableMeasurement {
  downloadMbps: number;
  uploadMbps: number;
  latency: number;
}

export function shouldRetryMeasurement(result: RetryableMeasurement, attempt: number): boolean {
  if (attempt >= 1) {
    return false;
  }

  const hasNoUsefulSignal = [result.downloadMbps, result.uploadMbps, result.latency].some((value) => {
    return !Number.isFinite(value) || value <= 0;
  });

  return hasNoUsefulSignal || (result.downloadMbps < 0.1 && result.uploadMbps < 0.1 && result.latency < 1);
}

export function getRetryMessage(attempt: number): string {
  if (attempt === 0) {
    return "The previous measurement was unstable, so I’m retrying with a fresh sample.";
  }

  return "The connection is still behaving inconsistently, so I’m giving it one more attempt.";
}
