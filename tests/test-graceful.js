import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 5,
  duration: '10s',
};

export default function () {
  // Target: Service Pemeliharaan (Port 3002) yang SEDANG MATI
  // Kita tembak endpoint /health
  const res = http.get('http://localhost:3002/health');

  check(res, {
    // Status 0 artinya "Connection Refused" (Docker mati total)
    // Ini bagus! Artinya sistem langsung tahu kalau service tidak ada.
    'Fail Fast (System Refused)': (r) => r.status === 0,
    
    // Respon harus sangat cepat (< 50ms)
    // Jangan sampai user menunggu loading lama (Timeout)
    'Respon Cepat (< 50ms)': (r) => r.timings.duration < 50,
  });
}