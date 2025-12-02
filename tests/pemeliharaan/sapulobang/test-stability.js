import http from "k6/http";
import { check, sleep } from "k6";
import { FormData } from "https://jslib.k6.io/formdata/0.0.2/index.js";
// SETTING: Simulasi Beban Kerja (Naik turun seperti jam kerja)

const img = open("../../image/test.png", "b");
export const options = {
  stages: [
    { duration: "5s", target: 5 }, // Pemanasan
    { duration: "20s", target: 20 }, // Beban Puncak (20 Petugas input barengan)
    { duration: "5s", target: 0 }, // Pendinginan
  ],
  // Syarat Lulus: Error harus 0.00%
  thresholds: { http_req_failed: ["rate==0.00"] },
};

export default function () {
  const headers = { "Content-Type": "application/json" };

  // --- 1. LOGIN ---
  const loginUrl = "http://localhost:3000/gateway/login";
  const loginPayload = JSON.stringify({
    email: "test2@example.com",
    password: "password2", // Password dari user.service.ts
  });

  const loginRes = http.post(loginUrl, loginPayload, { headers: headers });

  if (!check(loginRes, { "Login Sukses (200 OK)": (r) => r.status === 200 })) {
    console.error("❌ Gagal Login. Response:", loginRes.body);
    return;
  }

  const token = loginRes.json("access_token");

  // --- 2. INPUT DATA SAPU LOBANG ---
  // URL BENAR: /sapulobang (sesuai server.ts)
  const sapuUrl = "http://localhost:3002/sapulobang";
  const fd = new FormData();
  fd.append("image_survei", http.file(img, "test.png", "image/png"));
  fd.append("jumlah", "5");
  fd.append("panjang", "10");
  fd.append("lat_survei", "-6.9");
  fd.append("long_survei", "107.6");
  fd.append("ruas_jalan_id", "1");
  fd.append("sup_id", "1");
  fd.append("uptd_id", "1");
  fd.append("tanggal_survei", "2024-12-01");
  fd.append("lajur", "kiri");
  fd.append("lokasi_km", "10");
  fd.append("lokasi_m", "5");
  fd.append("kategori_kedalaman", "3");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data; boundary=" + fd.boundary,
  };

  const inputRes = http.post(sapuUrl, fd.body(), { headers: authHeaders });

  // Validasi
  check(inputRes, {
    "status is 200 or 201": (r) => r.status === 200 || r.status === 201,
    "no payload error": (r) => !r.body.includes("payload"),
  });
  sleep(1);
}
