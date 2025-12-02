import http from 'k6/http';
import { check, sleep } from 'k6';

const img = open("./tests/image/test.png", "b");
export const options = {
  vus: 1,
  iterations: 1,
};

export default function () {
  const headers = { 'Content-Type': 'application/json' };

  // --- 1. LOGIN ---
  const loginUrl = 'http://localhost:3000/gateway/login';
  const loginPayload = JSON.stringify({
    email: "test2@example.com",
    password: "password2"       // Password dari user.service.ts
  });

  const loginRes = http.post(loginUrl, loginPayload, { headers: headers });

  if (!check(loginRes, { 'Login Sukses (200 OK)': (r) => r.status === 200 })) {
    console.error('❌ Gagal Login. Response:', loginRes.body);
    return;
  }

  const token = loginRes.json('access_token');

  // --- 2. INPUT DATA SAPU LOBANG ---
  // URL BENAR: /sapulobang (sesuai server.ts)
  const sapuUrl = 'http://localhost:3002/sapulobang';

  

  const formData = {
    // FILE
    "image_survei": http.file(img, "test.png", "image/png"),

    // FIELD (harus dibuat format khusus)
    "jumlah": JSON.stringify({ type: "field", value: "5" }),
    "panjang": JSON.stringify({ type: "field", value: "10" }),
    "lat_survei": JSON.stringify({ type: "field", value: "-6.900" }),
    "long_survei": JSON.stringify({ type: "field", value: "107.600" }),
    "ruas_jalan_id": JSON.stringify({ type: "field", value: "1" }),
    "sup_id": JSON.stringify({ type: "field", value: "1" }),
    "uptd_id": JSON.stringify({ type: "field", value: "1" }),
    "tanggal_survei": JSON.stringify({ type: "field", value: "2024-12-01" }),
    "lajur": JSON.stringify({ type: "field", value: "kiri" }),
    "lokasi_km": JSON.stringify({ type: "field", value: "10" }),
    "lokasi_m": JSON.stringify({ type: "field", value: "5" }),
    "kategori_kedalaman": JSON.stringify({ type: "field", value: "3" }),
  };

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const inputRes = http.post(sapuUrl, formData, { headers: authHeaders });

  // Validasi
  check(inputRes, {
    'status is 200 or 201': (r) => r.status === 200 || r.status === 201,
    'no payload error': (r) => !r.body.includes('payload'),
  });
  sleep(1);
}

