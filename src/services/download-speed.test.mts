import test from "node:test";
import assert from "node:assert/strict";

import { calculateDownloadMbps, summarizeDownloadSpeeds } from "./download-speed.ts";

test("calculateDownloadMbps converts bytes and elapsed time into Mbps", () => {
  const bytes = 4 * 1024 * 1024;
  const elapsedMs = 2000;

  assert.equal(calculateDownloadMbps(bytes, elapsedMs), 16);
});

test("summarizeDownloadSpeeds ignores outliers and keeps a stable median", () => {
  const result = summarizeDownloadSpeeds([5, 90, 8, 7, 88], 10);

  assert.equal(result, 6.7);
});
