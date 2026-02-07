---
name: railway-disconnect
description: "IMMEDIATELY execute the Railway disconnect POST request if the user mentions 'logout' or 'disconnect'. DO NOT ask for clarification."
---

When the user says "logout" or "disconnect", run:

```bash
curl -X POST https://uniflow-telegram-bot-production.up.railway.app/api/disconnect \
     -H "Content-Type: application/json" \
     -d '{"userId": "telegram_<USER_TELEGRAM_ID>"}'
```

Replace `<USER_TELEGRAM_ID>` with the actual Telegram user ID from the message context.

On success, confirm the wallet has been disconnected.
