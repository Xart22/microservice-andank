/**
 * ============================================================
 * K6 TEST 1: INTEROPERABILITY TEST
 * Repo: Xart22/microservice-andank
 *
 * Endpoint AKURAT dari source code:
 *   TS2 user-service   :3001  POST /auth/login
 *   TS1 pemeliharaan   :3002  GET  /sapulobang | GET /kegiatan-rutin
 *   TS4 talikuat       :3003  GET  /data-umum
 *   TS3 laporan        :3004  GET  /laporan-masyarakat  (public)
 *   TS5 rumija         :3005  GET  /rumija              (public)
 *   TS6 dashboard/GW   :3000  GET  /gateway/sapulobang  (proxy → TS1)
 *                             GET  /gateway/kegiatan-rutin (proxy → TS1)
 *
 * RUN: k6 run test-interoperability.js
 * ============================================================
 */

import http from "k6/http";
import { check, group, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";

const BASE = {
  dashboard: "http://localhost:3000",
  user: "http://localhost:3001",
  pemeliharaan: "http://localhost:3002",
  talikuat: "http://localhost:3003",
  laporan: "http://localhost:3004",
  rumija: "http://localhost:3005",
};

const CREDS = { email: "test1@example.com", password: "password1" };

const loginSuccessRate = new Rate("login_success_rate");
const txSuccessRate = new Rate("cross_service_tx_success");
const loginLatency = new Trend("login_latency_ms", true);

export const options = {
  stages: [
    { duration: "10s", target: 5 },
    { duration: "30s", target: 10 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    login_success_rate: ["rate>=0.95"],
    cross_service_tx_success: ["rate>=0.90"],
    http_req_duration: ["p(95)<2000"],
    http_req_failed: ["rate<0.05"],
  },
};

function doLogin() {
  const res = http.post(
    `${BASE.user}/auth/login`,
    JSON.stringify({ email: CREDS.email, password: CREDS.password }),
    {
      headers: { "Content-Type": "application/json" },
      tags: { name: "TS2_login" },
    },
  );
  loginLatency.add(res.timings.duration);

  const ok = check(res, {
    "[TS2] POST /auth/login → 200": (r) => r.status === 200,
    "[TS2] ada token di response": (r) => {
      try {
        const b = r.json();
        return !!(b.token || b.data?.token || b.access_token || b.accessToken);
      } catch {
        return false;
      }
    },
  });
  loginSuccessRate.add(ok);
  if (!ok) console.error(`[TS2] Login gagal [${res.status}]: ${res.body}`);

  try {
    const b = res.json();
    return b.token ?? b.data?.token ?? b.access_token ?? b.accessToken ?? null;
  } catch {
    return null;
  }
}

export default function () {
  let token = null;

  // ── TS2: Login ──────────────────────────────────────────
  group("TS2 — POST /auth/login", () => {
    token = doLogin();
    sleep(0.3);
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

  // ── TS1: Pemeliharaan ───────────────────────────────────
  group("TS2→TS1 — Pemeliharaan :3002", () => {
    // GET /sapulobang  → data by user dari JWT
    const r1 = http.get(`${BASE.pemeliharaan}/sapulobang`, {
      ...h,
      tags: { name: "TS1_sapulobang" },
    });
    txSuccessRate.add(
      check(r1, { "[TS1] GET /sapulobang → 200": (r) => r.status === 200 }),
    );

    // GET /sapulobang/all  → semua data
    const r2 = http.get(`${BASE.pemeliharaan}/sapulobang/all`, {
      ...h,
      tags: { name: "TS1_sapulobang_all" },
    });
    check(r2, { "[TS1] GET /sapulobang/all → 200": (r) => r.status === 200 });

    // GET /kegiatan-rutin
    const r3 = http.get(`${BASE.pemeliharaan}/kegiatan-rutin`, {
      ...h,
      tags: { name: "TS1_kegiatan_rutin" },
    });
    check(r3, { "[TS1] GET /kegiatan-rutin → 200": (r) => r.status === 200 });

    sleep(0.2);
  });

  // ── TS4: Talikuat ───────────────────────────────────────
  group("TS2→TS4 — Talikuat :3003", () => {
    // GET /data-umum  → by auth
    const r = http.get(`${BASE.talikuat}/data-umum`, {
      ...h,
      tags: { name: "TS4_data_umum" },
    });
    txSuccessRate.add(
      check(r, { "[TS4] GET /data-umum → 200": (r) => r.status === 200 }),
    );

    // GET /data-umum/all → semua data
    const r2 = http.get(`${BASE.talikuat}/data-umum/all`, {
      ...h,
      tags: { name: "TS4_data_umum_all" },
    });
    check(r2, { "[TS4] GET /data-umum/all → 200": (r) => r.status === 200 });

    sleep(0.2);
  });

  // ── TS3: Laporan Masyarakat ─────────────────────────────
  group("TS2→TS3 — Laporan :3004", () => {
    // GET /laporan-masyarakat → public (no auth)
    const r = http.get(`${BASE.laporan}/laporan-masyarakat`, {
      tags: { name: "TS3_laporan" },
    });
    txSuccessRate.add(
      check(r, {
        "[TS3] GET /laporan-masyarakat → 200": (r) => r.status === 200,
      }),
    );

    // GET /jenis-laporan → public
    const r2 = http.get(`${BASE.laporan}/jenis-laporan`, {
      tags: { name: "TS3_jenis_laporan" },
    });
    check(r2, { "[TS3] GET /jenis-laporan → 200": (r) => r.status === 200 });

    sleep(0.2);
  });

  // ── TS5: Rumija ─────────────────────────────────────────
  group("TS2→TS5 — Rumija :3005", () => {
    // GET /rumija → public
    const r = http.get(`${BASE.rumija}/rumija`, {
      tags: { name: "TS5_rumija" },
    });
    txSuccessRate.add(
      check(r, { "[TS5] GET /rumija → 200": (r) => r.status === 200 }),
    );
    sleep(0.2);
  });

  // ── TS6: Dashboard Gateway ──────────────────────────────
  group("TS2→TS6 — Dashboard Gateway :3000", () => {
    // GET /gateway/sapulobang → proxy ke TS1
    const r1 = http.get(`${BASE.dashboard}/gateway/sapulobang`, {
      ...h,
      tags: { name: "TS6_GW_sapulobang" },
    });
    txSuccessRate.add(
      check(r1, {
        "[TS6] GET /gateway/sapulobang → 200": (r) => r.status === 200,
      }),
    );

    // GET /gateway/kegiatan-rutin → proxy ke TS1
    const r2 = http.get(`${BASE.dashboard}/gateway/kegiatan-rutin`, {
      ...h,
      tags: { name: "TS6_GW_kegiatan_rutin" },
    });
    check(r2, {
      "[TS6] GET /gateway/kegiatan-rutin → 200": (r) => r.status === 200,
    });

    sleep(0.2);
  });

  sleep(1);
}

export function handleSummary(data) {
  const loginRate = (
    (data.metrics.login_success_rate?.values?.rate ?? 0) * 100
  ).toFixed(1);
  const txRate = (
    (data.metrics.cross_service_tx_success?.values?.rate ?? 0) * 100
  ).toFixed(1);
  const p95 = (data.metrics.http_req_duration?.values?.["p(95)"] ?? 0).toFixed(
    0,
  );
  const totalReqs = data.metrics.http_reqs?.values?.count ?? 0;

  console.log("\n╔══════════════════════════════════════════════╗");
  console.log("║     INTEROPERABILITY TEST — SUMMARY          ║");
  console.log("╠══════════════════════════════════════════════╣");
  console.log(
    `║  Login success rate  : ${loginRate.padEnd(7)}% (target ≥95%) ║`,
  );
  console.log(`║  Cross-service TX    : ${txRate.padEnd(7)}% (target ≥90%) ║`);
  console.log(`║  P95 latency         : ${p95.padEnd(8)}ms               ║`);
  console.log(`║  Total requests      : ${String(totalReqs).padEnd(22)}║`);
  console.log("╚══════════════════════════════════════════════╝\n");

  return { stdout: JSON.stringify(data, null, 2) };
}
