#!/bin/bash
BASE="http://localhost:5000"

pass() { echo "  ✅ PASS: $1"; }
fail() { echo "  ❌ FAIL: $1"; }
section() { echo ""; echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"; echo "  $1"; echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"; }

# ─── TEST 1: Health ───────────────────────────────────────────────────────────
section "TEST 1 — Health Check"
R=$(curl -s $BASE/health)
STATUS=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin).get('status',''))")
[ "$STATUS" = "OK" ] && pass "GET /health → status=OK" || fail "GET /health → $R"

# ─── TEST 2: Statistics ───────────────────────────────────────────────────────
section "TEST 2 — Statistics"
R=$(curl -s $BASE/api/statistics)
TOTAL=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['total'])")
PENDING=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['pending'])")
IN_TRANSIT=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['in_transit'])")
DELIVERED=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['delivered'])")
echo "  total=$TOTAL  pending=$PENDING  in_transit=$IN_TRANSIT  delivered=$DELIVERED"
[ "$TOTAL" -ge "8" ] && pass "GET /api/statistics → total=$TOTAL" || fail "Expected >=8, got $TOTAL"

# ─── TEST 3: List shipments ───────────────────────────────────────────────────
section "TEST 3 — List Shipments (page=1, limit=5)"
R=$(curl -s "$BASE/api/shipments?page=1&limit=5")
COUNT=$(echo $R | python3 -c "import json,sys; print(len(json.load(sys.stdin)['data']))")
PTOTAL=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['pagination']['total'])")
[ "$COUNT" = "5" ] && pass "returned 5 shipments" || fail "Expected 5, got $COUNT"
[ "$PTOTAL" -ge "8" ] && pass "pagination.total=$PTOTAL" || fail "Expected >=8, got $PTOTAL"

# ─── TEST 4: Pagination page 2 ────────────────────────────────────────────────
section "TEST 4 — Pagination (page=2, limit=5)"
R=$(curl -s "$BASE/api/shipments?page=2&limit=5")
COUNT=$(echo $R | python3 -c "import json,sys; print(len(json.load(sys.stdin)['data']))")
[ "$COUNT" -ge "1" ] && pass "page 2 returned $COUNT shipments" || fail "page 2 empty"

# ─── TEST 5: Status filters ───────────────────────────────────────────────────
section "TEST 5 — Status Filter: In Transit"
R=$(curl -s "$BASE/api/shipments?status=In%20Transit")
COUNT=$(echo $R | python3 -c "import json,sys; d=json.load(sys.stdin); print(len([s for s in d['data'] if s['status']=='In Transit']))")
[ "$COUNT" -ge "1" ] && pass "In Transit filter → $COUNT shipments" || fail "No In Transit shipments"

section "TEST 5b — Status Filter: Delivered"
R=$(curl -s "$BASE/api/shipments?status=Delivered")
COUNT=$(echo $R | python3 -c "import json,sys; d=json.load(sys.stdin); print(len([s for s in d['data'] if s['status']=='Delivered']))")
[ "$COUNT" -ge "1" ] && pass "Delivered filter → $COUNT shipments" || fail "No Delivered shipments"

section "TEST 5c — Status Filter: Pending"
R=$(curl -s "$BASE/api/shipments?status=Pending")
COUNT=$(echo $R | python3 -c "import json,sys; d=json.load(sys.stdin); print(len([s for s in d['data'] if s['status']=='Pending']))")
[ "$COUNT" -ge "1" ] && pass "Pending filter → $COUNT shipments" || fail "No Pending shipments"

# ─── TEST 6: Create shipment ──────────────────────────────────────────────────
section "TEST 6 — Create Shipment"
R=$(curl -s -X POST $BASE/api/shipments \
  -H "Content-Type: application/json" \
  -d '{"sender_name":"Rahul Gupta","sender_phone":"+91-9988776655","sender_address":"42 Linking Road","sender_city":"Mumbai","sender_pincode":"400050","receiver_name":"Anjali Verma","receiver_phone":"+91-8877665544","receiver_address":"15 Sector 62","receiver_city":"Noida","receiver_pincode":"201309","package_type":"Electronics","weight":3.5,"value":75000,"description":"iPhone 15 Pro","estimated_delivery":"2026-05-03"}')
SUCCESS=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['success'])")
NEW_ID=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['id'])")
NEW_TRACKING=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['tracking_id'])")
[ "$SUCCESS" = "True" ] && pass "POST /api/shipments → tracking_id=$NEW_TRACKING" || fail "Create failed: $R"

# ─── TEST 7: Get by ID ────────────────────────────────────────────────────────
section "TEST 7 — Get Shipment by ID"
R=$(curl -s "$BASE/api/shipments/$NEW_ID")
SUCCESS=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['success'])")
EVENTS=$(echo $R | python3 -c "import json,sys; print(len(json.load(sys.stdin)['data'].get('events',[])))")
[ "$SUCCESS" = "True" ] && pass "GET /api/shipments/$NEW_ID → success" || fail "Get by ID failed"
[ "$EVENTS" -ge "1" ] && pass "events array has $EVENTS event(s)" || fail "No events returned"

