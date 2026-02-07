---
name: railway-v4-positions
description: "Get Uniswap V4 liquidity positions. ONLY use when user says 'positions', 'my positions', 'show positions', 'V4 positions', or 'liquidity positions'. DO NOT use for minting or approving."
---

# ⚠️ STRICT TRIGGER RULES

**ONLY activate this skill when user says:**
- "positions"
- "my positions"
- "show positions"
- "V4 positions"
- "liquidity positions"
- "get my LP positions"

**DO NOT activate for:**
- "mint" → use railway-v4-mint
- "approve" → use railway-v4-approve
- "pool info" → use railway-v4-pool-info
- "transact" → use railway-transaction

---

When fetching V4 positions, run:

```bash
curl -X GET "https://uniflow-telegram-bot-production.up.railway.app/api/v4/positions/<WALLET_ADDRESS>?chainId=<CHAIN_ID>"
```

Replace:
- `<WALLET_ADDRESS>` — 0x wallet address (required)
- `<CHAIN_ID>` — optional: 1 (Ethereum), 8453 (Base), 42161 (Arbitrum), 56 (BNB), 130 (Unichain)

If no chainId provided, fetches positions from all supported chains.

**Response interpretation:**
- `positions: [...]` → List of liquidity positions with tokenIds, amounts, tick ranges
- `chainErrors: {...}` → Any errors per chain during fetching
