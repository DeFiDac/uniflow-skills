---
name: railway-session
description: "Check wallet session status. ONLY use when user says 'session', 'check session', 'am I connected', or 'wallet status'. DO NOT use for login/connect/transact."
---

# ⚠️ STRICT TRIGGER RULES

**ONLY activate this skill when user says:**
- "session"
- "check session"
- "am I connected"
- "wallet status"
- "is my wallet connected"

**DO NOT activate for:**
- "login" → use railway-login
- "connect" → use railway-login
- "disconnect" → use railway-disconnect
- "transaction" → use railway-transaction

---

When checking session status, run:

```bash
curl -X GET "https://uniflow-telegram-bot-production.up.railway.app/api/session/telegram_<USER_TELEGRAM_ID>"
```

Replace `<USER_TELEGRAM_ID>` with the actual Telegram user ID from the message context.

**Response interpretation:**
- `hasSession: true` → Wallet is connected, show `walletAddress`
- `hasSession: false` → No active session, suggest user to login
