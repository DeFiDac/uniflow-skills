#!/usr/bin/env node
/**
 * Generate a Privy authentication link for wallet connection.
 * 
 * Usage: node generate-auth-link.js [redirect_url]
 * 
 * Requires .privy-config.json in workspace with appId and appSecret.
 * Outputs: { session_id, auth_url } - send auth_url to user
 */

const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(process.env.HOME, '.openclaw/workspace/.privy-config.json');
const SESSIONS_PATH = path.join(process.env.HOME, '.openclaw/workspace/.privy-sessions.json');

async function main() {
  // Load config
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error('Error: .privy-config.json not found');
    console.error('Create it with: { "appId": "...", "appSecret": "..." }');
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  
  if (!config.appId || !config.appSecret) {
    console.error('Error: appId and appSecret required in .privy-config.json');
    process.exit(1);
  }

  const credentials = Buffer.from(`${config.appId}:${config.appSecret}`).toString('base64');
  const redirectUrl = process.argv[2] || null;

  try {
    const response = await fetch('https://auth.privy.io/api/v1/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
        'privy-app-id': config.appId
      },
      body: JSON.stringify(redirectUrl ? { redirect_url: redirectUrl } : {})
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Error ${response.status}: ${error}`);
      process.exit(1);
    }

    const data = await response.json();
    
    // Store session for later polling
    let sessions = {};
    if (fs.existsSync(SESSIONS_PATH)) {
      sessions = JSON.parse(fs.readFileSync(SESSIONS_PATH, 'utf8'));
    }
    
    sessions[data.session_id] = {
      created_at: new Date().toISOString(),
      status: 'pending'
    };
    
    fs.writeFileSync(SESSIONS_PATH, JSON.stringify(sessions, null, 2), { mode: 0o600 });

    // Output result
    console.log(JSON.stringify({
      session_id: data.session_id,
      auth_url: data.auth_url || `https://auth.privy.io/login?session=${data.session_id}`,
      expires_in: '10 minutes'
    }, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();