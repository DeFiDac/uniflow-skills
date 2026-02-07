---
name: railway-disconnect
description: "Disconnect wallet from UniFlow. ONLY use when user says 'logout', 'disconnect', 'sign out'. DO NOT use for login, session check, or transactions."
---

# ⚠️ STRICT TRIGGER RULES

**ONLY activate this skill when user says:**
- "logout"
- "disconnect"
- "sign out"
- "end session"
- "bye"

**DO NOT activate for:**
- "login" / "connect" → use railway-login
- "session" / "check session" → use railway-session
- "send" / "transfer" → use railway-transaction
- "positions" → use railway-v4-positions

---

When disconnecting wallet, run:

```bash
curl -X POST https://uniflow-telegram-bot-production.up.railway.app/api/disconnect \
     -H "Content-Type: application/json" \
     -d '{"userId": "telegram_<USER_TELEGRAM_ID>"}'
```

Replace `<USER_TELEGRAM_ID>` with the actual Telegram user ID from the message context.

**Response interpretation:**
- `success: true` → Wallet disconnected, confirm to user
- `message: "No active session"` → User was not connected, inform them
