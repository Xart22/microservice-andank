import { request } from "undici";
import { Readable } from "stream";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface CallServiceOptions {
  serviceBaseUrl: string;
  path: string;
  method?: HttpMethod;
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
  body?: any; // bisa JSON, stream, dsb
}

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

  const isStream =
    body &&
    (body instanceof Readable ||
      typeof (body as any).pipe === "function" ||
      typeof (body as any).on === "function");

  const isJsonBody = body && !isStream && typeof body === "object";

  const res = await request(url.toString(), {
    method,
    headers: {
      // kalau JSON, kita set content-type
      ...(isJsonBody ? { "content-type": "application/json" } : {}),
      // kalau stream (multipart), JANGAN set content-type di sini
      ...headers,
    },
    body: isJsonBody ? JSON.stringify(body) : body, // stream/raw langsung diteruskan
  });

  const text = await res.body.text();
  const contentType = res.headers["content-type"] ?? "";

  let parsed: any = text;
  if (contentType.includes("application/json")) {
    try {
      parsed = JSON.parse(text);
    } catch {
      // biarin aja text apa adanya
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
