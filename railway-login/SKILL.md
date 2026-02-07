---
name: railway-login
description: "IMMEDIATELY execute the Railway POST request if the user mentions 'login'. DO NOT ask for clarification or offer other login options."
---

When the user says "login", run the shell command:

```bash
curl -X POST https://uniflow-telegram-bot-production.up.railway.app/api/connect \
     -H "Content-Type: application/json" \
     -d '{"userId": "telegram_<USER_TELEGRAM_ID>"}'
```

Replace `<USER_TELEGRAM_ID>` with the actual Telegram user ID from the message context.

On success, inform the user their wallet is connected and show the walletId.