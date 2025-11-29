import http from 'k6/http';
import { check, sleep } from 'k6';

// SETTING: Simulasi Beban Kerja Dinas (20 Petugas)
export const options = {
  stages: [
    { duration: '5s', target: 5 },   // Pemanasan
    { duration: '20s', target: 20 }, // Beban Puncak
    { duration: '5s', target: 0 },   // Pendinginan
  ],
  // Syarat Lulus: Error harus 0.00%
  thresholds: { http_req_failed: ['rate==0.00'] },
};

export default function () {
  const headers = { 'Content-Type': 'application/json' };

  // 1. LOGIN
  const loginRes = http.post('http://localhost:3001/auth/login', JSON.stringify({
    username: 'admin',
    password: 'password'
  }), { headers: headers });

  // Cek Login
  check(loginRes, { 'Login Stabil (200 OK)': (r) => r.status === 200 });
  
  if (loginRes.status === 200) {
      const token = loginRes.json('token');
      
      // 2. INPUT DATA BERULANG (Beban Transaksi)
      // KOREKSI: URL diganti menjadi /sapulobang
      const sapuUrl = 'http://localhost:3002/sapulobang';
      
      const sapuPayload = JSON.stringify({
        ruas_jalan_id: 1,
        lokasi: "Load Test Location",
        jumlah_lubang: 1,
        status: "Baru"
      });

      const maintRes = http.post(sapuUrl, sapuPayload, { 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        } 
      });
      
      check(maintRes, { 'Input Stabil': (r) => r.status === 201 || r.status === 200 });
  }

  sleep(1); 
}