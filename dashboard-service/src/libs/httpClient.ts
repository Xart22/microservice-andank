// src/libs/httpClient.ts
import { request } from "undici";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface CallServiceOptions {
  serviceBaseUrl: string; // misal: process.env.USER_SERVICE_URL
  path: string; // misal: "/auth/login"
  method?: HttpMethod;
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
  body?: any; // object JSON
}

/**
 * Helper sederhana untuk call service lain dari gateway
 */
export async function callService<T = any>({
  serviceBaseUrl,
  path,
  method = "GET",
  headers = {},
  query,
  body,
}: CallServiceOptions): Promise<T> {
  const url = new URL(path, serviceBaseUrl);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const res = await request(url.toString(), {
    method,
    headers: {
      "content-type": body ? "application/json" : undefined,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const resBody = await res.body.text();
  const contentType = res.headers["content-type"] ?? "";

  let parsed: any = resBody;
  if (contentType.includes("application/json")) {
    try {
      parsed = JSON.parse(resBody);
    } catch (e) {
      // ignore
    }
  }

  if (res.statusCode >= 400) {
    const err: any = new Error("Service error");
    err.statusCode = res.statusCode;
    err.body = parsed;
    throw err;
  }

  return parsed as T;
}