# ─── TEST 8: Track by tracking ID ────────────────────────────────────────────
section "TEST 8 — Track by Tracking ID"
R=$(curl -s "$BASE/api/track/$NEW_TRACKING")
SUCCESS=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['success'])")
TID=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['tracking_id'])")
[ "$SUCCESS" = "True" ] && pass "GET /api/track/$NEW_TRACKING → success" || fail "Track failed: $R"
[ "$TID" = "$NEW_TRACKING" ] && pass "tracking_id matches" || fail "tracking_id mismatch"

# ─── TEST 9: Track seeded shipment with events ────────────────────────────────
section "TEST 9 — Track Seeded Shipment (IND202604280001)"
R=$(curl -s "$BASE/api/track/IND202604280001")
SUCCESS=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['success'])")
EVENTS=$(echo $R | python3 -c "import json,sys; print(len(json.load(sys.stdin)['data'].get('events',[])))")
[ "$SUCCESS" = "True" ] && pass "Track IND202604280001 → success" || fail "Track seeded failed"
[ "$EVENTS" -ge "4" ] && pass "has $EVENTS events (CREATED→PICKUP→TRANSIT→HUB_SORT)" || fail "Expected >=4 events, got $EVENTS"

# ─── TEST 10: Track not found ─────────────────────────────────────────────────
section "TEST 10 — Track Not Found (404)"
R=$(curl -s "$BASE/api/track/INVALID999999")
SUCCESS=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['success'])")
[ "$SUCCESS" = "False" ] && pass "Track INVALID999999 → 404 not found" || fail "Expected failure, got success"

# ─── TEST 11: Update shipment ─────────────────────────────────────────────────
section "TEST 11 — Update Shipment Status + Location + Agent"
R=$(curl -s -X PUT "$BASE/api/shipments/$NEW_ID" \
  -H "Content-Type: application/json" \
  -d '{"status":"In Transit","current_location":"Delhi Transit Hub","assigned_agent":"Ravi Kumar","vehicle_number":"DL-01-AB-9999"}')
SUCCESS=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['success'])")
NEW_STATUS=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['status'])")
AGENT=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['assigned_agent'])")
[ "$SUCCESS" = "True" ] && pass "PUT /api/shipments/$NEW_ID → success" || fail "Update failed: $R"
[ "$NEW_STATUS" = "In Transit" ] && pass "status updated to In Transit" || fail "Status not updated: $NEW_STATUS"
[ "$AGENT" = "Ravi Kumar" ] && pass "assigned_agent=Ravi Kumar" || fail "Agent not updated: $AGENT"

# ─── TEST 12: Add event ───────────────────────────────────────────────────────
section "TEST 12 — Add Tracking Event"
R=$(curl -s -X POST "$BASE/api/shipments/$NEW_ID/events" \
  -H "Content-Type: application/json" \
  -d '{"status":"In Transit","location":"Delhi Transit Hub","event_type":"TRANSIT","description":"Package arrived at Delhi sorting hub","agent_name":"Ravi Kumar"}')
SUCCESS=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['success'])")
[ "$SUCCESS" = "True" ] && pass "POST /api/shipments/$NEW_ID/events → success" || fail "Add event failed: $R"

# ─── TEST 13: Get events ──────────────────────────────────────────────────────
section "TEST 13 — Get Events for Shipment"
R=$(curl -s "$BASE/api/shipments/$NEW_ID/events")
COUNT=$(echo $R | python3 -c "import json,sys; print(len(json.load(sys.stdin)['data']))")
[ "$COUNT" -ge "2" ] && pass "GET events → $COUNT events (CREATED + TRANSIT)" || fail "Expected >=2 events, got $COUNT"
echo "  Events:"
echo $R | python3 -c "
import json,sys
for e in json.load(sys.stdin)['data']:
    print('   ', e['event_type'], '|', e['location'], '|', e.get('description',''))
"

# ─── TEST 14: Bulk update ─────────────────────────────────────────────────────
section "TEST 14 — Bulk Update (mark 2 Pending as Delivered)"
PENDING_RESP=$(curl -s "$BASE/api/shipments?status=Pending&limit=2")
ID1=$(echo $PENDING_RESP | python3 -c "import json,sys; d=json.load(sys.stdin)['data']; print(d[0]['id']) if len(d)>0 else print('')")
ID2=$(echo $PENDING_RESP | python3 -c "import json,sys; d=json.load(sys.stdin)['data']; print(d[1]['id']) if len(d)>1 else print(d[0]['id'])")
echo "  IDs: $ID1, $ID2"
R=$(curl -s -X POST "$BASE/api/shipments/bulk-update" \
  -H "Content-Type: application/json" \
  -d "{\"ids\":[\"$ID1\",\"$ID2\"],\"status\":\"Delivered\"}")
SUCCESS=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['success'])")
UPDATED=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['updated'])")
[ "$SUCCESS" = "True" ] && pass "POST /api/shipments/bulk-update → success" || fail "Bulk update failed: $R"
[ "$UPDATED" -ge "1" ] && pass "updated=$UPDATED shipments" || fail "Expected >=1 updated, got $UPDATED"

