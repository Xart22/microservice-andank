/**
 * ============================================================
 * K6 TEST 5: LOAD / STABILITY TEST
 * Repo: Xart22/microservice-andank
 *
 * Endpoint AKURAT dari source code:
 *   POST /auth/login             → user:3001
 *   GET  /sapulobang             → pemeliharaan:3002
 *   GET  /sapulobang/all         → pemeliharaan:3002
 *   GET  /kegiatan-rutin         → pemeliharaan:3002
 *   GET  /data-umum              → talikuat:3003
 *   GET  /laporan-masyarakat     → laporan:3004 (public)
 *   GET  /jenis-laporan          → laporan:3004 (public)
 *   GET  /rumija                 → rumija:3005  (public)
 *   GET  /gateway/sapulobang     → dashboard:3000 (→ proxy TS1)
 *   GET  /gateway/kegiatan-rutin → dashboard:3000 (→ proxy TS1)
 *   GET  /ruas                   → dashboard:3000
 *   GET  /sup                    → dashboard:3000
 *
 * RUN: k6 run test-stability.js
 * ============================================================
 */

import http from "k6/http";
import { check, group, sleep } from "k6";
import { Rate, Trend, Counter } from "k6/metrics";

const BASE = {
  dashboard: "http://localhost:3000",
  user: "http://localhost:3001",
  pemeliharaan: "http://localhost:3002",
  talikuat: "http://localhost:3003",
  laporan: "http://localhost:3004",
  rumija: "http://localhost:3005",
};

const CREDS = { email: "test1@example.com", password: "password1" };

// ── Custom Metrics ──────────────────────────────────────────
const errorRate = new Rate("error_rate");
const authSuccessRate = new Rate("auth_success_rate");
const ts1Lat = new Trend("ts1_pemeliharaan_ms", true);
const ts2Lat = new Trend("ts2_user_ms", true);
const ts3Lat = new Trend("ts3_laporan_ms", true);
const ts4Lat = new Trend("ts4_talikuat_ms", true);
const ts5Lat = new Trend("ts5_rumija_ms", true);
const ts6Lat = new Trend("ts6_dashboard_ms", true);
const totalReqs = new Counter("total_requests");

// ── Options: Warm → Steady → Spike → Normal → Cool ─────────
export const options = {
  stages: [
    { duration: "30s", target: 20 }, // Warm-up
    { duration: "1m", target: 20 }, // Steady state
    { duration: "30s", target: 500 }, // Spike
    { duration: "1m", target: 20 }, // Kembali normal
    { duration: "30s", target: 0 }, // Cool-down
  ],
  thresholds: {
    error_rate: ["rate<0.05"],
    auth_success_rate: ["rate>=0.95"],
    http_req_failed: ["rate<0.05"],
    ts1_pemeliharaan_ms: ["p(95)<1500"],
    ts2_user_ms: ["p(95)<500"],
    ts3_laporan_ms: ["p(95)<1500"],
    ts4_talikuat_ms: ["p(95)<1500"],
    ts5_rumija_ms: ["p(95)<1500"],
    ts6_dashboard_ms: ["p(95)<2000"],
    http_req_duration: ["p(99)<3000"],
  },
};

// ── Helper ──────────────────────────────────────────────────
function login() {
  const res = http.post(`${BASE.user}/auth/login`, JSON.stringify(CREDS), {
    headers: { "Content-Type": "application/json" },
    tags: { name: "ts2_login" },
  });
  ts2Lat.add(res.timings.duration);
  totalReqs.add(1);

  const ok = check(res, {
    "[TS2] POST /auth/login → 200": (r) => r.status === 200,
  });
  authSuccessRate.add(ok);
  errorRate.add(!ok);
  if (!ok) return null;

  try {
    const b = res.json();
    return b.token ?? b.data?.token ?? b.access_token ?? b.accessToken ?? null;
  } catch {
    return null;
  }
}

