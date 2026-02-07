---
name: railway-v4-pool-info
description: "Discover Uniswap V4 pool for a token pair. ONLY use when user says 'pool info', 'find pool', 'discover pool', or 'pool for [tokens]'. DO NOT use for positions or minting."
---

# ⚠️ STRICT TRIGGER RULES

**ONLY activate this skill when user says:**
- "pool info"
- "find pool"
- "discover pool"
- "pool for [token pair]"
- "check pool"
- "get pool info"

**DO NOT activate for:**
- "positions" → use railway-v4-positions
- "mint" → use railway-v4-mint
- "approve" → use railway-v4-approve

---

When discovering pool info, run:

```bash
curl -X GET "https://uniflow-telegram-bot-production.up.railway.app/api/v4/pool-info?token0=<TOKEN0_ADDRESS>&token1=<TOKEN1_ADDRESS>&chainId=<CHAIN_ID>"
```

Replace:
- `<TOKEN0_ADDRESS>` — First token 0x address (required)
- `<TOKEN1_ADDRESS>` — Second token 0x address (required)
- `<CHAIN_ID>` — 1 (Ethereum), 8453 (Base), 42161 (Arbitrum), 56 (BNB), 130 (Unichain)

**Response interpretation:**
- `pool.exists: true` → Pool found, show fee tier and pool key
- `pool.exists: false` → No pool exists for this token pair
