import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '2m', target: 20 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const url = 'http://localhost:8080/api/v1/contact';
  const payload = JSON.stringify({
    full_name: `User ${__VU}`,
    email: `user${__VU}@test.com`,
    description: 'Load test inquiry',
    service: 'Digital Advertising',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  sleep(2);
}