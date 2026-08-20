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
  connection: {
    asn: number;
    org: string;
    isp: string;
    domain: string;
  };
}

const API_BASE = "";

async function fetchAPI(endpoint: string) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export class ISPService {
  async getISPDetails(id: string): Promise<ISPDetails> {
    return fetchAPI(`/api/isps/${encodeURIComponent(id)}`);
  }

  async getISPList(): Promise<ISP[]> {
    return fetchAPI(`/api/isps`);
  }

  async detectISP(): Promise<IPInfo | null> {
    try {
      const response = await fetch("//ipwho.is/", {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      if (!data.success) {
        return null;
      }

      return {
        ip: data.ip || "",
        isp: data.connection?.isp || "",
        org: data.connection?.org || "",
        country: data.country || "",
        countryCode: data.country_code || "",
        city: data.city || "",
        region: data.region || "",
        connection: {
          asn: data.connection?.asn || 0,
          org: data.connection?.org || "",
          isp: data.connection?.isp || "",
          domain: data.connection?.domain || "",
        },
      };
    } catch {
      return null;
    }
  }
}

export const ispService = new ISPService();
