# UniFlow Skills

Custom skills for [OpenClaw](https://docs.openclaw.ai/) chatbots to interact with blockchain wallets and DeFi protocols.

## Available Skills

| Skill | Description |
|-------|-------------|
| `privy-wallet` | Wallet management with Privy |
| `railway-login` | Connect wallet session |
| `railway-disconnect` | Disconnect wallet session |
| `railway-session` | Check session status |
| `railway-transaction` | Execute transactions |
| `railway-v4-approve` | Approve tokens for Uniswap V4 |
| `railway-v4-mint` | Mint Uniswap V4 liquidity positions |
| `railway-v4-pool-info` | Get Uniswap V4 pool information |
| `railway-v4-positions` | View Uniswap V4 positions |

---

## Deployment with OpenClaw

### Prerequisites
1. Prepare a VPS (e.g., DigitalOcean, AWS, Linode, etc.)
2. Install [OpenClaw](https://docs.openclaw.ai/start/getting-started)

### Installation
1. Clone or copy this skill folder to your OpenClaw installation:
   ```bash
   git clone https://github.com/DeFiDac/uniflow-skills.git /path-to-save-skills
   ```
2. Configure OpenClaw to use the skills directory
3. Ask your chatbot if the skills are available

---

## Backend Service

These skills require the [UniFlow Backend](https://github.com/DeFiDac/uniflow-backend) service to handle wallet operations.

### Deployment

#### 1. Clone the Repository
```bash
git clone https://github.com/DeFiDac/uniflow-backend.git
cd uniflow-backend
```

#### 2. Install Dependencies
```bash
pnpm install
```

#### 3. Configure Environment Variables

Create a `.env` file with the following variables:

```env
# Privy Configuration (Required)
PRIVY_APP_ID=
PRIVY_APP_SECRET=
PRIVY_SIGNER_ID=
PRIVY_SIGNER_PRIVATE_KEY=
PRIVY_POLICY_ID=

# The Graph API (for Uniswap V4)
THE_GRAPH_API_KEY=

# Infura RPC Configuration (Optional - falls back to public RPCs)
INFURA_API_KEY=
INFURA_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/
INFURA_BSC_RPC_URL=https://bsc-mainnet.infura.io/v3/
INFURA_BASE_RPC_URL=https://base-mainnet.infura.io/v3/
INFURA_ARBITRUM_RPC_URL=https://arbitrum-mainnet.infura.io/v3/
INFURA_UNICHAIN_RPC_URL=https://unichain-mainnet.infura.io/v3/

# Server
PORT=3000
```

> [!NOTE]
> Infura RPC URLs are constructed as `{INFURA_*_RPC_URL}{INFURA_API_KEY}`. If not configured, the service falls back to public RPC endpoints.

#### 4. Run the Service

**Development:**
```bash
pnpm dev
```

**Production:**
```bash
pnpm build
pnpm start
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/connect` | Connect wallet |
| `POST` | `/api/transact` | Execute transaction |
| `POST` | `/api/disconnect` | Disconnect wallet |
| `GET` | `/api/session/:userId` | Check session status |
| `GET` | `/api/v4/positions/:walletAddress` | Get Uniswap V4 positions |
| `GET` | `/api/v4/pool-info` | Get pool information |
| `POST` | `/api/v4/approve` | Approve tokens |
| `POST` | `/api/v4/mint` | Mint liquidity position |

---

## License

MIT
