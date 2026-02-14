import { request, FormData } from "undici";
import { Readable } from "stream";
import { Blob } from "buffer";

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

  const normalized = await normalizeRequestBody(body);
  const isStream =
    normalized.body &&
    (normalized.body instanceof Readable ||
      typeof (normalized.body as any).pipe === "function" ||
      typeof (normalized.body as any).on === "function");

  const isJsonBody =
    normalized.bodyType === "json" ||
    (normalized.bodyType === "raw" && isJsonLike(normalized.body) && !isStream);

  const res = await request(url.toString(), {
    method,
    headers: {
      // kalau JSON, kita set content-type
      ...(isJsonBody ? { "content-type": "application/json" } : {}),
      // kalau stream (multipart), JANGAN set content-type di sini
      ...headers,
    },
    body: isJsonBody ? JSON.stringify(normalized.body) : normalized.body, // stream/raw langsung diteruskan
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

type NormalizedBody =
  | { body: any; bodyType: "json" | "formdata" | "raw" }
  | { body: undefined; bodyType: "raw" };

async function normalizeRequestBody(body: any): Promise<NormalizedBody> {
  if (body == null) {
    return { body: undefined, bodyType: "raw" };
  }

  const multipart = await coerceFastifyMultipartBody(body);
  if (multipart) {
    return multipart;
  }

  return { body, bodyType: "raw" };
}

function isJsonLike(value: unknown): boolean {
  if (Array.isArray(value)) {
    return true;
  }

  return Object.prototype.toString.call(value) === "[object Object]";
}

async function coerceFastifyMultipartBody(
  body: any,
): Promise<NormalizedBody | null> {
  if (body == null || typeof body !== "object" || Array.isArray(body)) {
    return null;
  }

  const entries = Object.entries(body);
  if (entries.length === 0) {
    return null;
  }

  let hasMultipartField = false;
  let hasFile = false;
  const json: Record<string, any> = {};
  const form = new FormData();

  for (const [key, value] of entries) {
    const field = value as any;
    const looksLikeField = isFastifyMultipartField(field);

    if (looksLikeField) {
      hasMultipartField = true;
      if (field.file && typeof field.file.pipe === "function") {
        hasFile = true;
        const fileBlob = await toFileBlob(field);
        if (fileBlob) {
          form.append(key, fileBlob, field.filename ?? "upload");
        }
      } else if ("value" in field) {
        json[key] = field.value;
        form.append(key, String(field.value ?? ""));
      } else {
        json[key] = field;
        form.append(key, String(field ?? ""));
      }
      continue;
    }

    json[key] = value;
    form.append(key, String(value ?? ""));
  }

  if (!hasMultipartField) {
    return null;
  }

  if (hasFile) {
    return { body: form, bodyType: "formdata" };
  }

  return { body: json, bodyType: "json" };
}

async function toFileBlob(field: any): Promise<Blob | null> {
  const type =
    typeof field?.mimetype === "string"
      ? field.mimetype
      : "application/octet-stream";

  if (typeof field?.toBuffer === "function") {
    const buffer = await field.toBuffer();
    return new Blob([buffer], { type });
  }

  if (field?.file && typeof field.file.pipe === "function") {
    const buffer = await readStreamToBuffer(field.file);
    return new Blob([buffer], { type });
  }

  if (field instanceof Blob) {
    return field;
  }

  return null;
}

function readStreamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    stream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    stream.on("error", reject);
  });
}

function isFastifyMultipartField(field: any): boolean {
  if (!field || typeof field !== "object") {
    return false;
  }

  if (field.file && typeof field.file.pipe === "function") {
    return true;
  }

  if (field.type === "file" || field.type === "field") {
    return true;
  }

  if ("value" in field && "fields" in field) {
    return true;
  }

  if ("fieldname" in field && ("mimetype" in field || "encoding" in field)) {
    return true;
  }

  return false;
}
