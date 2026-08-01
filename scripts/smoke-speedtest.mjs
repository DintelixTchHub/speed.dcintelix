import process from 'node:process';

const baseUrl = process.argv[2] || process.env.BASE_URL || 'http://localhost:3000';

async function fetchJson(url, init) {
  const response = await fetch(url, {
    cache: 'no-store',
    ...init,
  });

  const text = await response.text();
  let parsed = null;

  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = null;
  }

  return {
    ok: response.ok,
    status: response.status,
    headers: response.headers,
    text,
    json: parsed,
  };
}

async function main() {
  const checks = [];

  const ping = await fetch(baseUrl + '/api/ping?t=' + Date.now(), {
    method: 'HEAD',
    cache: 'no-store',
  });
  checks.push({ name: 'ping', ok: ping.ok, status: ping.status, headers: Object.fromEntries(ping.headers.entries()) });

  const download = await fetch(baseUrl + '/api/speedtest/download?_t=' + Date.now(), {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      Pragma: 'no-cache',
    },
  });
  const downloadBytes = Number(download.headers.get('content-length') || 0);
  checks.push({
    name: 'download',
    ok: download.ok,
    status: download.status,
    contentLength: downloadBytes,
    bytesRead: download.body ? 'streaming-body' : 'no-stream',
  });

  if (!download.ok || downloadBytes <= 0) {
    console.error('Download endpoint smoke check failed.');
    console.error(JSON.stringify(checks, null, 2));
    process.exit(1);
  }

  const uploadPayload = new Uint8Array(1024 * 1024);
  for (let i = 0; i < uploadPayload.length; i++) {
    uploadPayload[i] = i & 0xff;
  }

  const upload = await fetch(baseUrl + '/api/speedtest/upload', {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      Pragma: 'no-cache',
    },
    body: uploadPayload,
  });

  const uploadBody = await upload.text();
  checks.push({
    name: 'upload',
    ok: upload.ok,
    status: upload.status,
    body: uploadBody,
  });

  if (!upload.ok) {
    console.error('Upload endpoint smoke check failed.');
    console.error(JSON.stringify(checks, null, 2));
    process.exit(1);
  }

  console.log('Smoke check passed for ' + baseUrl);
  console.log(JSON.stringify(checks, null, 2));
}

main().catch((error) => {
  console.error('Smoke check crashed:', error);
  process.exit(1);
});
