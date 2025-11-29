import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 5,
  duration: '10s',
};

export default function () {
  // Target: Service Pemeliharaan yang sedang MATI (Port 3002)
  const res = http.get('http://localhost:3002/health');

  check(res, {
    // Status 0 = Connection Refused (Docker mati total)
    // Ini membuktikan sistem langsung tahu kalau dia mati, tidak loading lama.
    'Fail Fast (Connection Refused)': (r) => r.status === 0, 
    
    // Respon harus cepat (di bawah 100ms), jangan sampai user menunggu (timeout)
    'Latency Rendah (< 100ms)': (r) => r.timings.duration < 100,
  });
}

