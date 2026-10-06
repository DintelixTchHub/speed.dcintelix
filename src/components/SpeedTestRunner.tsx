"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { MinimalGauge } from "@/components/MinimalGauge";
import { SpeedTestResults } from "@/components/SpeedTestResults";
import { AdvancedDetails } from "@/components/AdvancedDetails";
import { useSpeedTestStore } from "@/store/useSpeedTestStore";
import { speedService } from "@/services/speed.service";
import { ispService } from "@/services/isp.service";
import { useSubmitAnalyticsTest } from "@/services/api";

export function SpeedTestRunner() {
  const router = useRouter();
  const { mutateAsync: submitAnalytics } = useSubmitAnalyticsTest();
  const {
    status,
    currentPhaseSpeed,
    result,
    isp,
    connectionType,
    selectedServer,
    advancedDetailsExpanded,
    startTest,
    completeTest,
    resetTest,
    resetRetryCount,
    setError,
    setISP,
    setConnectionType,
    setSelectedServer,
    setAdvancedDetailsExpanded,
  } = useSpeedTestStore();

  const isRunning = ["initializing", "detectingNetwork", "selectingServer", "ping", "downloading", "uploading", "calculatingQuality", "retrying"].includes(status);
  const hasStartedRef = useRef(false);

  const displaySpeed = isRunning
    ? currentPhaseSpeed || 0
    : status === "complete" && result
      ? result.downloadMbps
      : 0;

  const runAutoTest = useCallback(async () => {
    if (!navigator?.onLine) {
      setError("No network connection detected. Please check your internet connection.");
      return;
    }

    startTest();

    try {
      useSpeedTestStore.getState().setStatus("detectingNetwork");

      const reportedConnectionType = typeof navigator !== "undefined"
        ? navigator.connection?.type
        : null;
      const connectionTypeValue = reportedConnectionType &&
        !["unknown", "none", "other"].includes(reportedConnectionType.toLowerCase())
        ? reportedConnectionType
        : typeof navigator !== "undefined"
          ? navigator.connection?.effectiveType || null
          : null;
      setConnectionType(connectionTypeValue);

      useSpeedTestStore.getState().setStatus("selectingServer");
      setSelectedServer({
        name: "Auto",
        host: "",
        location: "Auto-detected",
      });

      const detectedISPPromise = ispService.detectISP();
      const detectedDeviceLocationPromise = ispService.detectDeviceLocation();

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

      const [detectedISP, detectedDeviceLocation] = await Promise.all([
        detectedISPPromise,
        detectedDeviceLocationPromise,
      ]);
      if (detectedISP) {
        setISP(detectedISP);
      }

      useSpeedTestStore.getState().setStatus("calculatingQuality");

      const completedResult = testResult;

      completeTest(completedResult);
      router.push(`/result/${encodeURIComponent(completedResult.testId)}`);

      const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
      const deviceType = /ipad|tablet/i.test(userAgent) || (/android/i.test(userAgent) && !/mobile/i.test(userAgent))
        ? "Tablet"
        : /mobile|iphone|ipod|android/i.test(userAgent)
          ? "Mobile"
          : userAgent
            ? "Desktop"
            : null;
      const operatingSystem = /windows/i.test(userAgent)
        ? "Windows"
        : /android/i.test(userAgent)
          ? "Android"
          : /iphone|ipad|ipod/i.test(userAgent)
            ? "iOS"
            : /mac os/i.test(userAgent)
              ? "macOS"
              : /linux/i.test(userAgent)
                ? "Linux"
                : null;

      const payload = {
        download: completedResult.downloadMbps,
        upload: completedResult.uploadMbps,
        ping: completedResult.latency,
        jitter: completedResult.jitter,
        packetLoss: null,
        isp: detectedISP?.isp?.trim() || detectedISP?.org?.trim() || null,
        asn: detectedISP?.connection?.asn || null,
        country: detectedISP?.country ?? null,
        province: detectedISP?.region ?? null,
        district: null,
        city: detectedISP?.city ?? null,
        latitude: detectedDeviceLocation?.latitude ?? detectedISP?.latitude ?? null,
        longitude: detectedDeviceLocation?.longitude ?? detectedISP?.longitude ?? null,
        browser: userAgent || null,
        operatingSystem,
        deviceType,
        networkType: connectionTypeValue || null,
        server: completedResult.server?.name ?? null,
        timestamp: new Date().toISOString(),
      };

      try {
        await submitAnalytics(payload);
      } catch (error) {
        console.warn("Analytics submission failed", error);
      }
    } catch {
      setError("Test failed. Please try again.");
    }
  }, [completeTest, router, setConnectionType, setError, setISP, setSelectedServer, startTest, submitAnalytics]);

  useEffect(() => {
    if (hasStartedRef.current || status !== "idle") return;
    hasStartedRef.current = true;
    runAutoTest();
  }, [runAutoTest, status]);

  const handleToggleAdvancedDetails = () => {
    const nextExpanded = !advancedDetailsExpanded;
    setAdvancedDetailsExpanded(nextExpanded);
    if (nextExpanded) {
      document.getElementById("advanced-details")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleRetest = () => {
    hasStartedRef.current = true;
    useSpeedTestStore.getState().resetTest();
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
          onClick={status === "complete" ? handleRetest : undefined}
        />
      </div>
      {status === "complete" && result && (
        <div id="speed-test-results" className="w-full scroll-mt-6">
          <SpeedTestResults
            result={result}
            isp={isp}
            connectionType={connectionType}
            selectedServer={selectedServer}
            className="mt-6"
          />
        </div>
      )}
      {status === "complete" && result && (
        <>
          <button
            type="button"
            aria-expanded={advancedDetailsExpanded}
            aria-controls="advanced-details"
            onClick={handleToggleAdvancedDetails}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-brand/40 px-4 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand/10"
          >
            <FileText className="h-4 w-4" />
            {advancedDetailsExpanded ? "Hide advanced" : "View advanced"}
          </button>
          <div className="mt-4 w-full">
            <AdvancedDetails />
          </div>
        </>
      )}
    </div>
  );
}
