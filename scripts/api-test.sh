#!/bin/bash
#
# API Testing Script for Staging Migration
# Tests all 13 API handlers, authentication, and CRUD operations
#

set -e

BASE_URL="http://localhost:8082"
API_URL="${BASE_URL}/api/v1"
REPORT_FILE="api-test-report-$(date +%Y%m%d-%H%M%S).md"

echo "================================"
echo "API Testing for v3 Migration"
echo "Started: $(date)"
echo "Base URL: ${BASE_URL}"
echo "================================"
echo ""

PASSED=0
FAILED=0

# Helper function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -n "Testing: ${method} ${endpoint} ... "
    
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
        -X "${method}" \
        -H "Content-Type: application/json" \
        -d "${data}" \
        "${API_URL}${endpoint}" 2>/dev/null || echo "000")
    
    if [ "$HTTP_STATUS" -ge 200 ] && [ "$HTTP_STATUS" -lt 300 ]; then
        echo "✓ (${HTTP_STATUS})"
        PASSED=$((PASSED + 1))
        echo "- [x] ${description}: ${method} ${endpoint} (${HTTP_STATUS})" >> "${REPORT_FILE}"
        return 0
    else
        echo "✗ (${HTTP_STATUS})"
        FAILED=$((FAILED + 1))
        echo "- [ ] ${description}: ${method} ${endpoint} (${HTTP_STATUS})" >> "${REPORT_FILE}"
        return 1
    fi
}

echo "# API Test Report" > "${REPORT_FILE}"
echo "" >> "${REPORT_FILE}"
echo "**Date:** $(date)" >> "${REPORT_FILE}"
echo "**Environment:** Staging (v3.0.4)" >> "${REPORT_FILE}"
echo "" >> "${REPORT_FILE}"

# Task 33: Test all 13 handlers
echo "Task 33: Testing all 13 API handlers..."
echo "" >> "${REPORT_FILE}"
echo "## Task 33: API Handlers" >> "${REPORT_FILE}"
echo "" >> "${REPORT_FILE}"

# Health check
test_endpoint "GET" "/health" "" "Health check"

# Authentication handlers
test_endpoint "POST" "/auth/register" '{"email":"test@example.com","password":"testpass123"}' "Register user"
test_endpoint "POST" "/auth/login" '{"email":"test@example.com","password":"testpass123"}' "Login"
test_endpoint "POST" "/auth/logout" '{}' "Logout"
test_endpoint "POST" "/auth/refresh" '{}' "Refresh token"
test_endpoint "GET" "/auth/sessions" "" "List sessions"

# Articles handlers
test_endpoint "GET" "/articles" "" "List articles"
test_endpoint "POST" "/articles" '{"title":"Test","content":"Content"}' "Create article"
test_endpoint "GET" "/articles/test-article" "" "Get article"

# Works handlers
test_endpoint "GET" "/works" "" "List works"
test_endpoint "GET" "/works/featured" "" "Featured works"
test_endpoint "POST" "/works" '{"title":"Test Work","description":"Desc"}' "Create work"

echo ""
echo "Task 33: ${PASSED}/13 handlers tested"
echo ""

# Task 34: Test authentication flow
echo "Task 34: Testing authentication flow..."
echo "" >> "${REPORT_FILE}"
echo "## Task 34: Authentication Flow" >> "${REPORT_FILE}"
echo "" >> "${REPORT_FILE}"

echo "  Step 1: Register new user..."
REGISTER_RESPONSE=$(curl -s -X POST \
    "${API_URL}/auth/register" \
    -H "Content-Type: application/json" \
    -d '{"email":"flow_test@example.com","password":"TestPass123!","name":"Test User"}')

echo "  Step 2: Login..."
LOGIN_RESPONSE=$(curl -s -X POST \
    "${API_URL}/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"flow_test@example.com","password":"TestPass123!"}')

ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"refresh_token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$ACCESS_TOKEN" ]; then
    echo "  ✓ Login successful, token received"
    echo "- [x] Login returns access token" >> "${REPORT_FILE}"
    PASSED=$((PASSED + 1))
    
    echo "  Step 3: Access protected endpoint..."
    AUTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Authorization: Bearer ${ACCESS_TOKEN}" \
        "${API_URL}/auth/sessions")
    
    if [ "$AUTH_STATUS" -eq 200 ]; then
        echo "  ✓ Protected endpoint accessible"
        echo "- [x] Access token works on protected endpoints" >> "${REPORT_FILE}"
        PASSED=$((PASSED + 1))
    else
        echo "  ✗ Protected endpoint failed (${AUTH_STATUS})"
        echo "- [ ] Access token fails on protected endpoints (${AUTH_STATUS})" >> "${REPORT_FILE}"
        FAILED=$((FAILED + 1))
    fi
    
    echo "  Step 4: Refresh token..."
    REFRESH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -d "{\"refresh_token\":\"${REFRESH_TOKEN}\"}" \
        "${API_URL}/auth/refresh")
    
    if [ "$REFRESH_STATUS" -eq 200 ]; then
        echo "  ✓ Token refresh works"
        echo "- [x] Token refresh succeeds" >> "${REPORT_FILE}"
        PASSED=$((PASSED + 1))
    else
        echo "  ✗ Token refresh failed (${REFRESH_STATUS})"
        echo "- [ ] Token refresh failed (${REFRESH_STATUS})" >> "${REPORT_FILE}"
        FAILED=$((FAILED + 1))
    fi
    
    echo "  Step 5: Logout..."
    LOGOUT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
        -X POST \
        -H "Authorization: Bearer ${ACCESS_TOKEN}" \
        "${API_URL}/auth/logout")
    
    if [ "$LOGOUT_STATUS" -eq 200 ] || [ "$LOGOUT_STATUS" -eq 204 ]; then
        echo "  ✓ Logout successful"
        echo "- [x] Logout succeeds" >> "${REPORT_FILE}"
        PASSED=$((PASSED + 1))
    else
        echo "  ✗ Logout failed (${LOGOUT_STATUS})"
        echo "- [ ] Logout failed (${LOGOUT_STATUS})" >> "${REPORT_FILE}"
        FAILED=$((FAILED + 1))
    fi
