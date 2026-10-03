export const backendApiBaseUrl = (
	process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_SPEEDTEST_API_URL || ""
).replace(/\/+$/, "");

export function backendApiUrl(path: string): string {
	return `${backendApiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}