import test from "node:test";
import assert from "node:assert/strict";

import {
  hashIpAddress,
  normalizeBrowser,
  sanitizeLocation,
  roundCoordinate,
} from "./analytics";

test("hashIpAddress creates a stable sha-256 fingerprint", () => {
  const a = hashIpAddress("203.0.113.10");
  const b = hashIpAddress("203.0.113.10");
  assert.ok(a);
  assert.equal(a, b);
  assert.match(a!, /^[a-f0-9]{64}$/);
});

test("sanitizeLocation rounds coordinates and trims empty values", () => {
  const result = sanitizeLocation({
    country: " Rwanda ",
    province: "Kigali",
    district: "Gasabo",
    city: "Kigali",
    latitude: -1.949095,
    longitude: 30.05885,
  });

  assert.equal(result.country, "Rwanda");
  assert.equal(result.province, "Kigali");
  assert.equal(result.city, "Kigali");
  assert.equal(result.latitude, roundCoordinate(-1.949095));
  assert.equal(result.longitude, roundCoordinate(30.05885));
});

test("normalizeBrowser standardizes common browser labels", () => {
  assert.equal(normalizeBrowser("Chrome 127.0.0.0"), "Chrome");
  assert.equal(normalizeBrowser("Safari"), "Safari");
});
