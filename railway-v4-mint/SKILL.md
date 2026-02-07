---
name: railway-v4-mint
description: "Mint Uniswap V4 liquidity position. ONLY use when user says 'mint', 'mint position', 'add liquidity', 'create LP position'. DO NOT use for NFT minting, token minting, or approvals."
---

# ⚠️ STRICT TRIGGER RULES

**ONLY activate this skill when user says:**
- "mint"
- "mint position"
- "add liquidity"
- "create LP position"
- "mint V4"
- "provide liquidity"

**DO NOT activate for:**
- "mint NFT" → NOT SUPPORTED
- "mint token" → NOT SUPPORTED
- "approve" → use railway-v4-approve
- "positions" → use railway-v4-positions

---

When minting a V4 position, run:

```bash
curl -X POST https://uniflow-telegram-bot-production.up.railway.app/api/v4/mint \
     -H "Content-Type: application/json" \
     -d '{
       "userId": "telegram_<USER_TELEGRAM_ID>",
       "mintParams": {
         "poolKey": {
           "currency0": "<TOKEN0_ADDRESS>",
           "currency1": "<TOKEN1_ADDRESS>",
           "fee": <FEE_TIER>,
           "tickSpacing": <TICK_SPACING>,
           "hooks": "0x0000000000000000000000000000000000000000"
         },
         "tickLower": <TICK_LOWER>,
         "tickUpper": <TICK_UPPER>,
         "amount0Desired": "<AMOUNT0>",
         "amount1Desired": "<AMOUNT1>",
         "chainId": <CHAIN_ID>
       }
     }'
```

Replace:
- `<USER_TELEGRAM_ID>` — from message context
- `<TOKEN0_ADDRESS>` / `<TOKEN1_ADDRESS>` — pool token addresses (sorted)
- `<FEE_TIER>` — e.g., 3000 (0.3%), 500 (0.05%), 10000 (1%)
- `<TICK_SPACING>` — depends on fee tier (60 for 0.3%, 10 for 0.05%)
- `<TICK_LOWER>` / `<TICK_UPPER>` — price range ticks
- `<AMOUNT0>` / `<AMOUNT1>` — token amounts in wei
- `<CHAIN_ID>` — 1, 8453, 42161, 56, or 130

⚠️ **Prerequisites:**
1. User must be logged in (active session)
2. Tokens must be approved first (use railway-v4-approve)

**Recommended flow:**
1. First: Check session → `railway-session`
2. Then: Discover pool → `railway-v4-pool-info`
3. Then: Approve tokens → `railway-v4-approve`
4. Finally: Mint position → this skill

**Response interpretation:**
- `success: true` → Position minted, show txHash and explorer link
- `error: SESSION_NOT_FOUND` → Ask user to login first
