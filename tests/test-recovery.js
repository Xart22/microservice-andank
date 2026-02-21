/**
 * ============================================================
 * K6 TEST: RECOVERY / SELF-HEALING TEST — TS1 + TS2 + TS3
 * Repo: Xart22/microservice-andank
 *
 * Mengukur Time To Recovery (TTR) untuk 3 service sekaligus:
 *   TS1 pemeliharaan-service :3002  /health
 *   TS2 user-service         :3001  /health
 *   TS3 laporan-service      :3004  /health
 *
 * Target thesis:
 *   TS1 TTR ≈ 2.626s
 *   TS2 TTR ≈ 2.510s
 *   TS3 TTR < 3s
 *
 * LANGKAH:
 *   # Stop semua 3 service
 *   docker stop pemeliharaan-service user-service laporan-service
 *
 *   # Start ulang semua, langsung run test
 *   docker start pemeliharaan-service user-service laporan-service && k6 run test-recovery.js
 * ============================================================
 */

import http from "k6/http";
import { check, sleep } from "k6";
import { Trend, Rate, Gauge } from "k6/metrics";

// ============================================================
// CONFIG
// ============================================================
const SERVICES = {
  ts1: {
    name: "TS1-Pemeliharaan",
    url: "http://localhost:3002",
    healthPath: "/health",
  },
  ts2: {
    name: "TS2-User",
    url: "http://localhost:3001",
    healthPath: "/health",
  },
  ts3: {
    name: "TS3-Laporan",
    url: "http://localhost:3004",
    healthPath: "/health",
  },
};

// ============================================================
// CUSTOM METRICS — per service
// ============================================================
// TS1
const ts1RecoveredRate = new Rate("ts1_recovered_rate");
const ts1TtrTrend = new Trend("ts1_ttr_ms", true);
const ts1FirstUp = new Gauge("ts1_first_success_ms");

// TS2
const ts2RecoveredRate = new Rate("ts2_recovered_rate");
const ts2TtrTrend = new Trend("ts2_ttr_ms", true);
const ts2FirstUp = new Gauge("ts2_first_success_ms");

// TS3
const ts3RecoveredRate = new Rate("ts3_recovered_rate");
const ts3TtrTrend = new Trend("ts3_ttr_ms", true);
const ts3FirstUp = new Gauge("ts3_first_success_ms");

// ============================================================
// OPTIONS — 3 scenario paralel, masing-masing poll 5 req/s
// ============================================================
export const options = {
  scenarios: {
    // Poll TS1
    poll_ts1: {
      executor: "constant-arrival-rate",
      rate: 5,
      timeUnit: "1s",
      duration: "30s",
      preAllocatedVUs: 5,
      maxVUs: 10,
      exec: "pollTS1",
    },
    // Poll TS2
    poll_ts2: {
      executor: "constant-arrival-rate",
      rate: 5,
      timeUnit: "1s",
      duration: "30s",
      preAllocatedVUs: 5,
      maxVUs: 10,
      exec: "pollTS2",
    },
    // Poll TS3
    poll_ts3: {
      executor: "constant-arrival-rate",
      rate: 5,
      timeUnit: "1s",
      duration: "30s",
      preAllocatedVUs: 5,
      maxVUs: 10,
      exec: "pollTS3",
    },
  },
  thresholds: {
    ts1_recovered_rate: ["rate>0.3"],
    ts2_recovered_rate: ["rate>0.3"],
    ts3_recovered_rate: ["rate>0.3"],
    ts1_ttr_ms: ["p(50)<5000"],
    ts2_ttr_ms: ["p(50)<5000"],
    ts3_ttr_ms: ["p(50)<5000"],
    ts1_first_success_ms: ["value<5000"],
    ts2_first_success_ms: ["value<5000"],
    ts3_first_success_ms: ["value<5000"],
  },
};

// ============================================================
// SETUP — catat waktu mulai
// ============================================================
export function setup() {
  const startTs = Date.now();
  console.log("\n🚀 Recovery test dimulai: " + new Date(startTs).toISOString());
  console.log("📌 Pastikan sudah jalankan:");
  console.log(
    "   docker start pemeliharaan-service user-service laporan-service\n",
  );
  return { startTs };
}

// ============================================================
// STATE — track first recovery per service
// ============================================================
const _recovered = { ts1: false, ts2: false, ts3: false };

