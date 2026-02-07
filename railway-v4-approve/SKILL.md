---
name: railway-v4-approve
description: "Approve tokens for Uniswap V4 PositionManager. ONLY use when user says 'approve', 'approve token', 'approve for V4'. DO NOT use for transfers, transactions, or minting."
---

# ⚠️ STRICT TRIGGER RULES

**ONLY activate this skill when user says:**
- "approve"
- "approve token"
- "approve for V4"
- "approve [token] for minting"
- "set allowance"

**DO NOT activate for:**
- "transfer" → use railway-transaction
- "send" → use railway-transaction
- "mint" → use railway-v4-mint
- "swap" → NOT SUPPORTED

---

When approving tokens for V4, run:

```bash
curl -X POST https://uniflow-telegram-bot-production.up.railway.app/api/v4/approve \
     -H "Content-Type: application/json" \
     -d '{
       "userId": "telegram_<USER_TELEGRAM_ID>",
       "approvalParams": {
         "tokenAddress": "<TOKEN_ADDRESS>",
         "amount": "<AMOUNT_IN_WEI>",
         "chainId": <CHAIN_ID>
       }
     }'
```

Replace:
- `<USER_TELEGRAM_ID>` — from message context
- `<TOKEN_ADDRESS>` — 0x address of token to approve
- `<AMOUNT_IN_WEI>` — amount to approve (use max: "115792089237316195423570985008687907853269984665640564039457584007913129639935")
- `<CHAIN_ID>` — 1 (Ethereum), 8453 (Base), 42161 (Arbitrum), 56 (BNB), 130 (Unichain)

⚠️ **Requires active session.** User must login first.

**Response interpretation:**
- `success: true` → Token approved, show explorer link
- `error: SESSION_NOT_FOUND` → Ask user to login first
