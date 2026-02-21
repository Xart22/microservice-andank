/**
 * ============================================================
 * K6 TEST 2: FAULT ISOLATION / CHAOS TEST
 * Repo: Xart22/microservice-andank
 *
 * Skenario: pemeliharaan-service:3002 di-stop
 *   → TS2 (user:3001)        harus tetap 100% UP
 *   → TS3 (laporan:3004)     harus tetap 100% UP
 *   → TS1 (pemeliharaan:3002) harus fail-fast 502/503
 *   → TS6/gateway (dashboard:3000 /gateway/sapulobang) harus 502/503
 *   → Cascade failures = 0
 *
 * LANGKAH:
 *   docker stop pemeliharaan-service
 *   k6 run test-fault-isolation.js
 * ============================================================
 */

import http from "k6/http";
import { check, group, sleep } from "k6";
import { Rate, Counter, Trend } from "k6/metrics";

const BASE = {
  user: "http://localhost:3001",
  pemeliharaan: "http://localhost:3002", // ← HARUS di-stop
  laporan: "http://localhost:3004",
  dashboard: "http://localhost:3000",
};

const CREDS = { email: "test1@example.com", password: "password1" };

const ts2AvailRate = new Rate("ts2_availability");
const ts3AvailRate = new Rate("ts3_availability");
const ts1FailFastRate = new Rate("ts1_failfast_502_503");
const gwFailFastRate = new Rate("gw_failfast_502_503"); // Gateway juga harus fail-fast
const cascadeCounter = new Counter("cascade_failure_count");
const ts1LatTrend = new Trend("ts1_failfast_latency_ms", true);

