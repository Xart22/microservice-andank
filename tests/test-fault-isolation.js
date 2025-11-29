import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,        // Simulasi 20 User
  duration: '30s', // Durasi 30 detik
  thresholds: {
    http_req_failed: ['rate<0.01'], // Toleransi error < 1%
  },
};

export default function () {
  // Target: User Service (Pastikan Port sesuai docker-compose, misal 3001)
  const url = 'http://localhost:3001/auth/login'; 
  
  const payload = JSON.stringify({
    username: 'admin',
    password: 'password',
  });
  
  const params = { headers: { 'Content-Type': 'application/json' } };

  const res = http.post(url, payload, params);

  // Kita cek: Apakah TS2 tetap merespon (200 OK) atau setidaknya menolak akses (401)
  // Yang penting BUKAN "Connection Refused" (Mati)
  check(res, {
    'Service User Hidup': (r) => r.status === 200 || r.status === 401,
  });

  sleep(1);
}