export function calculateDownloadMbps(bytes: number, elapsedMs: number): number {
  if (!bytes || !elapsedMs) return 0;

  const bitsPerSecond = (bytes * 8) / (elapsedMs / 1000);
  return Math.round((bitsPerSecond / (1024 * 1024)) * 10) / 10;
}

export function summarizeDownloadSpeeds(samples: number[], fallback: number): number {
  if (!samples.length) return fallback;

  const sorted = [...samples].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];

  const trimmed = sorted.filter((value) => value >= median * 0.5 && value <= median * 2);
  const finalValues = trimmed.length ? trimmed : sorted;

  const average = finalValues.reduce((sum, value) => sum + value, 0) / finalValues.length;
  return Math.round(average * 10) / 10;
}
