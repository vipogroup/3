# Test Harness Admin API

## Gate & Permissions
- Feature availability is controlled by `lib/testHarness/gate.js`.
- Gate enabled when `NODE_ENV !== 'production'` **or** `process.env.ENABLE_TEST_HARNESS === 'true'`.
- Only admins with `ADMIN_PERMISSIONS.MANAGE_TEST_HARNESS` (or super admins) may access the API.
- Disabled gate returns **404** to hide the feature; missing permission returns **403**.

## Endpoints
| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/admin/test-harness/status` | Returns gate status and caller permission flag. |
| POST | `/api/admin/test-harness/seed` | Creates/ensures synthetic seed data (users, product, order, transaction). |
| POST | `/api/admin/test-harness/mock-payment-success` | Simulates successful payment for an order (status→paid, paymentStatus→success). |
| POST | `/api/admin/test-harness/mock-payment-fail` | Simulates failed payment for an order (status→failed, paymentStatus→failed). |

### GET /status
Response shape:
```json
{
  "enabled": true,
  "nodeEnv": "development",
  "enableTestHarness": true,
  "hasPermission": true
}
```

### POST /seed
- Ensures a tenant-scoped seed set tagged `test_harness` (customer + agent users, product, pending order, transaction).
- Response example:
```json
{
  "seedId": "seed_6735e4b019f1f6d346a2b0c7",
  "userIds": {
    "customer": "6735e4b019f1f6d346a2b0c5",
    "agent": "6735e4b019f1f6d346a2b0c6"
  },
  "productId": "6735e4b019f1f6d346a2b0c8",
  "orderId": "6735e4b019f1f6d346a2b0c7",
  "transactionId": "6735e4b019f1f6d346a2b0c9"
}
```

### POST /mock-payment-success
- Body: `{ "orderId": "..." }`
- Uses `applyOrderStatusUpdate` to coerce status/payment atomically.
- Response example:
```json
{
  "orderId": "6735e4b019f1f6d346a2b0c7",
  "oldStatus": "pending",
  "newStatus": "paid",
  "oldPaymentStatus": "pending",
  "newPaymentStatus": "success"
}
```

### POST /mock-payment-fail
- Body: `{ "orderId": "..." }`
- Response mirrors success endpoint, targeting `failed`/`failed`.

## Audit Logging
- `test_harness.seed_created`
- `test_harness.mock_payment_success`
- `test_harness.mock_payment_fail`

Each endpoint logs actor, order ID, request ID, tenant context, and status transitions.

## Handling Mongo Connectivity Issues

If Atlas DNS lookup fails (e.g., `ENOTFOUND _mongodb._tcp.<cluster-host>`):

1. Run the diagnostics helper:
   ```bash
   npm run mongo:diagnose
   ```
   Review SRV/A record results to confirm whether DNS or network restrictions block access.
2. Adjust networking:
   - Connect to the required VPN.
   - Or switch DNS resolver (e.g., set system DNS to `1.1.1.1` or `8.8.8.8`).
3. As a fallback for development/testing, spin up local MongoDB via Docker:
   ```bash
   npm run mongo:up
   # when finished
   npm run mongo:down
   ```
   Then set (or export) the connection string:
   ```bash
   MONGODB_URI=mongodb://127.0.0.1:27017/vipo_dev
   ```
   The codebase will also default to this URI automatically when `NODE_ENV !== 'production'` and no `MONGODB_URI` is set.

## Manual Smoke (example)
```
GET  /api/admin/test-harness/status  → 200 { enabled: true, hasPermission: true }
POST /api/admin/test-harness/seed    → 200 { seedId: "seed_..." }
POST /api/admin/test-harness/mock-payment-success { orderId } → 200 { newStatus: "paid" }
POST /api/admin/test-harness/mock-payment-fail    { orderId } → 200 { newStatus: "failed" }
```
*Manual requests were not executed in this environment; expected outputs recorded for reference.*
