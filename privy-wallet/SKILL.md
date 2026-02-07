---
name: privy-wallet
description: Connect and manage Ethereum wallets through Privy embedded wallets>
---


# Privy Wallet

Connect users to Web3 via Privy embedded wallets — no browser extensions requir>

## Prerequisites

Store Privy credentials securely in workspace (never expose in chat):

```
.privy-config.json (mode 600):
{
  "appId": "your-privy-app-id",
  "appSecret": "your-privy-app-secret",
  "verificationKey": "your-verification-key"
}
```

Get credentials from [Privy Dashboard](https://dashboard.privy.io).

## Capabilities

### 1. Wallet Connection (`/connect`)

Generate a Privy auth link for the user:

```bash
node scripts/generate-auth-link.js
```

User flow:
1. Agent sends auth link to user
2. User clicks → authenticates via email/Google/Twitter/etc.
3. Privy creates embedded wallet automatically
4. Agent receives wallet address via webhook or polling

### 2. Check Wallet Status

Query if a user has connected:

```bash
node scripts/check-user.js <privy-user-id>
```

### 3. Get Wallet Address

Retrieve the user's embedded wallet address:

```bash
node scripts/get-wallet.js <privy-user-id>
```

### 4. Sign Transactions (Requires User Approval)

For transaction signing, always:
1. Show transaction details to user
2. Get explicit confirmation
3. Execute via Privy server wallet API

```bash
node scripts/sign-transaction.js <user-id> <tx-data-json>
```

## Workflow Decision Tree

```
User says "connect wallet" or "/connect"
  → Check if Privy configured (.privy-config.json exists)
    → No: Ask user for Privy credentials (appId, appSecret)
    → Yes: Generate auth link → Send to user

User authenticated (webhook or confirmed)
  → Store user mapping: telegram_id → privy_user_id → wallet_address
  → Confirm connection, show wallet address

User requests transaction
  → Show tx details, get confirmation
  → Sign via Privy API
  → Return tx hash
```

## Security Rules

1. **NEVER** expose Privy secrets in chat
2. **NEVER** sign transactions without explicit user approval
3. **ALWAYS** show transaction details before signing
4. Store user mappings in `.privy-users.json` (mode 600)

## Data Storage

```
.privy-config.json   - API credentials (600)
.privy-users.json    - User ID → wallet mappings (600)
```

## References

- [Privy Server API](references/privy-api.md) - Full API documentation
- [Auth Flow](references/auth-flow.md) - Detailed authentication sequence