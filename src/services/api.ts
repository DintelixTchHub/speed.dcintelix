import { useMutation, useQueryClient } from "@tanstack/react-query";
import { backendApiBaseUrl } from "../lib/backend-api";
import { analyticsService } from "./analytics.service";
import { speedService } from "./speed.service";

export const api = {
  baseUrl: backendApiBaseUrl,
};

export function useRunSpeedTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => speedService.runTest(() => undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["speedTest"] });
    },
  });
}

export function useSubmitAnalyticsTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      analyticsService.submitTest(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["analytics"] }),
        queryClient.invalidateQueries({ queryKey: ["isps"] }),
      ]);
    },
  });
}