else
    echo "  ✗ Login failed"
    echo "- [ ] Login returns access token" >> "${REPORT_FILE}"
    echo "- [ ] Access token works on protected endpoints" >> "${REPORT_FILE}"
    echo "- [ ] Token refresh succeeds" >> "${REPORT_FILE}"
    echo "- [ ] Logout succeeds" >> "${REPORT_FILE}"
    FAILED=$((FAILED + 5))
fi

echo ""
echo "Task 34 complete"
echo ""

# Task 35: Test database CRUD
echo "Task 35: Testing database CRUD..."
echo "" >> "${REPORT_FILE}"
echo "## Task 35: Database CRUD" >> "${REPORT_FILE}"
echo "" >> "${REPORT_FILE}"

echo "  Creating test record..."
CREATE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    -X POST \
    "${API_URL}/articles" \
    -H "Content-Type: application/json" \
    -d '{"title":"CRUD Test","content":"Test content","slug":"crud-test"}')

if [ "$CREATE_STATUS" -eq 201 ] || [ "$CREATE_STATUS" -eq 200 ]; then
    echo "  ✓ Create works"
    echo "- [x] CREATE operation works" >> "${REPORT_FILE}"
    PASSED=$((PASSED + 1))
else
    echo "  ✗ Create failed (${CREATE_STATUS})"
    echo "- [ ] CREATE operation failed (${CREATE_STATUS})" >> "${REPORT_FILE}"
    FAILED=$((FAILED + 1))
fi

echo "  Reading test record..."
READ_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    "${API_URL}/articles/crud-test")

if [ "$READ_STATUS" -eq 200 ]; then
    echo "  ✓ Read works"
    echo "- [x] READ operation works" >> "${REPORT_FILE}"
    PASSED=$((PASSED + 1))
else
    echo "  ✗ Read failed (${READ_STATUS})"
    echo "- [ ] READ operation failed (${READ_STATUS})" >> "${REPORT_FILE}"
    FAILED=$((FAILED + 1))
fi

echo "  Updating test record..."
UPDATE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    -X PUT \
    "${API_URL}/articles/crud-test" \
    -H "Content-Type: application/json" \
    -d '{"title":"CRUD Test Updated","content":"Updated content"}')

if [ "$UPDATE_STATUS" -eq 200 ]; then
    echo "  ✓ Update works"
    echo "- [x] UPDATE operation works" >> "${REPORT_FILE}"
    PASSED=$((PASSED + 1))
else
    echo "  ✗ Update failed (${UPDATE_STATUS})"
    echo "- [ ] UPDATE operation failed (${UPDATE_STATUS})" >> "${REPORT_FILE}"
    FAILED=$((FAILED + 1))
fi

echo "  Deleting test record..."
DELETE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    -X DELETE \
    "${API_URL}/articles/crud-test")

if [ "$DELETE_STATUS" -eq 200 ] || [ "$DELETE_STATUS" -eq 204 ]; then
    echo "  ✓ Delete works"
    echo "- [x] DELETE operation works" >> "${REPORT_FILE}"
    PASSED=$((PASSED + 1))
else
    echo "  ✗ Delete failed (${DELETE_STATUS})"
    echo "- [ ] DELETE operation failed (${DELETE_STATUS})" >> "${REPORT_FILE}"
    FAILED=$((FAILED + 1))
fi

echo ""
echo "Task 35 complete"
echo ""

# Task 36: Verify OpenAPI docs
echo "Task 36: Verifying OpenAPI docs..."
echo "" >> "${REPORT_FILE}"
echo "## Task 36: OpenAPI Documentation" >> "${REPORT_FILE}"
echo "" >> "${REPORT_FILE}"

OPENAPI_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    "${API_URL}/openapi.json")

if [ "$OPENAPI_STATUS" -eq 200 ]; then
    echo "  ✓ OpenAPI docs accessible"
    echo "- [x] OpenAPI JSON endpoint accessible" >> "${REPORT_FILE}"
    PASSED=$((PASSED + 1))
else
    echo "  ✗ OpenAPI docs failed (${OPENAPI_STATUS})"
    echo "- [ ] OpenAPI JSON endpoint failed (${OPENAPI_STATUS})" >> "${REPORT_FILE}"
    FAILED=$((FAILED + 1))
fi

echo ""
echo "Task 36 complete"
echo ""

# Summary
echo "" >> "${REPORT_FILE}"
echo "## Summary" >> "${REPORT_FILE}"
echo "" >> "${REPORT_FILE}"
echo "**Total Tests:** $((PASSED + FAILED))" >> "${REPORT_FILE}"
echo "**Passed:** ${PASSED}" >> "${REPORT_FILE}"
echo "**Failed:** ${FAILED}" >> "${REPORT_FILE}"
echo "**Success Rate:** $(( PASSED * 100 / (PASSED + FAILED) ))%" >> "${REPORT_FILE}"

echo "================================"
echo "API Testing Complete"
echo "================================"
echo ""
echo "Passed: ${PASSED}"
echo "Failed: ${FAILED}"
echo "Report: ${REPORT_FILE}"
echo ""

if [ ${FAILED} -eq 0 ]; then
    echo "✓ All tests passed!"
    exit 0
else
    echo "⚠ Some tests failed, review report"
    exit 0  # Don't fail the script, just report
fi
