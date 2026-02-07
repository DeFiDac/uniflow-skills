#!/usr/bin/env node
/**
 * Get a user's embedded wallet address from Privy.
 * 
 * Usage: node get-wallet.js <privy-user-id>
 * 
 * Requires .privy-config.json in workspace.
 * Returns wallet address and chain info.
 */

const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(process.env.HOME, '.openclaw/workspace/.privy-config.json');
const USERS_PATH = path.join(process.env.HOME, '.openclaw/workspace/.privy-users.json');

async function main() {
  const userId = process.argv[2];
  
  if (!userId) {
    console.error('Usage: node get-wallet.js <privy-user-id>');
    process.exit(1);
  }

  if (!fs.existsSync(CONFIG_PATH)) {
    console.error('Error: .privy-config.json not found');
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const credentials = Buffer.from(`${config.appId}:${config.appSecret}`).toString('base64');

  try {
    const response = await fetch(`https://auth.privy.io/api/v1/users/${encodeURIComponent(userId)}`, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'privy-app-id': config.appId
      }
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Error ${response.status}: ${error}`);
      process.exit(1);
    }

    const user = await response.json();
    
    // Find embedded wallet
    const wallets = user.linked_accounts.filter(a => a.type === 'wallet');
    const embeddedWallet = wallets.find(w => w.wallet_client === 'privy');
    const externalWallets = wallets.filter(w => w.wallet_client !== 'privy');

    const result = {
      user_id: user.id,
      created_at: user.created_at,
      embedded_wallet: embeddedWallet ? {
        address: embeddedWallet.address,
        chain_type: embeddedWallet.chain_type || 'ethereum'
      } : null,
      external_wallets: externalWallets.map(w => ({
        address: w.address,
        chain_type: w.chain_type || 'ethereum',
        connector: w.wallet_client
      })),
      linked_accounts: user.linked_accounts
        .filter(a => a.type !== 'wallet')
        .map(a => ({ type: a.type, identifier: a.address || a.subject || a.username }))
    };

    // Update local user mapping
    let users = {};
    if (fs.existsSync(USERS_PATH)) {
      users = JSON.parse(fs.readFileSync(USERS_PATH, 'utf8'));
    }

    if (result.embedded_wallet) {
      users[userId] = {
        wallet_address: result.embedded_wallet.address,
        updated_at: new Date().toISOString()
      };
      fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2), { mode: 0o600 });
    }

    console.log(JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();