# ─── TEST 15: Stats after bulk update ────────────────────────────────────────
section "TEST 15 — Stats After Bulk Update"
R=$(curl -s $BASE/api/statistics)
DELIVERED=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['delivered'])")
[ "$DELIVERED" -ge "4" ] && pass "delivered count now $DELIVERED (was 2, +2 from bulk)" || fail "Expected >=4 delivered, got $DELIVERED"

# ─── TEST 16: Supply chain ────────────────────────────────────────────────────
section "TEST 16 — Supply Chain Shipments"
R=$(curl -s "$BASE/shipments")
COUNT=$(echo $R | python3 -c "import json,sys; print(len(json.load(sys.stdin)['data']))")
[ "$COUNT" -ge "8" ] && pass "GET /shipments → $COUNT supply chain shipments" || fail "Expected >=8, got $COUNT"
echo "  Sample:"
echo $R | python3 -c "
import json,sys
for s in json.load(sys.stdin)['data'][:3]:
    print('   ', s['tracking_id'], '|', s['origin'], '->', s['destination'], '|', s['status'])
"

# ─── TEST 17: Risk prediction ─────────────────────────────────────────────────
section "TEST 17 — Risk Prediction"
SHIP_ID=$(curl -s "$BASE/api/shipments?limit=1" | python3 -c "import json,sys; print(json.load(sys.stdin)['data'][0]['id'])")
R=$(curl -s "$BASE/predict-risk/$SHIP_ID")
SUCCESS=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['success'])")
RISK=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['riskLevel'])")
SCORE=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['riskScore'])")
WEATHER=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['weatherCondition'])")
TRAFFIC=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['trafficType'])")
[ "$SUCCESS" = "True" ] && pass "GET /predict-risk → riskLevel=$RISK, score=$SCORE, weather=$WEATHER, traffic=$TRAFFIC" || fail "Risk prediction failed"

# ─── TEST 18: Route optimization ─────────────────────────────────────────────
section "TEST 18 — Route Optimization"
R=$(curl -s "$BASE/optimize-route/$SHIP_ID")
SUCCESS=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['success'])")
SAVED=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['timeSaved'])")
COST=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['costSaved'])")
CONF=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['confidence'])")
[ "$SUCCESS" = "True" ] && pass "GET /optimize-route → timeSaved=${SAVED}h, costSaved=Rs${COST}, confidence=${CONF}%" || fail "Route optimization failed"

# ─── TEST 19: Validation ──────────────────────────────────────────────────────
section "TEST 19 — Validation: Missing Required Fields"
R=$(curl -s -X POST $BASE/api/shipments \
  -H "Content-Type: application/json" \
  -d '{"sender_name":"Only Name"}')
SUCCESS=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['success'])")
[ "$SUCCESS" = "False" ] && pass "POST with missing fields → validation error" || fail "Expected validation error"

# ─── TEST 20: Delete shipment ─────────────────────────────────────────────────
section "TEST 20 — Delete Shipment"
THROW=$(curl -s -X POST $BASE/api/shipments \
  -H "Content-Type: application/json" \
  -d '{"sender_name":"Delete Me","sender_phone":"+91-0000000000","sender_address":"1 Delete St","sender_city":"Mumbai","sender_pincode":"400001","receiver_name":"Gone","receiver_phone":"+91-0000000001","receiver_address":"2 Gone Ave","receiver_city":"Delhi","receiver_pincode":"110001","package_type":"Documents","weight":0.1,"estimated_delivery":"2026-05-01"}')
DEL_ID=$(echo $THROW | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['id'])")
echo "  Deleting: $DEL_ID"
R=$(curl -s -X DELETE "$BASE/api/shipments/$DEL_ID")
SUCCESS=$(echo $R | python3 -c "import json,sys; print(json.load(sys.stdin)['success'])")
[ "$SUCCESS" = "True" ] && pass "DELETE /api/shipments/$DEL_ID → success" || fail "Delete failed: $R"
R2=$(curl -s "$BASE/api/shipments/$DEL_ID")
SUCCESS2=$(echo $R2 | python3 -c "import json,sys; print(json.load(sys.stdin)['success'])")
[ "$SUCCESS2" = "False" ] && pass "Verify deleted: GET returns not found" || fail "Shipment still exists after delete"

# ─── TEST 21: Final stats ─────────────────────────────────────────────────────
section "TEST 21 — Final Statistics Summary"
R=$(curl -s $BASE/api/statistics)
echo $R | python3 -c "
import json, sys
d = json.load(sys.stdin)['data']
print('  total:', d['total'])
print('  pending:', d['pending'])
print('  in_transit:', d['in_transit'])
print('  out_for_delivery:', d['out_for_delivery'])
print('  delivered:', d['delivered'])
print('  total_weight:', d['total_weight'], 'kg')
print('  total_value: Rs', d['total_value'])
"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ALL 21 TESTS COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
