---
name: railway-transaction
description: "Executes a blockchain transaction on Railway. It requires the user to provide a 'value' amount."
---

When the user wants to send a transaction, use:

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

Always confirm transaction details with user before executing.