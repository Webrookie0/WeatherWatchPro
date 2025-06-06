import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method,
  url,
  data,
) {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

export const getQueryFn = 
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0], {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

// Helper function to determine if a query should auto-refresh
const shouldAutoRefresh = (queryKey) => {
  // Auto-refresh weather-related endpoints
  if (typeof queryKey[0] === 'string' && queryKey[0].includes('/api/weather')) {
    return true;
  }
  return false;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: (query) => shouldAutoRefresh(query.queryKey) ? 10000 : false, // 10 seconds refresh for weather endpoints
      refetchOnWindowFocus: (query) => shouldAutoRefresh(query.queryKey),
      staleTime: (query) => shouldAutoRefresh(query.queryKey) ? 5000 : Infinity, // 5 seconds stale time for weather endpoints
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
