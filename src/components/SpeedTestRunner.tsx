"use client";

import { useEffect, useRef, useState } from "react";
import { MinimalGauge } from "@/components/MinimalGauge";
import { SpeedTestResults } from "@/components/SpeedTestResults";
import { useSpeedTestStore } from "@/store/useSpeedTestStore";
import { speedService } from "@/services/speed.service";
import { ispService } from "@/services/isp.service";
import { analyticsService } from "@/services/analytics.service";
import { getRetryMessage, shouldRetryMeasurement } from "@/services/speed-test-retry";

export function SpeedTestRunner() {
  const {
    status,
    currentPhaseSpeed,
    result,
    error,
    isp,
    connectionType,
    selectedServer,
    startTest,
    completeTest,
    resetTest,
    resetRetryCount,
    incrementRetryCount,
    setError,
    setISP,
    setConnectionType,
    setSelectedServer,
  } = useSpeedTestStore();

  const isRunning = ["initializing", "detectingNetwork", "selectingServer", "ping", "downloading", "uploading", "calculatingQuality", "retrying"].includes(status);
  const hasStartedRef = useRef(false);

  const displaySpeed = isRunning
    ? currentPhaseSpeed || 0
    : status === "complete" && result
      ? result.downloadMbps
      : 0;

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
        }

        useSpeedTestStore.getState().setStatus("detectingNetwork");

        const connectionTypeValue =
          (typeof navigator !== "undefined" && navigator.connection?.type) ||
          (typeof navigator !== "undefined" && navigator.connection?.effectiveType) ||
          null;
        if (connectionTypeValue) {
          setConnectionType(connectionTypeValue);
        }

        useSpeedTestStore.getState().setStatus("selectingServer");
        setSelectedServer({
          name: "Auto",
          host: "",
          location: "Auto-detected",
        });

        const detectedISPPromise = ispService.detectISP();

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

        const detectedISP = await detectedISPPromise;
        if (detectedISP) {
          setISP(detectedISP);
        }

        if (!shouldRetryMeasurement(testResult, attempt)) {
          useSpeedTestStore.getState().setStatus("calculatingQuality");

          const completedResult = testResult;

          completeTest(completedResult);

          const payload = {
            download: completedResult.downloadMbps,
            upload: completedResult.uploadMbps,
            ping: completedResult.latency,
            jitter: 0,
            packetLoss: null,
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
            server: completedResult.server?.name ?? null,
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
    <div className="flex flex-col items-center justify-center w-full max-w-3xl px-4 sm:px-6 mx-auto">
      <div className="w-full max-w-[220px] sm:max-w-[260px]">
        <MinimalGauge
          value={displaySpeed}
          maxValue={1000}
          unit="Mbps"
          label="Download"
          isRunning={isRunning}
          status={status}
          onClick={status === "complete" && !isRunning ? handleReset : undefined}
        />
      </div>
      {status === "complete" && result && (
        <SpeedTestResults
          result={result}
          isp={isp}
          connectionType={connectionType}
          selectedServer={selectedServer}
          className="mt-6"
        />
      )}
    </div>
  );
}