export const options = {
  scenarios: {
    // TS2 Login — 500 req (10 req/s × 50s)
    check_ts2: {
      executor: "constant-arrival-rate",
      rate: 10,
      timeUnit: "1s",
      duration: "50s",
      preAllocatedVUs: 15,
      maxVUs: 30,
      exec: "testTS2",
    },
    // TS1 harus FAIL-FAST — 500 req
    check_ts1: {
      executor: "constant-arrival-rate",
      rate: 10,
      timeUnit: "1s",
      duration: "50s",
      preAllocatedVUs: 15,
      maxVUs: 30,
      exec: "testTS1FailFast",
    },
    // TS3 harus tetap UP — 500 req
    check_ts3: {
      executor: "constant-arrival-rate",
      rate: 10,
      timeUnit: "1s",
      duration: "50s",
      preAllocatedVUs: 15,
      maxVUs: 30,
      exec: "testTS3",
    },
    // Gateway ke TS1 juga harus fail-fast
    check_gateway: {
      executor: "constant-arrival-rate",
      rate: 10,
      timeUnit: "1s",
      duration: "50s",
      preAllocatedVUs: 15,
      maxVUs: 30,
      exec: "testGatewayFailFast",
    },
  },
  thresholds: {
    ts2_availability: ["rate>=0.99"],
    ts3_availability: ["rate>=0.99"],
    ts1_failfast_502_503: ["rate>=0.95"],
    gw_failfast_502_503: ["rate>=0.95"],
    cascade_failure_count: ["count==0"],
    ts1_failfast_latency_ms: ["p(95)<300"],
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

// ── SCENARIO A: TS2 harus tetap UP ─────────────────────────
export function testTS2() {
  const res = http.post(`${BASE.user}/auth/login`, JSON.stringify(CREDS), {
    headers: { "Content-Type": "application/json" },
    tags: { name: "TS2_login_chaos" },
  });

  const ok = check(res, {
    "[TS2] Tetap UP (200) saat TS1 down": (r) => r.status === 200,
    "[TS2] Response < 1s": (r) => r.timings.duration < 1000,
  });
  ts2AvailRate.add(ok);

  if (res.status >= 500 && res.status !== 502 && res.status !== 503) {
    cascadeCounter.add(1);
    console.error(`🚨 CASCADE TS2! status=${res.status} body=${res.body}`);
  }
  sleep(0.1);
}

// ── SCENARIO B: TS1 harus FAIL-FAST ────────────────────────
export function testTS1FailFast() {
  const start = Date.now();
  const res = http.get(`${BASE.pemeliharaan}/sapulobang`, {
    timeout: "5s",
    tags: { name: "TS1_expected_failfast" },
  });
  const elapsed = Date.now() - start;
  ts1LatTrend.add(elapsed);

  const isFailFast =
    res.status === 502 || res.status === 503 || res.status === 0;
  ts1FailFastRate.add(isFailFast);

  check(res, {
    "[TS1] Mengembalikan 502/503": () => isFailFast,
    "[TS1] Fail-fast < 300ms": () => elapsed < 300,
  });

  if (res.status === 200) {
    console.warn(
      "⚠️  TS1 masih UP! Jalankan: docker stop pemeliharaan-service",
    );
  }
  sleep(0.1);
}

// ── SCENARIO C: TS3 harus tetap UP ─────────────────────────
export function testTS3() {
  // GET /laporan-masyarakat adalah public route (no auth needed)
  const res = http.get(`${BASE.laporan}/laporan-masyarakat`, {
    tags: { name: "TS3_laporan_chaos" },
  });

  const ok = check(res, {
    "[TS3] Tetap UP (200) saat TS1 down": (r) => r.status === 200,
    "[TS3] Response < 1s": (r) => r.timings.duration < 1000,
  });
  ts3AvailRate.add(ok);

  if (res.status >= 500 && res.status !== 502 && res.status !== 503) {
    cascadeCounter.add(1);
    console.error(`🚨 CASCADE TS3! status=${res.status} body=${res.body}`);
  }
  sleep(0.1);
}

// ── SCENARIO D: Gateway /gateway/sapulobang harus fail-fast ─
export function testGatewayFailFast() {
  const token = login();
  const start = Date.now();

  const res = http.get(`${BASE.dashboard}/gateway/sapulobang`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    timeout: "5s",
    tags: { name: "GW_sapulobang_failfast" },
  });
  const elapsed = Date.now() - start;

  const isFailFast =
    res.status === 502 || res.status === 503 || res.status === 0;
  gwFailFastRate.add(isFailFast);

  check(res, {
    "[GW] /gateway/sapulobang → 502/503 saat TS1 down": () => isFailFast,
    "[GW] Fail-fast < 500ms": () => elapsed < 500,
  });
  sleep(0.1);
}

export function handleSummary(data) {
  const ts2 = (
    (data.metrics.ts2_availability?.values?.rate ?? 0) * 100
  ).toFixed(1);
  const ts3 = (
    (data.metrics.ts3_availability?.values?.rate ?? 0) * 100
  ).toFixed(1);
  const ts1ff = (
    (data.metrics.ts1_failfast_502_503?.values?.rate ?? 0) * 100
  ).toFixed(1);
  const gwff = (
    (data.metrics.gw_failfast_502_503?.values?.rate ?? 0) * 100
  ).toFixed(1);
  const cas = data.metrics.cascade_failure_count?.values?.count ?? 0;
  const ffP95 = (
    data.metrics.ts1_failfast_latency_ms?.values?.["p(95)"] ?? 0
  ).toFixed(0);

  console.log("\n╔═══════════════════════════════════════════════════╗");
  console.log("║      FAULT ISOLATION TEST — SUMMARY               ║");
  console.log("╠═══════════════════════════════════════════════════╣");
  console.log(
    `║  [TS1] Fail-fast rate     : ${ts1ff.padEnd(7)}% (target ≥95%)  ║`,
  );
  console.log(
    `║  [TS1] Fail-fast P95      : ${ffP95.padEnd(7)}ms (target <300ms) ║`,
  );
  console.log(
    `║  [GW]  Gateway fail-fast  : ${gwff.padEnd(7)}% (target ≥95%)  ║`,
  );
  console.log(
    `║  [TS2] Availability       : ${ts2.padEnd(7)}% (target ≥99%)  ║`,
  );
  console.log(
    `║  [TS3] Availability       : ${ts3.padEnd(7)}% (target ≥99%)  ║`,
  );
  console.log(`║  [!!]  Cascade failures   : ${String(cas).padEnd(25)}║`);
  console.log("╚═══════════════════════════════════════════════════╝\n");

  const passed =
    parseFloat(ts2) >= 99 &&
    parseFloat(ts3) >= 99 &&
    parseFloat(ts1ff) >= 95 &&
    cas === 0;
  console.log(
    passed ? "✅ ALL THRESHOLDS PASSED" : "❌ SOME THRESHOLDS FAILED",
  );

  return { stdout: JSON.stringify(data, null, 2) };
}
