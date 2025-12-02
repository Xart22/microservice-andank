import http from 'k6/http';
import { check, sleep } from 'k6';

// SETTING: Simulasi Beban Kerja (Naik turun seperti jam kerja)
export const options = {
  stages: [
    { duration: '5s', target: 5 },   // Pemanasan
    { duration: '20s', target: 20 }, // Beban Puncak (20 Petugas input barengan)
    { duration: '5s', target: 0 },   // Pendinginan
  ],
  // Syarat Lulus: Error harus 0.00%
  thresholds: { http_req_failed: ['rate==0.00'] },
};

export default function () {
  const headers = { 'Content-Type': 'application/json' };

  // ============================================================
  // 1. LOGIN (Gunakan User yang Valid)
  // ============================================================
  const loginRes = http.post('http://localhost:3000//gateway/login', JSON.stringify({
    
    email: "test2@example.com",
    password: "password2"  // Email Benar
  }), { headers: headers });

  // Cek Login
  const loginSuccess = check(loginRes, { 'Login Stabil (200 OK)': (r) => r.status === 200 });
  
  // Jika login sukses, lanjut input data
  if (loginSuccess) {
      const token = loginRes.json('token');
      
      // ============================================================
      // 2. INPUT DATA BERULANG (Beban Transaksi)
      // ============================================================
      // URL BENAR: /sapulobang
      const sapuUrl = 'http://localhost:3002/sapulobang';
      
      // PAYLOAD LENGKAP (Ada Tanggal & Ruas Jalan ID)
      const sapuPayload = JSON.stringify({
        ruas_jalan_id: 1,
        tanggal: new Date().toISOString(), // <--- INI WAJIB ADA
        lokasi: "Load Test Stability",
        jumlah_lubang: 1,
        status: "Baru",
        keterangan: "Testing Stabilitas Sistem Tesis"
      });

      const maintRes = http.post(sapuUrl, sapuPayload, { 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        } 
      });

      // console.log(
      //   "STATUS:", maintRes.status,
      //   "BODY:", maintRes.body
      // );

      
      check(maintRes, { 'Input Stabil (201 Created)': (r) => r.status === 201 || r.status === 200 });
  }

  sleep(1); 
}