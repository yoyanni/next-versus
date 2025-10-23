const BASE_URL = process.env.NEXT_PUBLIC_API_URI;

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
};

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API request failed");
    }

    return await response.json();
  } catch (error) {
    // Optional: log error or transform it
    console.error(`API error on ${endpoint}:`, error);
    throw error;
  }
}

export const apiClient = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, data: any) =>
    request<T>(endpoint, { method: "POST", body: data }),
  put: <T>(endpoint: string, data: any) =>
    request<T>(endpoint, { method: "PUT", body: data }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};
