"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { NeoButton } from "@/components/ui/NeoButton";
import { ResultsPanel } from "@/components/ResultsPanel";
import { SpeedGauge } from "@/components/SpeedGauge";
import { useSpeedTestStore } from "@/store/useSpeedTestStore";
import { speedService } from "@/services/speed.service";
import { ispService } from "@/services/isp.service";
import { Activity, Shield, Globe, Wifi, EthernetPortIcon, WifiOffIcon, CheckCircle2 } from "lucide-react";
import { analyticsService } from "@/services/analytics.service";
import { getRetryMessage, shouldRetryMeasurement } from "@/services/speed-test-retry";

const phaseConfig: Record<string, { label: string; color: string; description: string }> = {
  idle: { label: "Ready", color: "#ffffff", description: "Start the test to measure your connection" },
  initializing: { label: "Initializing...", color: "#00D9FF", description: "Preparing DCintelix Speed Test engine" },
  detectingNetwork: { label: "Detecting Network...", color: "#00D9FF", description: "Checking your network connection" },
  selectingServer: { label: "Selecting Best Server...", color: "#00FF88", description: "Finding the nearest server" },
  ping: { label: "Testing Latency...", color: "#00FF88", description: "Measuring ping and jitter" },
  downloading: { label: "Testing Download Speed...", color: "#00D9FF", description: "Measuring download throughput" },
  uploading: { label: "Testing Upload Speed...", color: "#FFC107", description: "Measuring upload throughput" },
  calculatingQuality: { label: "Calculating Network Quality...", color: "#00FF88", description: "Computing your network quality score" },
  retrying: { label: "Retrying Measurement...", color: "#FFC107", description: "The previous sample was unstable, so we are trying again" },
  complete: { label: "Complete", color: "#00FF88", description: "Test finished. Results below." },
  error: { label: "Error", color: "#FF3B30", description: "Something went wrong. Please try again." },
};

function formatConnectionType(type: string | null | undefined): string {
  if (!type) return "Unknown";
  const map: Record<string, string> = {
    wifi: "WiFi",
    ethernet: "Ethernet",
    cellular: "Cellular",
    bluetooth: "Bluetooth",
    wimax: "WiMAX",
    other: "Other",
    none: "None",
    unknown: "Unknown",
  };
  return map[type.toLowerCase()] || type;
}

function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-6"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-20 h-20 rounded-full border-4 border-brand border-t-transparent"
      />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-lg font-medium tracking-widest uppercase text-brand"
      >
        Initializing DCintelix Speed Test...
      </motion.p>
    </motion.div>
  );
}

