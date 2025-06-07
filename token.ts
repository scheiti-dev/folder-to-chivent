interface Token {
  token: string | null,
  expireAt: Date | null
}

let tokenCache: Token = {
  token: null,
  expireAt: null,
};

export async function getToken(EVENT_ID: string) {
  if (tokenCache.expireAt && (new Date(tokenCache.expireAt).getTime() - new Date().getTime() > 20 * 60 * 1000)) {
    return tokenCache.token;
  }

  console.log('🔑 Requesting new guest token...');
  const res = await fetch(`https://api.chivent.com/v1/events/${EVENT_ID}/check_in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  });

  if (!res.ok) throw new Error(`❌ Failed to get token: ${res.status}`);

  tokenCache = await res.json() as Token;
  console.log('🔐 Token fetched, expires at:', tokenCache.expireAt);

  return tokenCache.token;
}