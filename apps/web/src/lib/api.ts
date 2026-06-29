export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  // Try to get token from localStorage if in browser
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("accessToken");
  }

  const headers = new Headers(options?.headers);
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(options?.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = "API Request Failed";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Ignored
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