export function SpeedTestRunner() {
  const {
    status,
    progress,
    currentPhaseSpeed,
    result,
    error,
    isp,
    isDetectingISP,
    connectionType,
    selectedServer,
    startTest,
    stopTest,
    completeTest,
    resetTest,
    retryCount,
    incrementRetryCount,
    resetRetryCount,
    setError,
    setISP,
    setConnectionType,
    setSelectedServer,
  } = useSpeedTestStore();

  const current = phaseConfig[status] || phaseConfig.idle;
  const isRunning = ["initializing", "detectingNetwork", "selectingServer", "ping", "downloading", "uploading", "calculatingQuality", "retrying"].includes(status);
  const hasStartedRef = useRef(false);

  const displaySpeed = isRunning
    ? currentPhaseSpeed || 0
    : status === "complete" && result
      ? result.download
      : 0;

  const gaugeLabel = isRunning
    ? current.label.replace("...", "").trim()
    : "Download";

  const ConnectionIcon = connectionType === "ethernet" ? EthernetPortIcon : Wifi;

  const [isOnline, setIsOnline] = useState(!!navigator?.onLine);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOnline(navigator.onLine);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (hasStartedRef.current) return;
    if (status !== "idle") return;
    hasStartedRef.current = true;
    runAutoTest();
  }, []);

  const runAutoTest = async () => {
    if (!navigator?.onLine) {
      setError("No network connection detected. Please check your internet connection.");
      return;
    }

    startTest();

    try {
      let attempt = 0;
      while (attempt < 2) {
        if (attempt > 0) {
          useSpeedTestStore.getState().setStatus("retrying");
          useSpeedTestStore.getState().setProgress(0);
          incrementRetryCount();
          await new Promise((resolve) => setTimeout(resolve, 1200));
        }

        await new Promise((resolve) => setTimeout(resolve, 1200));
        useSpeedTestStore.getState().setStatus("detectingNetwork");

        const connectionTypeValue =
          (typeof navigator !== "undefined" && navigator.connection?.type) ||
          (typeof navigator !== "undefined" && navigator.connection?.effectiveType) ||
          null;
        if (connectionTypeValue) {
          setConnectionType(connectionTypeValue);
        }

        await new Promise((resolve) => setTimeout(resolve, 800));

        useSpeedTestStore.getState().setStatus("selectingServer");
        setSelectedServer({
          name: "Auto",
          host: "",
          location: "Auto-detected",
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const detectedISP = await ispService.detectISP();
        if (detectedISP) {
          setISP(detectedISP);
        }

        useSpeedTestStore.getState().setStatus("ping");

        const testResult = await speedService.runTest(
          (phase, prog, data) => {
            useSpeedTestStore.getState().setStatus(phase);
            useSpeedTestStore.getState().setProgress(prog);
            if (data) {
              useSpeedTestStore.getState().setCurrentPhaseSpeed(data.instantaneousSpeed);
            }
          }
        );

        if (!shouldRetryMeasurement(testResult, attempt)) {
          useSpeedTestStore.getState().setStatus("calculatingQuality");
          await new Promise((resolve) => setTimeout(resolve, 800));

          const completedResult = {
            ...testResult,
            packetLoss: testResult.packetLoss ?? 0,
          };

          completeTest(completedResult);

          const payload = {
            download: completedResult.download,
            upload: completedResult.upload,
            ping: completedResult.ping,
            jitter: completedResult.jitter,
            packetLoss: completedResult.packetLoss,
            isp: isp?.isp ?? null,
            asn: isp?.connection?.asn ?? null,
            country: isp?.country ?? null,
            province: isp?.region ?? null,
            district: null,
            city: isp?.city ?? null,
            latitude: null,
            longitude: null,
            browser: typeof navigator !== "undefined" ? navigator.userAgent : null,
            operatingSystem: typeof navigator !== "undefined" ? navigator.platform : null,
            deviceType: typeof navigator !== "undefined" ? (/(tablet|ipad|android)/i.test(navigator.userAgent) ? "Tablet" : /(mobile|iphone|android)/i.test(navigator.userAgent) ? "Mobile" : "Desktop") : null,
            networkType: connectionType || null,
            server: selectedServer?.name ?? null,
            ipAddress: isp?.ip ?? null,
            timestamp: new Date().toISOString(),
          };

          try {
            await analyticsService.submitTest(payload);
          } catch (error) {
            console.warn("Analytics submission failed", error);
          }

          return;
        }

        attempt += 1;
        if (attempt < 2) {
          useSpeedTestStore.getState().setStatus("retrying");
          useSpeedTestStore.getState().setError(getRetryMessage(attempt - 1));
          await new Promise((resolve) => setTimeout(resolve, 900));
        }
      }

      setError("Test failed. Please try again.");
    } catch {
      setError("Test failed. Please try again.");
    }
  };

  const handleReset = () => {
    hasStartedRef.current = false;
    resetRetryCount();
    resetTest();
    runAutoTest();
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl px-4 sm:px-6 mx-auto">
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div className="relative w-full max-w-[420px] sm:max-w-[480px]">
          <SpeedGauge
            speed={displaySpeed}
            label={gaugeLabel}
            unit="Mbps"
            size="lg"
            color={isRunning && status === "uploading" ? "secondary" : "brand"}
          />

          <AnimatePresence>
            {isRunning && status !== "initializing" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              >
                <motion.div
                  className="w-16 h-16 rounded-full border-2 border-brand border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm font-medium tracking-widest uppercase" style={{ color: current.color }}>
            {current.label}
          </p>
          <p className="text-xs text-text-secondary mt-1">{current.description}</p>
        </motion.div>

        {isRunning && (
          <motion.div className="w-full max-w-md h-1 bg-glass-border rounded-full overflow-hidden mt-4">
            <motion.div
              className="h-full bg-gradient-to-r from-brand to-secondary"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {status === "initializing" && (
            <motion.div
              key="initializing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SplashScreen />
            </motion.div>
          )}

          {status === "retrying" && (
            <motion.div
              key="retrying"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 animate-pulse text-secondary" />
                <span className="text-sm font-medium tracking-widest uppercase text-secondary">
                  Retrying Measurement...
                </span>
              </div>
              <p className="text-xs text-text-secondary text-center max-w-md">
                {error || "The previous sample was unstable, so I’m trying again with a fresh measurement."}
              </p>
            </motion.div>
          )}

          {status === "detectingNetwork" && (
            <motion.div
              key="detectingNetwork"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 animate-pulse text-brand" />
                <span className="text-sm font-medium tracking-widest uppercase text-brand">
                  Detecting Network...
                </span>
              </div>
              {!isOnline && (
                <p className="text-xs text-error text-center max-w-md">
                  No network connection detected. Please check your internet connection.
                </p>
              )}
            </motion.div>
          )}

          {status === "selectingServer" && (
            <motion.div
              key="selectingServer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 animate-pulse text-brand" />
                <span className="text-sm font-medium tracking-widest uppercase text-brand">
                  Selecting Best Server...
                </span>
              </div>
              {selectedServer && (
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <CheckCircle2 className="w-3 h-3 text-brand" />
                  <span>{selectedServer.name} - {selectedServer.location}</span>
                </div>
              )}
            </motion.div>
          )}

          {isRunning && ["ping", "downloading", "uploading"].includes(status) && (
            <motion.div
              key="running"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 animate-spin text-brand" />
                <span className="text-sm font-medium tracking-widest uppercase" style={{ color: current.color }}>
                  {current.label}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                {isDetectingISP && !isp && (
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Globe className="w-3 h-3 animate-pulse text-secondary" />
                    <span>Detecting your ISP...</span>
                  </div>
                )}
                {isp && (
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Globe className="w-3 h-3 text-secondary" />
                    <span>{isp.isp}</span>
                  </div>
                )}
                {connectionType && (
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <ConnectionIcon className="w-3 h-3 text-secondary" />
                    <span>{formatConnectionType(connectionType)}</span>
                  </div>
                )}
              </div>
              <NeoButton onClick={stopTest} variant="secondary" size="sm">
                Stop Test
              </NeoButton>
            </motion.div>
          )}

          {status === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand" />
                <span className="text-sm font-medium text-brand">Test Complete</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                {isp && (
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Globe className="w-3 h-3 text-secondary" />
                    <span>ISP: {isp.isp}</span>
                  </div>
                )}
                {connectionType && (
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <ConnectionIcon className="w-3 h-3 text-secondary" />
                    <span>Connection: {formatConnectionType(connectionType)}</span>
                  </div>
                )}
              </div>
              <NeoButton onClick={handleReset} variant="outline" size="sm">
                Test Again
              </NeoButton>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex items-center gap-2">
                <WifiOffIcon className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-red-500">Check Connected Network</span>
              </div>
              <p className="text-xs text-text-secondary text-center max-w-md">
                {error || "Something went wrong. Please try again."}
              </p>
              <NeoButton onClick={handleReset} variant="outline" size="sm">
                Test Again
              </NeoButton>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <ResultsPanel />
    </div>
  );
}
