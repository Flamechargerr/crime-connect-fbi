type Level = 'info' | 'warn' | 'error';

const SENSITIVE_KEYS = new Set([
  'authorization',
  'token',
  'access_token',
  'refresh_token',
  'api_key',
  'apikey',
  'password',
  'secret',
]);

const looksLikeCredential = (value: string) =>
  /^Bearer\s+[A-Za-z0-9\-._~+/]+=*$/i.test(value) ||
  /^eyJ[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/.test(value);

const redactSecrets = (value: unknown): unknown => {
  if (typeof value !== 'string') return value;
  if (looksLikeCredential(value)) {
    return '[REDACTED]';
  }
  return value;
};

const serialize = (metadata?: Record<string, unknown>) =>
  metadata
    ? Object.fromEntries(
        Object.entries(metadata).map(([key, value]) => [
          key,
          SENSITIVE_KEYS.has(key.toLowerCase()) ? '[REDACTED]' : redactSecrets(value),
        ])
      )
    : undefined;

export const logEvent = (
  level: Level,
  message: string,
  metadata?: Record<string, unknown>
) => {
  const payload = serialize(metadata);
  const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.info;
  if (payload) {
    fn(`[crime-connect:${level}] ${message}`, payload);
  } else {
    fn(`[crime-connect:${level}] ${message}`);
  }
};
