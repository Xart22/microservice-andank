import http from 'k6/http';
import { check } from 'k6';

// SETTING: Cukup 1 user, 1 kali putaran.
export const options = {
  vus: 1,
  iterations: 1,
};

export default function () {
  const headers = { 'Content-Type': 'application/json' };

  // --- LANGKAH A: LOGIN (User Service) ---
  const loginRes = http.post('http://localhost:3001/auth/login', JSON.stringify({
    username: 'admin',
    password: 'password'
  }), { headers: headers });

  if (!check(loginRes, { 'Login Sukses (TS2)': (r) => r.status === 200 })) {
    console.error('Login Gagal. Cek username/password.');
    return;
  }

  const token = loginRes.json('token');

  // --- LANGKAH B: INPUT DATA SAPU LOBANG (Pemeliharaan Service) ---
  // KOREKSI: URL diganti menjadi /sapulobang sesuai server.ts
  const sapuUrl = 'http://localhost:3002/sapulobang';
  
  // Data Dummy Sapu Lobang
  const sapuPayload = JSON.stringify({
    ruas_jalan_id: 1,
    tanggal: new Date().toISOString(),
    lokasi: "Jalan Dago (Test k6)",
    jumlah_lubang: 3,
    status: "Baru",
    keterangan: "Uji Interoperabilitas"
  });

  const authHeaders = { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` 
  };

  const maintRes = http.post(sapuUrl, sapuPayload, { headers: authHeaders });

  check(maintRes, { 
    'Data Masuk via Token (TS1)': (r) => r.status === 201 || r.status === 200 
  });
}