// ── Main ────────────────────────────────────────────────────
export default function () {
  // STEP 1: Login (TS2)
  let token = null;
  group("TS2 — Authentication", () => {
    token = login();
  });
  if (!token) {
    sleep(1);
    return;
  }

  const h = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  // STEP 2: TS1 Pemeliharaan
  group("TS1 — Pemeliharaan :3002", () => {
    // GET /sapulobang (by user dari JWT)
    const r1 = http.get(`${BASE.pemeliharaan}/sapulobang`, {
      ...h,
      tags: { name: "ts1_sapulobang" },
    });
    ts1Lat.add(r1.timings.duration);
    totalReqs.add(1);
    errorRate.add(
      !check(r1, { "[TS1] GET /sapulobang → 200": (r) => r.status === 200 }),
    );

    // GET /kegiatan-rutin
    const r2 = http.get(`${BASE.pemeliharaan}/kegiatan-rutin`, {
      ...h,
      tags: { name: "ts1_kegiatan_rutin" },
    });
    ts1Lat.add(r2.timings.duration);
    totalReqs.add(1);
    errorRate.add(
      !check(r2, {
        "[TS1] GET /kegiatan-rutin → 200": (r) => r.status === 200,
      }),
    );

    // 10% VU create sapulobang via POST (tidak wajib, skip jika field complex)
    // POST /sapulobang membutuhkan multipart, skip di load test dasar
  });

  // STEP 3: TS4 Talikuat
  group("TS4 — Talikuat :3003", () => {
    // GET /data-umum (by auth)
    const r = http.get(`${BASE.talikuat}/data-umum`, {
      ...h,
      tags: { name: "ts4_data_umum" },
    });
    ts4Lat.add(r.timings.duration);
    totalReqs.add(1);
    errorRate.add(
      !check(r, { "[TS4] GET /data-umum → 200": (r) => r.status === 200 }),
    );
  });

  // STEP 4: TS3 Laporan
  group("TS3 — Laporan :3004", () => {
    // GET /laporan-masyarakat (public)
    const r1 = http.get(`${BASE.laporan}/laporan-masyarakat`, {
      tags: { name: "ts3_laporan" },
    });
    ts3Lat.add(r1.timings.duration);
    totalReqs.add(1);
    errorRate.add(
      !check(r1, {
        "[TS3] GET /laporan-masyarakat → 200": (r) => r.status === 200,
      }),
    );

    // GET /jenis-laporan (public)
    const r2 = http.get(`${BASE.laporan}/jenis-laporan`, {
      tags: { name: "ts3_jenis_laporan" },
    });
    ts3Lat.add(r2.timings.duration);
    totalReqs.add(1);
    check(r2, { "[TS3] GET /jenis-laporan → 200": (r) => r.status === 200 });
  });

  // STEP 5: TS5 Rumija
  group("TS5 — Rumija :3005", () => {
    // GET /rumija (public)
    const r = http.get(`${BASE.rumija}/rumija`, {
      tags: { name: "ts5_rumija" },
    });
    ts5Lat.add(r.timings.duration);
    totalReqs.add(1);
    errorRate.add(
      !check(r, { "[TS5] GET /rumija → 200": (r) => r.status === 200 }),
    );
  });

  // STEP 6: TS6 Dashboard + Gateway
  group("TS6 — Dashboard & Gateway :3000", () => {
    // GET /gateway/sapulobang (proxy → TS1)
    const r1 = http.get(`${BASE.dashboard}/gateway/sapulobang`, {
      ...h,
      tags: { name: "ts6_gw_sapulobang" },
    });
    ts6Lat.add(r1.timings.duration);
    totalReqs.add(1);
    errorRate.add(
      !check(r1, {
        "[TS6] GET /gateway/sapulobang → 200": (r) => r.status === 200,
      }),
    );

    // GET /gateway/kegiatan-rutin (proxy → TS1)
    const r2 = http.get(`${BASE.dashboard}/gateway/kegiatan-rutin`, {
      ...h,
      tags: { name: "ts6_gw_kegiatan_rutin" },
    });
    ts6Lat.add(r2.timings.duration);
    totalReqs.add(1);
    check(r2, {
      "[TS6] GET /gateway/kegiatan-rutin → 200": (r) => r.status === 200,
    });

    // GET /ruas (data master ruas jalan di dashboard)
    const r3 = http.get(`${BASE.dashboard}/ruas`, {
      ...h,
      tags: { name: "ts6_ruas" },
    });
    ts6Lat.add(r3.timings.duration);
    totalReqs.add(1);
    check(r3, { "[TS6] GET /ruas → 200": (r) => r.status === 200 });

    // GET /sup
    const r4 = http.get(`${BASE.dashboard}/sup`, {
      ...h,
      tags: { name: "ts6_sup" },
    });
    ts6Lat.add(r4.timings.duration);
    totalReqs.add(1);
    check(r4, { "[TS6] GET /sup → 200": (r) => r.status === 200 });
  });

  sleep(1);
}

export function handleSummary(data) {
  function pct(m) {
    return ((data.metrics[m]?.values?.rate ?? 0) * 100).toFixed(1);
  }
  function p95(m) {
    return (data.metrics[m]?.values?.["p(95)"] ?? 0).toFixed(0);
  }
  const totalR = data.metrics.total_requests?.values?.count ?? 0;

  console.log("\n╔══════════════════════════════════════════════════════╗");
  console.log("║          LOAD / STABILITY TEST — SUMMARY             ║");
  console.log("╠══════════════════════════════════════════════════════╣");
  console.log(`║  Total Requests          : ${String(totalR).padEnd(25)}║`);
  console.log(
    `║  Error Rate              : ${pct("error_rate").padEnd(7)}%  (target <5%)   ║`,
  );
  console.log(
    `║  Auth Success            : ${pct("auth_success_rate").padEnd(7)}%  (target ≥95%)  ║`,
  );
  console.log("╠══════════════════════════════════════════════════════╣");
  console.log(
    `║  TS2 /auth/login    P95  : ${p95("ts2_user_ms").padEnd(7)}ms (target <500ms)  ║`,
  );
  console.log(
    `║  TS1 /sapulobang    P95  : ${p95("ts1_pemeliharaan_ms").padEnd(7)}ms (target <1500ms) ║`,
  );
  console.log(
    `║  TS4 /data-umum     P95  : ${p95("ts4_talikuat_ms").padEnd(7)}ms (target <1500ms) ║`,
  );
  console.log(
    `║  TS3 /laporan       P95  : ${p95("ts3_laporan_ms").padEnd(7)}ms (target <1500ms) ║`,
  );
  console.log(
    `║  TS5 /rumija        P95  : ${p95("ts5_rumija_ms").padEnd(7)}ms (target <1500ms) ║`,
  );
  console.log(
    `║  TS6 /gateway       P95  : ${p95("ts6_dashboard_ms").padEnd(7)}ms (target <2000ms) ║`,
  );
  console.log(
    `║  Overall P99             : ${p95("http_req_duration").padEnd(7)}ms (target <3000ms) ║`,
  );
  console.log("╚══════════════════════════════════════════════════════╝\n");

  return {
    stdout: JSON.stringify(data, null, 2),
    "summary.json": JSON.stringify(data),
  };
}
