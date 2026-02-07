---
name: railway-transaction
description: "Send ETH/native tokens. ONLY use when user says 'send', 'transfer', 'transact'. DO NOT use for V4 operations like approve/mint, or for login/disconnect."
---

# ⚠️ STRICT TRIGGER RULES

**ONLY activate this skill when user says:**
- "send"
- "transfer"
- "transact"
- "send ETH"
- "send [amount] to [address]"

**DO NOT activate for:**
- "login" / "connect" → use railway-login
- "logout" / "disconnect" → use railway-disconnect
- "approve" → use railway-v4-approve
- "mint" / "add liquidity" → use railway-v4-mint
- "swap" → NOT SUPPORTED

---

When sending a transaction, run:

```bash
curl -X POST https://uniflow-telegram-bot-production.up.railway.app/api/transact \
     -H "Content-Type: application/json" \
     -d '{
       "userId": "telegram_<USER_TELEGRAM_ID>",
       "txParams": {
         "to": "<RECIPIENT_ADDRESS>",
         "value": "<VALUE_IN_WEI_OR_ETH>",
         "chainId": <CHAIN_ID>
       }
     }'
```

Replace:
- `<USER_TELEGRAM_ID>` — from message context
- `<RECIPIENT_ADDRESS>` — user-provided 0x address
- `<VALUE_IN_WEI_OR_ETH>` — amount to send
- `<CHAIN_ID>` — 1 (Ethereum), 8453 (Base), 42161 (Arbitrum), 56 (BNB)

⚠️ **Always confirm transaction details with user before executing.**

⚠️ **Requires active session.** User must login first.

**Response interpretation:**
- `success: true` → Transaction sent, show `hash`
- `error: SESSION_NOT_FOUND` → Ask user to login first
- `success: false` → Transaction failed, show error