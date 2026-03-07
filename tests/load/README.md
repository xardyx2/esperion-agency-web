# Load Testing with k6

## Prerequisites
- k6 installed: https://k6.io/docs/get-started/installation/
- Backend running on localhost:8080
- Frontend running on localhost:3000 (optional)

## Running Tests

```bash
# Test auth endpoints
npm run test:auth

# Test API endpoints
npm run test:api

# Test contact form
npm run test:contact

# Run all tests
npm run test:all
```

## Interpreting Results

Look for:
- http_req_duration: Should be < 500ms for 95th percentile
- http_req_failed: Should be < 0.1%
- Iterations completed: Should match expected load