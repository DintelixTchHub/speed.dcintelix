export interface AnalyticsData {
  dailyTests: { date: string; count: number }[];
  speedDistribution: { range: string; count: number }[];
  ispComparison: { name: string; download: number; upload: number }[];
  hourlyLoad: { hour: string; load: number }[];
  monthlyGrowth: { month: string; tests: number; users: number }[];
}

const API_BASE = "";

async function fetchAPI(endpoint: string) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export class AnalyticsService {
  async getDailyStats(days = 7) {
    return fetchAPI(`/api/analytics/daily?days=${days}`);
  }

  async getSpeedDistribution() {
    return fetchAPI(`/api/analytics/distribution`);
  }

  async getISPComparison() {
    return fetchAPI(`/api/analytics/isp-comparison`);
  }

  async getHourlyLoad() {
    return fetchAPI(`/api/analytics/hourly`);
  }

  async getMonthlyGrowth() {
    return fetchAPI(`/api/analytics/monthly`);
  }
}

export const analyticsService = new AnalyticsService();
