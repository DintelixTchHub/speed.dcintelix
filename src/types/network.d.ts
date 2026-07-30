export {};

declare global {
  interface Navigator {
    connection?: NetworkInformation;
  }

  interface NetworkInformation extends EventTarget {
    readonly downlink?: number;
    readonly effectiveType?: string;
    readonly rtt?: number;
    readonly saveData?: boolean;
    readonly type?: ConnectionType;
    onchange?: (event: Event) => void;
  }

  type ConnectionType = "bluetooth" | "cellular" | "ethernet" | "none" | "wifi" | "wimax" | "other" | "unknown";
}
