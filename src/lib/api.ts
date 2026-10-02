import type { ApiResponse } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

let accessTokenMemory: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessTokenMemory = token;
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("pulse_access_token", token);
    } else {
      localStorage.removeItem("pulse_access_token");
    }
  }
};

export const getAccessToken = (): string | null => {
  if (accessTokenMemory) return accessTokenMemory;
  if (typeof window !== "undefined") {
    accessTokenMemory = localStorage.getItem("pulse_access_token");
  }
  return accessTokenMemory;
};

export class ApiError extends Error {
  status: number;
  errors?: Array<{ field?: string; message: string }> | string[];

  constructor(
    message: string,
    status: number,
    errors?: Array<{ field?: string; message: string }> | string[]
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  skipAuthRefresh?: boolean;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, skipAuthRefresh, headers: customHeaders, ...customConfig } = options;

  let url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(customHeaders as Record<string, string>),
  };

  if (customConfig.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const config: RequestInit = {
    ...customConfig,
    headers,
    credentials: "include",
  };

  try {
    const res = await fetch(url, config);

    // Handle Token Refresh on 401 Unauthorized
    if (
      res.status === 401 &&
      !skipAuthRefresh &&
      !endpoint.includes("/auth/login") &&
      !endpoint.includes("/auth/refresh-token")
    ) {
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
          method: "POST",
          credentials: "include",
        });

        if (refreshRes.ok) {
          const refreshData = (await refreshRes.json()) as ApiResponse<{
            accessToken?: string;
            tokens?: { accessToken: string };
          }>;
          const newToken =
            refreshData.data?.accessToken ||
            refreshData.data?.tokens?.accessToken;
          if (newToken) {
            setAccessToken(newToken);
            return request<T>(endpoint, { ...options, skipAuthRefresh: true });
          }
        } else {
          setAccessToken(null);
        }
      } catch {
        setAccessToken(null);
      }
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMessage =
        data?.message || `Request failed with status code ${res.status}`;
      throw new ApiError(errorMessage, res.status, data?.errors);
    }

    // Preserve paginated envelope with meta if present
    if (data && typeof data === "object" && "meta" in data && "data" in data) {
      return data as T;
    }

    return (data?.data !== undefined ? data.data : data) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Network error occurred",
      500
    );
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
