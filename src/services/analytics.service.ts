export interface AnalyticsData {
  dailyTests: { date: string; count: number }[];
  speedDistribution: { range: string; count: number }[];
  ispComparison: { name: string; download: number; upload: number }[];
  hourlyLoad: { hour: string; load: number }[];
  monthlyGrowth: { month: string; tests: number; users: number }[];
}

const API_BASE = "";

async function fetchAPI<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
    next: { revalidate: 0 },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export class AnalyticsService {
  async getDailyStats<T = Array<{ date: string; count: number }>>(days = 7): Promise<T> {
    return fetchAPI<T>(`/api/analytics/daily?days=${days}`);
  }

  async getSpeedDistribution<T = Array<{ range: string; count: number }>>(): Promise<T> {
    return fetchAPI<T>(`/api/analytics/distribution`);
  }

  async getISPComparison<T = Array<{ name: string; download: number; upload: number }>>(): Promise<T> {
    return fetchAPI<T>(`/api/analytics/isp-comparison`);
  }

  async getHourlyLoad<T = Array<{ hour: string; load: number }>>(): Promise<T> {
    return fetchAPI<T>(`/api/analytics/hourly`);
  }

  async getMonthlyGrowth<T = Array<{ month: string; tests: number; users: number }>>(): Promise<T> {
    return fetchAPI<T>(`/api/analytics/monthly`);
  }

  async getOverview(): Promise<{ totalTests: number; averageDownload: number; averageUpload: number; averagePing: number; averageJitter: number; averagePacketLoss: number; testsToday: number; activeISPs: number; countries: number; cities: number; }> {
    return fetchAPI<{ totalTests: number; averageDownload: number; averageUpload: number; averagePing: number; averageJitter: number; averagePacketLoss: number; testsToday: number; activeISPs: number; countries: number; cities: number; }>(`/api/analytics/overview`);
  }

  async getISPRankings(range = "30d"): Promise<Array<{ name: string; averageDownload: number; averageUpload: number; averagePing: number; averageJitter: number; packetLoss: number; tests: number; rank: number; trend: number }>> {
    return fetchAPI<Array<{ name: string; averageDownload: number; averageUpload: number; averagePing: number; averageJitter: number; packetLoss: number; tests: number; rank: number; trend: number }>>(`/api/analytics/isp-rankings?range=${encodeURIComponent(range)}`);
  }

  async getRegionalStats(): Promise<Array<{ country: string; province: string | null; district: string | null; city: string | null; averageDownload: number; averageUpload: number; averagePing: number; testCount: number }>> {
    return fetchAPI<Array<{ country: string; province: string | null; district: string | null; city: string | null; averageDownload: number; averageUpload: number; averagePing: number; testCount: number }>>(`/api/analytics/regional`);
  }

  async getDeviceStats<T = Array<{ name: string; value: number }>>(): Promise<T> {
    return fetchAPI<T>(`/api/analytics/devices`);
  }

  async getBrowserStats<T = Array<{ name: string; value: number }>>(): Promise<T> {
    return fetchAPI<T>(`/api/analytics/browsers`);
  }

  async getOperatingSystemStats<T = Array<{ name: string; value: number }>>(): Promise<T> {
    return fetchAPI<T>(`/api/analytics/operating-systems`);
  }

  async getRecentSpeedTests(limit = 10) {
    return fetchAPI(`/api/analytics/recent?limit=${limit}`);
  }

  async getHistoricalTrend(range: string): Promise<Array<{ date: string; download: number; upload: number; ping: number }>> {
    return fetchAPI<Array<{ date: string; download: number; upload: number; ping: number }>>(`/api/analytics/history?range=${encodeURIComponent(range)}`);
  }

  async submitTest(payload: Record<string, unknown>) {
    return fetchAPI(`/api/analytics/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }
}

export const analyticsService = new AnalyticsService();
