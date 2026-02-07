#!/usr/bin/env node
/**
 * Check a Privy user's status and linked accounts.
 * 
 * Usage: node check-user.js <privy-user-id>
 *        node check-user.js --session <session-id>
 *        node check-user.js --email <email>
 * 
 * Requires .privy-config.json in workspace.
 */

const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(process.env.HOME, '.openclaw/workspace/.privy-config.json');

async function getCredentials() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error('.privy-config.json not found');
  }
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  return {
    credentials: Buffer.from(`${config.appId}:${config.appSecret}`).toString('base64'),
    appId: config.appId
  };
}

async function checkSession(sessionId) {
  const { credentials, appId } = await getCredentials();
  
  const response = await fetch(`https://auth.privy.io/api/v1/sessions/${sessionId}`, {
    headers: {
      'Authorization': `Basic ${credentials}`,
      'privy-app-id': appId
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Session check failed: ${error}`);
  }

  return response.json();
}

async function getUserById(userId) {
  const { credentials, appId } = await getCredentials();
  
  const response = await fetch(`https://auth.privy.io/api/v1/users/${encodeURIComponent(userId)}`, {
    headers: {
      'Authorization': `Basic ${credentials}`,
      'privy-app-id': appId
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`User lookup failed: ${error}`);
  }

  return response.json();
}

async function getUserByEmail(email) {
  const { credentials, appId } = await getCredentials();
  
  const response = await fetch(`https://auth.privy.io/api/v1/users?email=${encodeURIComponent(email)}`, {
    headers: {
      'Authorization': `Basic ${credentials}`,
      'privy-app-id': appId
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`User lookup failed: ${error}`);
  }

  return response.json();
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node check-user.js <privy-user-id>');
    console.error('       node check-user.js --session <session-id>');
    console.error('       node check-user.js --email <email>');
    process.exit(1);
  }

  try {
    let result;
    
    if (args[0] === '--session') {
      result = await checkSession(args[1]);
    } else if (args[0] === '--email') {
      result = await getUserByEmail(args[1]);
    } else {
      result = await getUserById(args[0]);
    }

    console.log(JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
