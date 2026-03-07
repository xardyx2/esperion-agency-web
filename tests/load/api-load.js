import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '3m', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '3m', target: 100 },
    { duration: '1m', target: 0 },
  ],
};

const ENDPOINTS = [
  'http://localhost:8080/api/v1/articles',
  'http://localhost:8080/api/v1/works',
  'http://localhost:8080/api/v1/services',
  'http://localhost:8080/health',
];

export default function () {
  const url = ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];
  const res = http.get(url);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 300ms': (r) => r.timings.duration < 300,
  });

  sleep(0.5);
}