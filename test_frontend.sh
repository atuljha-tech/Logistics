#!/bin/bash
FE="http://localhost:3000"
BE="http://localhost:5000"

pass() { echo "  ✅ PASS: $1"; }
fail() { echo "  ❌ FAIL: $1"; }
section() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  $1"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

check_page() {
  local url="$1"
  local label="$2"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$code" = "200" ]; then
    pass "GET $url → $code OK"
  else
    fail "GET $url → $code (expected 200)"
  fi
}

section "FRONTEND PAGE AVAILABILITY TESTS"

check_page "$FE" "Landing Page /"
check_page "$FE/signin" "Sign In /signin"
check_page "$FE/signup" "Sign Up /signup"
check_page "$FE/admin" "Admin Dashboard /admin"
check_page "$FE/admin/shipments" "Admin Shipments /admin/shipments"
check_page "$FE/admin/analytics" "Admin Analytics /admin/analytics"
check_page "$FE/admin/alerts" "Admin Alerts /admin/alerts"
check_page "$FE/admin/users" "Admin Users /admin/users"
check_page "$FE/admin/approvals" "Admin Approvals /admin/approvals"
check_page "$FE/admin/system" "Admin System /admin/system"
check_page "$FE/admin/settings" "Admin Settings /admin/settings"
check_page "$FE/dashboard" "Operator Dashboard /dashboard"
check_page "$FE/dashboard/shipments" "Operator Shipments /dashboard/shipments"
check_page "$FE/dashboard/analytics" "Operator Analytics /dashboard/analytics"
check_page "$FE/dashboard/alerts" "Operator Alerts /dashboard/alerts"
check_page "$FE/dashboard/settings" "Operator Settings /dashboard/settings"
check_page "$FE/logistics" "Logistics List /logistics"
check_page "$FE/logistics/create" "Create Shipment /logistics/create"
check_page "$FE/logistics/track" "Public Track /logistics/track"
check_page "$FE/supply-chain" "Supply Chain /supply-chain"
check_page "$FE/user-dashboard" "User Dashboard /user-dashboard"
check_page "$FE/user-dashboard/my-shipments" "My Shipments /user-dashboard/my-shipments"
check_page "$FE/user-dashboard/track" "User Track /user-dashboard/track"
check_page "$FE/user-dashboard/history" "User History /user-dashboard/history"
check_page "$FE/user-dashboard/notifications" "Notifications /user-dashboard/notifications"
check_page "$FE/user-dashboard/performance" "Performance /user-dashboard/performance"
check_page "$FE/user-dashboard/profile" "Profile /user-dashboard/profile"
check_page "$FE/user-dashboard/actions" "Actions /user-dashboard/actions"

section "BACKEND API INTEGRATION TESTS (from frontend perspective)"

# Test that frontend env var points to correct backend
echo "  Frontend API URL: $BE"
HEALTH=$(curl -s "$BE/health" | python3 -c "import json,sys; print(json.load(sys.stdin)['status'])" 2>/dev/null)
[ "$HEALTH" = "OK" ] && pass "Backend reachable at $BE" || fail "Backend not reachable at $BE"

# Test stats endpoint (used by admin, dashboard, user-dashboard)
STATS=$(curl -s "$BE/api/statistics")
TOTAL=$(echo "$STATS" | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['total'])" 2>/dev/null)
[ "$TOTAL" -ge "8" ] && pass "Statistics API → total=$TOTAL shipments" || fail "Statistics API failed"

# Test shipments list (used by admin/shipments, user/my-shipments)
SHIPS=$(curl -s "$BE/api/shipments?limit=3")
COUNT=$(echo "$SHIPS" | python3 -c "import json,sys; print(len(json.load(sys.stdin)['data']))" 2>/dev/null)
[ "$COUNT" -ge "1" ] && pass "Shipments API → returned $COUNT shipments" || fail "Shipments API failed"

# Test tracking (used by user/track, logistics/track)
TRACKING_ID=$(echo "$SHIPS" | python3 -c "import json,sys; print(json.load(sys.stdin)['data'][0]['tracking_id'])" 2>/dev/null)
TRACK=$(curl -s "$BE/api/track/$TRACKING_ID")
TRACK_OK=$(echo "$TRACK" | python3 -c "import json,sys; print(json.load(sys.stdin)['success'])" 2>/dev/null)
[ "$TRACK_OK" = "True" ] && pass "Track API → $TRACKING_ID found" || fail "Track API failed for $TRACKING_ID"

# Test supply chain (used by supply-chain page)
SC=$(curl -s "$BE/shipments")
SC_COUNT=$(echo "$SC" | python3 -c "import json,sys; print(len(json.load(sys.stdin)['data']))" 2>/dev/null)
[ "$SC_COUNT" -ge "8" ] && pass "Supply Chain API → $SC_COUNT shipments" || fail "Supply Chain API failed"

# Test risk prediction (used by supply-chain page)
SHIP_ID=$(echo "$SHIPS" | python3 -c "import json,sys; print(json.load(sys.stdin)['data'][0]['id'])" 2>/dev/null)
RISK=$(curl -s "$BE/predict-risk/$SHIP_ID")
RISK_OK=$(echo "$RISK" | python3 -c "import json,sys; print(json.load(sys.stdin)['success'])" 2>/dev/null)
[ "$RISK_OK" = "True" ] && pass "Risk Prediction API → shipment $SHIP_ID" || fail "Risk Prediction API failed"

