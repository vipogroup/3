# Status Contract Audit Summary

## Canonical Invariants
- `status` must be one of `draft`, `pending`, `paid`, `cancelled`, `completed`, `failed`.
- `paymentStatus` must be one of the defined payment enum values.
- `status='paid'` requires `paymentStatus` ∈ {`success`, `final-success`}.
- `status='completed'` requires `paymentStatus` ∈ {`success`, `final-success`}.
- `status='cancelled'` forces `paymentStatus='cancelled'`.
- `status='failed'` permits only {`failed`, `final-failed`, `chargeback`, `refunded`, `partial_refund`}.
- `draft`/`pending` allow only {`pending`, `processing`, `initiated`}.
- No regression from a final state (`paid`, `cancelled`, `completed`, `failed`) back to a non-final state without explicit override (not yet implemented).

## Enforcement Points
- `lib/orders/status.js`
  - `normalizeOrderStatus`, `coercePaymentStatusForOrderStatus`, `assertOrderStatusInvariant`, `canTransitionOrderStatus`.
- `models/Order.js`
  - `pre('validate')` hook normalizes, coerces, and asserts.
- `app/api/orders/route.js` (POST)
  - Normalizes request payload, coerces payment, asserts invariant before insert.
- `app/api/orders/[id]/route.js` (PUT/PATCH)
  - Normalizes, validates transitions via `canTransitionOrderStatus`, coerces payment, asserts invariant prior to update.
- `app/api/orders/[id]/status/route.js` (POST)
  - Applies the same pipeline and returns old/new state snapshot.

## Transition Rules
- `draft → pending | cancelled | failed`
- `pending → paid | cancelled | failed`
- `paid → completed | cancelled | failed`
- `completed`, `cancelled`, `failed` have no forward transitions (idempotent updates permitted).
- Regression to earlier lifecycle states is blocked unless a future admin override capability is introduced (`TODO`).

## Smoke Test Result
```
> npm run status:smoke
STATUS_CONTRACT_SMOKE: PASS
{
  "ok": true,
  "checksCount": 97,
  "firstFailure": null
}
```

## Remaining Write Paths & TODO Plan
- `app/api/payplus/webhook/route.js` — update webhook handlers to use normalize → transition guard → coerce → assert before persisting PayPlus events.
- `cron`/`job` scripts (e.g., under `scripts/` and `jobs/` if present) that mutate `Order` documents directly — add wrapper to reuse the canonical helpers.
- `integration` utilities that touch `Order` (Priority sync, retries) — audit and align with the invariant helpers.
- Follow-up: Introduce `ADMIN_PERMISSIONS.OVERRIDE_ORDER_TRANSITIONS` flag once policy is defined, enabling controlled overrides while logging.
