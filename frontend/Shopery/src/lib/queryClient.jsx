import { QueryClient } from "@tanstack/react-query";

// Cấu hình QueryClient với các options tối ưu
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Thời gian cache mặc định: 5 phút
      staleTime: 5 * 60 * 1000,
      // Thời gian cache trong bộ nhớ: 10 phút
      gcTime: 10 * 60 * 1000,
      // Retry 3 lần khi lỗi
      retry: 5,
      // Không refetch khi window focus
      refetchOnWindowFocus: false,
      // Không refetch khi reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry 1 lần cho mutations
      retry: 2,
    },
  },
});

// Error handler global
queryClient.setMutationDefaults(["auth"], {
  onError: (error) => {
    console.error("Auth mutation error:", error);
  },
});

queryClient.setQueryDefaults(["auth"], {
  onError: (error) => {
    console.error("Auth query error:", error);
  },
});
