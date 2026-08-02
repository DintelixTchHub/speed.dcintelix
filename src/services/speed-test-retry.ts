export interface RetryableMeasurement {
  download: number;
  upload: number;
  ping: number;
  jitter: number;
}

export function shouldRetryMeasurement(result: RetryableMeasurement, attempt: number): boolean {
  if (attempt >= 1) {
    return false;
  }

  const hasNoUsefulSignal = [result.download, result.upload, result.ping, result.jitter].some((value) => {
    return !Number.isFinite(value) || value <= 0;
  });

  return hasNoUsefulSignal || (result.download < 0.1 && result.upload < 0.1 && result.ping < 1);
}

export function getRetryMessage(attempt: number): string {
  if (attempt === 0) {
    return "The previous measurement was unstable, so I’m retrying with a fresh sample.";
  }

  return "The connection is still behaving inconsistently, so I’m giving it one more attempt.";
}
