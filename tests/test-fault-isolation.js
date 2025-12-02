import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20, 
  duration: '30s',
  // Error harus 0.00% (User Service tidak boleh ikut mati)
  thresholds: { http_req_failed: ['rate==0.00'] },
};

export default function () {
  const headers = { 'Content-Type': 'application/json' };

  // ==========================================
  // LOGIN (Gunakan Kredensial yang BENAR)
  // ==========================================
  const loginUrl = 'http://localhost:3001/auth/login'; 
  
  const loginPayload = JSON.stringify({
    email: 'test1@example.com',  // <--- WAJIB ADA
    username: 'admin',
    password: 'password1'        // <--- PASSWORD YANG BENAR
  });
  
  // Kita tembak Service User (Port 3001) yang HARUS TETAP HIDUP
  const res = http.post(loginUrl, loginPayload, { headers: headers });

  // Cek apakah User Service masih merespon 200 OK
  check(res, {
    'User Service Tetap Hidup (200 OK)': (r) => r.status === 200,
  });
  
  sleep(1);
}