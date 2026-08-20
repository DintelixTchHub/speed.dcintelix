import { useMutation, useQueryClient } from "@tanstack/react-query";

export const api = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
};

export function useRunSpeedTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const baseUrl = api.baseUrl || "";
      const response = await fetch(`${baseUrl}/api/speedtest/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Speed test failed");
      }

      const data = await response.json();
      return {
        testId: data.testId,
        server: data.server,
        latency: data.latency,
        downloadMbps: data.downloadMbps,
        uploadMbps: data.uploadMbps,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["speedTest"] });
    },
  });
}