// ============================================================
// HELPER: Poll satu service dan catat TTR
// ============================================================
function pollService(svc, startTs, key, ttrTrend, firstUpGauge, recoveredRate) {
  const now = Date.now();
  const elapsed = now - startTs;

  const res = http.get(`${svc.url}${svc.healthPath}`, {
    timeout: "3s",
    tags: { name: `${key}_health_poll` },
  });

  const isUp = res.status === 200;

  const ok = check(res, {
    [`[${svc.name}] /health → 200`]: () => isUp,
    [`[${svc.name}] Response < 3s`]: (r) => r.timings.duration < 3000,
  });

  recoveredRate.add(ok);

  if (isUp) {
    ttrTrend.add(elapsed);

    if (!_recovered[key]) {
      _recovered[key] = true;
      firstUpGauge.add(elapsed);

      const sec = (elapsed / 1000).toFixed(3);
      console.log(
        `✅ [${elapsed}ms] ${svc.name} RECOVERED! TTR = ${sec}s  ` +
          (elapsed < 3000 ? "🏆 PASS (<3s)" : "⚠️  WARN (>3s)"),
      );
    }
  } else {
    if (Math.round(elapsed / 1000) % 5 === 0 && elapsed > 0) {
      console.log(
        `⏳ [${(elapsed / 1000).toFixed(1)}s] ${svc.name} masih down... status=${res.status}`,
      );
    }
  }

  sleep(0.2);
}

// ============================================================
// SCENARIO FUNCTIONS
// ============================================================
export function pollTS1(data) {
  pollService(
    SERVICES.ts1,
    data.startTs,
    "ts1",
    ts1TtrTrend,
    ts1FirstUp,
    ts1RecoveredRate,
  );
}

export function pollTS2(data) {
  pollService(
    SERVICES.ts2,
    data.startTs,
    "ts2",
    ts2TtrTrend,
    ts2FirstUp,
    ts2RecoveredRate,
  );
}

export function pollTS3(data) {
  pollService(
    SERVICES.ts3,
    data.startTs,
    "ts3",
    ts3TtrTrend,
    ts3FirstUp,
    ts3RecoveredRate,
  );
}

// ============================================================
// TEARDOWN
// ============================================================
export function teardown() {
  console.log("\n──────────────────────────────────────────────");
  console.log("RECOVERY TEARDOWN RESULT");
  console.log(
    `TS1 (pemeliharaan-service) : ${_recovered.ts1 ? "✅ RECOVERED" : "❌ TIDAK RECOVER"}`,
  );
  console.log(
    `TS2 (user-service)         : ${_recovered.ts2 ? "✅ RECOVERED" : "❌ TIDAK RECOVER"}`,
  );
  console.log(
    `TS3 (laporan-service)      : ${_recovered.ts3 ? "✅ RECOVERED" : "❌ TIDAK RECOVER"}`,
  );

  if (!_recovered.ts1) {
    console.log("\n   Debug TS1: docker logs pemeliharaan-service --tail 50");
  }
  if (!_recovered.ts2) {
    console.log("\n   Debug TS2: docker logs user-service --tail 50");
  }
  if (!_recovered.ts3) {
    console.log("\n   Debug TS3: docker logs laporan-service --tail 50");
  }
  console.log("──────────────────────────────────────────────\n");
}

// ============================================================
// SUMMARY
// ============================================================
export function handleSummary(data) {
  function ms(metric) {
    return (data.metrics[metric]?.values?.value ?? 0).toFixed(0);
  }
  function p50(metric) {
    return (data.metrics[metric]?.values?.["p(50)"] ?? 0).toFixed(0);
  }
  function verdict(firstMs) {
    const v = parseInt(firstMs);
    if (v === 0) return "❌ TIDAK RECOVER";
    if (v < 3000) return "✅ PASS (<3s)   ";
    return "⚠️  WARN (>3s)   ";
  }

  const ts1ms = ms("ts1_first_success_ms");
  const ts2ms = ms("ts2_first_success_ms");
  const ts3ms = ms("ts3_first_success_ms");

  console.log(
    "\n╔════════════════════════════════════════════════════════════╗",
  );
  console.log("║       RECOVERY TEST — SUMMARY (TS1 + TS2 + TS3)           ║");
  console.log("╠════════════════════════════════════════════════════════════╣");
  console.log("║  Service              │ TTR (ms)   │ P50 (ms) │ Verdict    ║");
  console.log("╠════════════════════════════════════════════════════════════╣");
  console.log(
    `║  TS1 pemeliharaan     │ ${ts1ms.padEnd(10)} │ ${p50("ts1_ttr_ms").padEnd(8)} │ ${verdict(ts1ms)}║`,
  );
  console.log(
    `║  TS2 user             │ ${ts2ms.padEnd(10)} │ ${p50("ts2_ttr_ms").padEnd(8)} │ ${verdict(ts2ms)}║`,
  );
  console.log(
    `║  TS3 laporan          │ ${ts3ms.padEnd(10)} │ ${p50("ts3_ttr_ms").padEnd(8)} │ ${verdict(ts3ms)}║`,
  );
  console.log("╠════════════════════════════════════════════════════════════╣");
  console.log(`║  Thesis target TTR    : < 3000ms                           ║`);
  console.log(`║  Thesis result TS1    : 2626ms ✅                          ║`);
  console.log(`║  Thesis result TS2    : 2510ms ✅                          ║`);
  console.log(
    "╚════════════════════════════════════════════════════════════╝\n",
  );

  return {
    stdout: JSON.stringify(data, null, 2),
    "summary.json": JSON.stringify(data),
  };
}