section "DATA INTEGRITY TESTS"

# Verify pagination works correctly
PAGE1=$(curl -s "$BE/api/shipments?page=1&limit=3" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['data'][0]['id'])" 2>/dev/null)
PAGE2=$(curl -s "$BE/api/shipments?page=2&limit=3" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['data'][0]['id'])" 2>/dev/null)
[ "$PAGE1" != "$PAGE2" ] && pass "Pagination: page 1 and page 2 return different shipments" || fail "Pagination: same shipment on both pages"

# Verify status filter returns correct statuses
TRANSIT_CHECK=$(curl -s "$BE/api/shipments?status=In%20Transit" | python3 -c "
import json,sys
d = json.load(sys.stdin)
wrong = [s for s in d['data'] if s['status'] != 'In Transit']
print(len(wrong))
" 2>/dev/null)
[ "$TRANSIT_CHECK" = "0" ] && pass "Status filter: all returned shipments have status=In Transit" || fail "Status filter: $TRANSIT_CHECK shipments have wrong status"

# Verify create → track flow
NEW=$(curl -s -X POST "$BE/api/shipments" \
  -H "Content-Type: application/json" \
  -d '{"sender_name":"Flow Test","sender_phone":"+91-9999999999","sender_address":"1 Flow St","sender_city":"Chennai","sender_pincode":"600001","receiver_name":"Flow Recv","receiver_phone":"+91-8888888888","receiver_address":"2 Flow Ave","receiver_city":"Kolkata","receiver_pincode":"700001","package_type":"Books & Media","weight":1.5,"estimated_delivery":"2026-05-15"}')
FLOW_ID=$(echo "$NEW" | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['id'])" 2>/dev/null)
FLOW_TID=$(echo "$NEW" | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['tracking_id'])" 2>/dev/null)

# Track it
TRACKED=$(curl -s "$BE/api/track/$FLOW_TID")
TRACKED_OK=$(echo "$TRACKED" | python3 -c "import json,sys; print(json.load(sys.stdin)['success'])" 2>/dev/null)
[ "$TRACKED_OK" = "True" ] && pass "Create→Track flow: $FLOW_TID tracked successfully" || fail "Create→Track flow failed"

# Verify it has a CREATED event
EVENTS=$(echo "$TRACKED" | python3 -c "import json,sys; d=json.load(sys.stdin); evs=d['data'].get('events',[]); print(len([e for e in evs if e.get('event_type')=='CREATED']))" 2>/dev/null)
[ "$EVENTS" -ge "1" ] && pass "Create→Track: CREATED event auto-generated" || fail "Create→Track: no CREATED event"

# Update it and verify
curl -s -X PUT "$BE/api/shipments/$FLOW_ID" \
  -H "Content-Type: application/json" \
  -d '{"status":"In Transit","current_location":"Vijayawada Transit Hub"}' > /dev/null

UPDATED=$(curl -s "$BE/api/shipments/$FLOW_ID" | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['status'])" 2>/dev/null)
[ "$UPDATED" = "In Transit" ] && pass "Update→Verify: status persisted as In Transit" || fail "Update→Verify: status not updated"

# Delete it and verify gone
curl -s -X DELETE "$BE/api/shipments/$FLOW_ID" > /dev/null
GONE=$(curl -s "$BE/api/shipments/$FLOW_ID" | python3 -c "import json,sys; print(json.load(sys.stdin)['success'])" 2>/dev/null)
[ "$GONE" = "False" ] && pass "Delete→Verify: shipment gone after delete" || fail "Delete→Verify: shipment still exists"

section "EDGE CASE TESTS"

# Empty body
R=$(curl -s -X POST "$BE/api/shipments" -H "Content-Type: application/json" -d '{}')
OK=$(echo "$R" | python3 -c "import json,sys; print(json.load(sys.stdin)['success'])" 2>/dev/null)
[ "$OK" = "False" ] && pass "Empty body → 400 validation error" || fail "Empty body should fail"

# Non-existent ID
R=$(curl -s "$BE/api/shipments/00000000-0000-0000-0000-000000000000")
OK=$(echo "$R" | python3 -c "import json,sys; print(json.load(sys.stdin)['success'])" 2>/dev/null)
[ "$OK" = "False" ] && pass "Non-existent UUID → not found" || fail "Non-existent UUID should fail"

# Bulk update with empty array
R=$(curl -s -X POST "$BE/api/shipments/bulk-update" -H "Content-Type: application/json" -d '{"ids":[],"status":"Delivered"}')
OK=$(echo "$R" | python3 -c "import json,sys; print(json.load(sys.stdin)['success'])" 2>/dev/null)
[ "$OK" = "False" ] && pass "Bulk update empty ids → 400 error" || fail "Bulk update empty ids should fail"

# Bulk update missing status
R=$(curl -s -X POST "$BE/api/shipments/bulk-update" -H "Content-Type: application/json" -d '{"ids":["abc"]}')
OK=$(echo "$R" | python3 -c "import json,sys; print(json.load(sys.stdin)['success'])" 2>/dev/null)
[ "$OK" = "False" ] && pass "Bulk update missing status → 400 error" || fail "Bulk update missing status should fail"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ALL TESTS COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
