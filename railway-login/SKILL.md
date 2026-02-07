---
name: railway-login
description: "Connect wallet to UniFlow. ONLY use when user says 'login', 'connect', 'connect wallet'. DO NOT use for session check, disconnect, or transactions."
---

# ⚠️ STRICT TRIGGER RULES

**ONLY activate this skill when user says:**
- "login"
- "connect"
- "connect wallet"
- "sign in"
- "start"

**DO NOT activate for:**
- "session" / "check session" → use railway-session
- "logout" / "disconnect" → use railway-disconnect
- "send" / "transfer" / "transaction" → use railway-transaction
- "positions" → use railway-v4-positions
- "approve" → use railway-v4-approve
- "mint" → use railway-v4-mint

---

When connecting wallet, run:

```bash
curl -X POST https://uniflow-telegram-bot-production.up.railway.app/api/connect \
     -H "Content-Type: application/json" \
     -d '{"userId": "telegram_<USER_TELEGRAM_ID>"}'
```

Replace `<USER_TELEGRAM_ID>` with the actual Telegram user ID from the message context.

**Response interpretation:**
- `success: true` → Wallet connected, show `walletAddress` and `walletId`
- `isNewUser: true` → New wallet was created for user
- `isNewUser: false` → Existing wallet reconnected
- `success: false` → Connection failed, show error message