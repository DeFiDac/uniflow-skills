#!/usr/bin/env node
/**
 * Sign and send a transaction using Privy embedded wallet.
 * 
 * Usage: node sign-transaction.js <privy-user-id> <tx-json>
 * 
 * tx-json format:
 * {
 *   "to": "0x...",
 *   "value": "0x0",        // Optional, hex wei
 *   "data": "0x...",       // Optional, call data
 *   "chainId": 1           // Required
 * }
 * 
 * SECURITY: Only run after explicit user confirmation!
 * 
 * Requires .privy-config.json in workspace.
 */

const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(process.env.HOME, '.openclaw/workspace/.privy-config.json');
const USERS_PATH = path.join(process.env.HOME, '.openclaw/workspace/.privy-users.json');

async function getWalletAddress(userId, credentials, appId) {
  // Check local cache first
  if (fs.existsSync(USERS_PATH)) {
    const users = JSON.parse(fs.readFileSync(USERS_PATH, 'utf8'));
    if (users[userId]?.wallet_address) {
      return users[userId].wallet_address;
    }
  }

  // Fetch from Privy
  const response = await fetch(`https://auth.privy.io/api/v1/users/${encodeURIComponent(userId)}`, {
    headers: {
      'Authorization': `Basic ${credentials}`,
      'privy-app-id': appId
    }
  });

  if (!response.ok) {
    throw new Error(`User lookup failed: ${await response.text()}`);
  }

  const user = await response.json();
  const wallet = user.linked_accounts.find(a => a.type === 'wallet' && a.wallet_client === 'privy');
  
  if (!wallet) {
    throw new Error('User has no embedded wallet');
  }

  return wallet.address;
}

async function main() {
  const userId = process.argv[2];
  const txJson = process.argv[3];

  if (!userId || !txJson) {
    console.error('Usage: node sign-transaction.js <privy-user-id> \'<tx-json>\'');
    console.error('');
    console.error('Example:');
    console.error('  node sign-transaction.js did:privy:xxx \'{"to":"0x...","value":"0x0","chainId":1}\'');
    process.exit(1);
  }

  if (!fs.existsSync(CONFIG_PATH)) {
    console.error('Error: .privy-config.json not found');
    process.exit(1);
  }

  let tx;
  try {
    tx = JSON.parse(txJson);
  } catch (e) {
    console.error('Error: Invalid JSON for transaction');
    process.exit(1);
  }

  if (!tx.to || !tx.chainId) {
    console.error('Error: Transaction requires "to" and "chainId"');
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const credentials = Buffer.from(`${config.appId}:${config.appSecret}`).toString('base64');

  try {
    // Get wallet address
    const walletAddress = await getWalletAddress(userId, credentials, config.appId);
    console.error(`Wallet: ${walletAddress}`);
    console.error(`Chain: ${tx.chainId}`);
    console.error(`To: ${tx.to}`);
    console.error(`Value: ${tx.value || '0x0'}`);
    console.error('');

    // Send transaction via Privy RPC
    const response = await fetch(
      `https://auth.privy.io/api/v1/users/${encodeURIComponent(userId)}/wallets/${walletAddress}/rpc`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
          'privy-app-id': config.appId
        },
        body: JSON.stringify({
          method: 'eth_sendTransaction',
          params: {
            transaction: {
              to: tx.to,
              value: tx.value || '0x0',
              data: tx.data || '0x',
              chainId: tx.chainId
            }
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error(`Transaction failed: ${error}`);
      process.exit(1);
    }

    const result = await response.json();
    
    console.log(JSON.stringify({
      success: true,
      tx_hash: result.hash || result.transactionHash,
      wallet: walletAddress,
      chain_id: tx.chainId
    }, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
