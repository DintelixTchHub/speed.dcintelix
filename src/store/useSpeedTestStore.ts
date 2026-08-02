import { create } from "zustand";

export type TestStatus = "idle" | "initializing" | "detectingNetwork" | "selectingServer" | "ping" | "downloading" | "uploading" | "calculatingQuality" | "complete" | "error" | "retrying";

export interface SpeedResult {
  download: number;
  upload: number;
  ping: number;
  jitter: number;
  packetLoss?: number;
  qualityScore: number;
  timestamp: Date;
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

export interface ServerInfo {
  name: string;
  host: string;
  location: string;
}

interface SpeedTestState {
  status: TestStatus;
  progress: number;
  result: SpeedResult | null;
  error: string | null;
  testHistory: SpeedResult[];
  currentPhaseSpeed: number;
  isp: IPInfo | null;
  isDetectingISP: boolean;
  connectionType: string | null;
  selectedServer: ServerInfo | null;
  startTime: number | null;
  retryCount: number;
  advancedDetailsExpanded: boolean;
  startTest: () => void;
  stopTest: () => void;
  completeTest: (result: SpeedResult) => void;
  setError: (error: string) => void;
  resetTest: () => void;
  setStatus: (status: TestStatus) => void;
  setProgress: (progress: number) => void;
  setCurrentPhaseSpeed: (speed: number) => void;
  incrementRetryCount: () => void;
  resetRetryCount: () => void;
  setISP: (isp: IPInfo | null) => void;
  setDetectingISP: (isDetecting: boolean) => void;
  setConnectionType: (type: string | null) => void;
  setSelectedServer: (server: ServerInfo | null) => void;
  setAdvancedDetailsExpanded: (expanded: boolean) => void;
}

export const useSpeedTestStore = create<SpeedTestState>((set) => ({
  status: "idle",
  progress: 0,
  result: null,
  error: null,
  testHistory: [],
  currentPhaseSpeed: 0,
  isp: null,
  isDetectingISP: false,
  connectionType: null,
  selectedServer: null,
  startTime: null,
  retryCount: 0,
  advancedDetailsExpanded: false,

  startTest: () =>
    set({
      status: "initializing",
      progress: 0,
      result: null,
      error: null,
      currentPhaseSpeed: 0,
      isp: null,
      isDetectingISP: false,
      connectionType: null,
      selectedServer: null,
      startTime: Date.now(),
      retryCount: 0,
      advancedDetailsExpanded: false,
    }),

  stopTest: () =>
    set((state) => ({
      status: state.status === "complete" ? "complete" : "idle",
      progress: state.status === "complete" ? 100 : 0,
      isDetectingISP: false,
    })),

  completeTest: (result) =>
    set((state) => ({
      status: "complete",
      progress: 100,
      result,
      testHistory: [result, ...state.testHistory.slice(0, 9)],
      currentPhaseSpeed: result.download,
      isDetectingISP: false,
    })),

  setError: (error) =>
    set({
      status: "error",
      error,
      progress: 0,
      currentPhaseSpeed: 0,
      isDetectingISP: false,
    }),

  resetTest: () =>
    set({
      status: "idle",
      progress: 0,
      result: null,
      error: null,
      currentPhaseSpeed: 0,
      isp: null,
      isDetectingISP: false,
      connectionType: null,
      selectedServer: null,
      startTime: null,
      retryCount: 0,
      advancedDetailsExpanded: false,
    }),

  setStatus: (status) =>
    set({
      status,
    }),

  setProgress: (progress) =>
    set({
      progress,
    }),

  setCurrentPhaseSpeed: (speed) =>
    set({
      currentPhaseSpeed: speed,
    }),

  incrementRetryCount: () =>
    set((state) => ({
      retryCount: state.retryCount + 1,
    })),

  resetRetryCount: () =>
    set({
      retryCount: 0,
    }),

  setISP: (isp) =>
    set({
      isp,
    }),

  setDetectingISP: (isDetecting) =>
    set({
      isDetectingISP: isDetecting,
    }),

  setConnectionType: (connectionType) =>
    set({
      connectionType,
    }),

  setSelectedServer: (server) =>
    set({
      selectedServer: server,
    }),

  setAdvancedDetailsExpanded: (advancedDetailsExpanded) =>
    set({
      advancedDetailsExpanded,
    }),
}));
