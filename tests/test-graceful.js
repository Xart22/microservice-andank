/**
 * ============================================================
 * K6 TEST 3: GRACEFUL DEGRADATION TEST
 * Repo: Xart22/microservice-andank
 *
 * Skenario: pemeliharaan-service:3002 di-stop
 *   → TS1 langsung → 502/503 dalam < 200ms (fail-fast)
 *   → Gateway /gateway/sapulobang → 502/503 dalam < 500ms
 *   → TS2, TS3, TS5 → tetap normal
 *
 * LANGKAH:
 *   docker stop pemeliharaan-service
 *   k6 run test-graceful-degradation.js
 * ============================================================
 */

import http from "k6/http";
import { check, group, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";

const BASE = {
  user: "http://localhost:3001",
  pemeliharaan: "http://localhost:3002", // ← HARUS di-stop
  laporan: "http://localhost:3004",
  rumija: "http://localhost:3005",
  dashboard: "http://localhost:3000",
};

const CREDS = { email: "test1@example.com", password: "password1" };

const degradeCorrect = new Rate("degradation_502_503_rate");
const degradeFast = new Rate("degradation_fast_rate");
const upstreamStable = new Rate("upstream_stable_rate");
const failFastLatency = new Trend("failfast_latency_ms", true);
const normalLatency = new Trend("healthy_svc_latency_ms", true);

export const options = {
  vus: 20,
  duration: "1m",
  thresholds: {
    degradation_502_503_rate: ["rate>=0.95"],
    degradation_fast_rate: ["rate>=0.90"],
    upstream_stable_rate: ["rate>=0.98"],
    failfast_latency_ms: ["p(95)<200"],
    healthy_svc_latency_ms: ["p(95)<1500"],
  },
};

function login() {
  const res = http.post(`${BASE.user}/auth/login`, JSON.stringify(CREDS), {
    headers: { "Content-Type": "application/json" },
    tags: { name: "login" },
  });
  if (res.status !== 200) return null;
  try {
    const b = res.json();
    return b.token ?? b.data?.token ?? b.access_token ?? b.accessToken ?? null;
  } catch {
    return null;
  }
}

export default function () {
  const token = login();
  const authH = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  // ── A: TS1 langsung → harus fail-fast ──────────────────
  group("TS1 — Direct Fail-Fast :3002/sapulobang", () => {
    const start = Date.now();
    const res = http.get(`${BASE.pemeliharaan}/sapulobang`, {
      ...authH,
      timeout: "5s",
      tags: { name: "ts1_direct_failfast" },
    });
    const elapsed = Date.now() - start;
    failFastLatency.add(elapsed);

    const is5xx = res.status === 502 || res.status === 503 || res.status === 0;
    const isFast = elapsed < 200;

    degradeCorrect.add(is5xx);
    degradeFast.add(is5xx && isFast);

    check(res, {
      "[TS1] Direct → 502/503": () => is5xx,
      "[TS1] Fail-fast < 200ms": () => isFast,
    });

    if (res.status === 200)
      console.warn(
        "⚠️  TS1 masih UP! Jalankan: docker stop pemeliharaan-service",
      );
  });

  // ── B: Gateway → harus fail-fast (proxy ke TS1 yang down)
  group("TS6 Gateway — Fail-Fast :3000/gateway/sapulobang", () => {
    const start = Date.now();
    const res = http.get(`${BASE.dashboard}/gateway/sapulobang`, {
      ...authH,
      timeout: "5s",
      tags: { name: "gw_failfast" },
    });
    const elapsed = Date.now() - start;

    const is5xx = res.status === 502 || res.status === 503 || res.status === 0;
    degradeCorrect.add(is5xx);
    degradeFast.add(is5xx && elapsed < 500);

    check(res, {
      "[GW] gateway/sapulobang → 502/503": () => is5xx,
      "[GW] Gateway fail-fast < 500ms": () => elapsed < 500,
    });
  });

  // ── C: TS2 harus tetap UP ──────────────────────────────
  group("TS2 — Tetap Operasional :3001", () => {
    const res = http.post(`${BASE.user}/auth/login`, JSON.stringify(CREDS), {
      headers: { "Content-Type": "application/json" },
      tags: { name: "ts2_up_check" },
    });
    normalLatency.add(res.timings.duration);
    upstreamStable.add(
      check(res, {
        "[TS2] Login tetap 200": (r) => r.status === 200,
      }),
    );
  });

  // ── D: TS3 Laporan harus tetap UP ──────────────────────
  group("TS3 — Tetap Operasional :3004/laporan-masyarakat", () => {
    // Public route, no auth needed
    const res = http.get(`${BASE.laporan}/laporan-masyarakat`, {
      tags: { name: "ts3_up_check" },
    });
    normalLatency.add(res.timings.duration);
    upstreamStable.add(
      check(res, {
        "[TS3] laporan-masyarakat tetap 200": (r) => r.status === 200,
      }),
    );
  });

  // ── E: TS5 Rumija harus tetap UP ───────────────────────
  group("TS5 — Tetap Operasional :3005/rumija", () => {
    // Public route, no auth needed
    const res = http.get(`${BASE.rumija}/rumija`, {
      tags: { name: "ts5_up_check" },
    });
    normalLatency.add(res.timings.duration);
    upstreamStable.add(
      check(res, {
        "[TS5] /rumija tetap 200": (r) => r.status === 200,
      }),
    );
  });

  sleep(0.5);
}

export function handleSummary(data) {
  const ffRate = (
    (data.metrics.degradation_502_503_rate?.values?.rate ?? 0) * 100
  ).toFixed(1);
  const fastRate = (
    (data.metrics.degradation_fast_rate?.values?.rate ?? 0) * 100
  ).toFixed(1);
  const upRate = (
    (data.metrics.upstream_stable_rate?.values?.rate ?? 0) * 100
  ).toFixed(1);
  const ffP95 = (
    data.metrics.failfast_latency_ms?.values?.["p(95)"] ?? 0
  ).toFixed(0);
  const normP95 = (
    data.metrics.healthy_svc_latency_ms?.values?.["p(95)"] ?? 0
  ).toFixed(0);

  console.log("\n╔═══════════════════════════════════════════════════════╗");
  console.log("║       GRACEFUL DEGRADATION TEST — SUMMARY             ║");
  console.log("╠═══════════════════════════════════════════════════════╣");
  console.log(
    `║  [TS1] 502/503 rate           : ${ffRate.padEnd(7)}% (target ≥95%) ║`,
  );
  console.log(
    `║  [TS1] Fail-fast <200ms rate  : ${fastRate.padEnd(7)}% (target ≥90%) ║`,
  );
  console.log(
    `║  [TS1] Fail-fast P95 latency  : ${ffP95.padEnd(7)}ms (target <200ms)║`,
  );
  console.log(
    `║  [UP]  Upstream stable rate   : ${upRate.padEnd(7)}% (target ≥98%) ║`,
  );
  console.log(
    `║  [UP]  Healthy svc P95        : ${normP95.padEnd(7)}ms (target <1500ms)║`,
  );
  console.log("╚═══════════════════════════════════════════════════════╝\n");

  return { stdout: JSON.stringify(data, null, 2) };
}
