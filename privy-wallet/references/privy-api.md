# Privy Server API Reference

## Authentication

All requests require Basic Auth:
```
Authorization: Basic base64(appId:appSecret)
```

Base URL: `https://auth.privy.io/api/v1`

## Endpoints

### Get User by ID
```
GET /users/{user_id}
```

Response:
```json
{
  "id": "did:privy:xxx",
  "created_at": 1234567890,
  "linked_accounts": [
    {
      "type": "email",
      "address": "user@example.com"
    },
    {
      "type": "wallet",
      "address": "0x...",
      "chain_type": "ethereum",
      "wallet_client": "privy"
    }
  ]
}
```

### Get User by Email
```
GET /users?email={email}
```

### Get User by Wallet
```
GET /users?wallet_address={address}
```

### Create Auth Session
```
POST /sessions
Content-Type: application/json

{
  "redirect_url": "https://your-callback-url"
}
```

Response:
```json
{
  "session_id": "xxx",
  "auth_url": "https://auth.privy.io/login?session=xxx"
}
```

### Verify Session
```
GET /sessions/{session_id}
```

Response (after auth):
```json
{
  "status": "authenticated",
  "user_id": "did:privy:xxx"
}
```

## Embedded Wallet Operations

### Get Wallet
```
GET /users/{user_id}/wallets
```

### Sign Message
```
POST /users/{user_id}/wallets/{wallet_address}/rpc
Content-Type: application/json

{
  "method": "personal_sign",
  "params": {
    "message": "0x...",
    "encoding": "hex"
  }
}
```

### Sign Transaction
```
POST /users/{user_id}/wallets/{wallet_address}/rpc
Content-Type: application/json

{
  "method": "eth_signTransaction",
  "params": {
    "transaction": {
      "to": "0x...",
      "value": "0x...",
      "data": "0x...",
      "chainId": 1
    }
  }
}
```

### Send Transaction
```
POST /users/{user_id}/wallets/{wallet_address}/rpc
Content-Type: application/json

{
  "method": "eth_sendTransaction",
  "params": {
    "transaction": {
      "to": "0x...",
      "value": "0x...",
      "data": "0x...",
      "chainId": 1
    }
  }
}
```

## Supported Chains

| Chain | chainId |
|-------|---------|
| Ethereum | 1 |
| Base | 8453 |
| Arbitrum | 42161 |
| BNB Chain | 56 |

## Rate Limits

- 100 requests/minute per app
- 1000 requests/hour per app

## Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad request |
| 401 | Invalid credentials |
| 404 | User/wallet not found |
| 429 | Rate limited |
| 500 | Server error |