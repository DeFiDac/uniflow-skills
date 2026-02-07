# Privy Authentication Flow

## Overview

Privy uses a session-based authentication flow:

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  Agent  │────▶│  Privy  │────▶│  User   │────▶│  Privy  │
│         │     │  API    │     │ Browser │     │  Auth   │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
     │               │               │               │
     │ Create Session│               │               │
     │──────────────▶│               │               │
     │               │               │               │
     │ Auth URL      │               │               │
     │◀──────────────│               │               │
     │               │               │               │
     │ Send link to user             │               │
     │──────────────────────────────▶│               │
     │               │               │               │
     │               │               │ Click link    │
     │               │               │──────────────▶│
     │               │               │               │
     │               │               │ Login (email/ │
     │               │               │ social/etc)   │
     │               │               │◀─────────────▶│
     │               │               │               │
     │               │               │ Redirect/Done │
     │               │               │◀──────────────│
     │               │               │               │
     │ Poll session status           │               │
     │──────────────▶│               │               │
     │               │               │               │
     │ User ID       │               │               │
     │◀──────────────│               │               │
     │               │               │               │
     │ Get user wallets              │               │
     │──────────────▶│               │               │
     │               │               │               │
     │ Wallet address│               │               │
     │◀──────────────│               │               │
```

## Step-by-Step

### 1. Create Auth Session

```javascript
const response = await fetch('https://auth.privy.io/api/v1/sessions', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${Buffer.from(`${appId}:${appSecret}`).toString('base64')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    redirect_url: 'https://your-app.com/callback' // Optional
  })
});

const { session_id, auth_url } = await response.json();
```

### 2. Send Auth URL to User

Send `auth_url` via Telegram/chat. User clicks and authenticates.

### 3. Poll for Completion

```javascript
async function pollSession(sessionId, maxAttempts = 60) {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(`https://auth.privy.io/api/v1/sessions/${sessionId}`, {
      headers: { 'Authorization': `Basic ${credentials}` }
    });
    
    const data = await response.json();
    
    if (data.status === 'authenticated') {
      return data.user_id;
    }
    
    await new Promise(r => setTimeout(r, 2000)); // Wait 2s
  }
  throw new Error('Auth timeout');
}
```

### 4. Get User's Wallet

```javascript
const response = await fetch(`https://auth.privy.io/api/v1/users/${userId}`, {
  headers: { 'Authorization': `Basic ${credentials}` }
});

const user = await response.json();
const wallet = user.linked_accounts.find(a => a.type === 'wallet');
console.log(wallet.address); // 0x...
```

## Embedded Wallet Auto-Creation

When a user authenticates, Privy automatically creates an embedded wallet if:
- User doesn't have an existing wallet linked
- App has embedded wallets enabled in dashboard

The wallet is:
- Non-custodial (Privy uses MPC, user controls key shares)
- Recoverable via linked accounts
- Usable for signing via Privy API

## Session States

| Status | Meaning |
|--------|---------|
| `pending` | Waiting for user |
| `authenticated` | User completed auth |
| `expired` | Session timed out |
| `failed` | Auth failed |

## Security Considerations

1. Sessions expire after 10 minutes
2. Each session can only be used once
3. Store user mappings securely (never in chat)
4. Validate session status before trusting user_id