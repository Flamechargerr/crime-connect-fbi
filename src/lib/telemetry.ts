type Level = 'info' | 'warn' | 'error';

const redactSecrets = (value: unknown): unknown => {
  if (typeof value !== 'string') return value;

  if (
    value.includes('eyJ') ||
    value.toLowerCase().includes('token') ||
    value.toLowerCase().includes('apikey') ||
    value.toLowerCase().includes('authorization')
  ) {
    return '[REDACTED]';
  }
  return value;
};

const serialize = (metadata?: Record<string, unknown>) =>
  metadata
    ? Object.fromEntries(
        Object.entries(metadata).map(([key, value]) => [key, redactSecrets(value)])
      )
    : undefined;

export const logEvent = (
  level: Level,
  message: string,
  metadata?: Record<string, unknown>
) => {
  const payload = serialize(metadata);
  const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.info;
  fn(`[crime-connect:${level}] ${message}`, payload ?? '');
};

