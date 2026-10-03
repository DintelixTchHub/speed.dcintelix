import { backendApiUrl } from "../lib/backend-api";

export interface ISP {
  id: string;
  name: string;
  logo?: string;
  rating: number;
  country?: string | null;
  province?: string | null;
  city?: string | null;
  location?: string | null;
  networkType?: string | null;
  avgDownload: number;
  avgUpload: number;
  avgPing: number;
  users: number;
}

export interface ISPDetails extends ISP {
  servers: {
    id: string;
    name: string;
    location: string;
    distance: number;
  }[];
  plans: {
    name: string;
    speed: string;
    price: string;
  }[];
}

export interface IPInfo {
  ip: string;
  isp: string;
  org: string;
  country: string;
  countryCode: string;
  city: string;
  region: string;
  latitude: number | null;
  longitude: number | null;
  connection: {
    asn: number;
    org: string;
    isp: string;
    domain: string;
  };
}

export interface DeviceLocation {
  latitude: number;
  longitude: number;
}

async function fetchAPI(endpoint: string) {
  const response = await fetch(backendApiUrl(endpoint), {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export class ISPService {
  async detectDeviceLocation(): Promise<DeviceLocation | null> {
    if (typeof navigator === "undefined" || typeof window === "undefined" || !navigator.geolocation) {
      return null;
    }

    return new Promise((resolve) => {
      const timeout = window.setTimeout(() => resolve(null), 8000);
      const finish = (location: DeviceLocation | null) => {
        window.clearTimeout(timeout);
        resolve(location);
      };

      try {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => finish({
            latitude: Number(coords.latitude.toFixed(2)),
            longitude: Number(coords.longitude.toFixed(2)),
          }),
          () => finish(null),
          { enableHighAccuracy: false, maximumAge: 300000, timeout: 7000 },
        );
      } catch {
        finish(null);
      }
    });
  }

  async getISPDetails(id: string): Promise<ISPDetails> {
    return fetchAPI(`/api/isps/${encodeURIComponent(id)}`);
  }

  async getISPList(): Promise<ISP[]> {
    return fetchAPI(`/api/isps`);
  }

  async detectISP(): Promise<IPInfo | null> {
    try {
      const response = await fetch("https://ipwho.is/", {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        return null;
      }

      const responseData = await response.json();
      if (!responseData || typeof responseData !== "object" || responseData.success !== true) {
        return null;
      }

      const data = responseData.data && typeof responseData.data === "object"
        ? responseData.data
        : responseData;
      const connection = data.connection && typeof data.connection === "object"
        ? data.connection
        : {};
      const firstString = (...values: unknown[]) =>
        values.find((value): value is string => typeof value === "string" && value.trim().length > 0)?.trim() || "";
      const rawAsn = connection.asn ?? data.asn;
      const parsedAsn = typeof rawAsn === "number"
        ? rawAsn
        : Number.parseInt(String(rawAsn ?? "").replace(/^AS/i, ""), 10);

      const isp = firstString(connection.isp, connection.org, data.isp, data.org, data.organization);
      const country = firstString(data.country, data.country_name);
      const city = firstString(data.city, data.town);
      const region = firstString(data.region, data.region_name, data.regionName, data.province);
      const latitude = data.latitude ?? data.lat;
      const longitude = data.longitude ?? data.lon ?? data.lng;

      if (!isp && !country && !city && typeof latitude !== "number" && typeof longitude !== "number") {
        return null;
      }

      return {
        ip: data.ip || "",
        isp,
        org: firstString(connection.org, data.org, data.organization),
        country,
        countryCode: firstString(data.country_code, data.countryCode),
        city,
        region,
        latitude: typeof latitude === "number" ? latitude : null,
        longitude: typeof longitude === "number" ? longitude : null,
        connection: {
          asn: Number.isFinite(parsedAsn) ? parsedAsn : 0,
          org: firstString(connection.org, data.org, data.organization),
          isp,
          domain: firstString(connection.domain, data.domain),
        },
      };
    } catch {
      return null;
    }
  }
}

export const ispService = new ISPService();
