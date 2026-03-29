const attempts = new Map<string, { count: number; blockedUntil: number }>()

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const record = attempts.get(ip) ?? { count: 0, blockedUntil: 0 }
  if (record.blockedUntil > now)
    return { allowed: false, retryAfter: Math.ceil((record.blockedUntil - now) / 1000) }
  return { allowed: true }
}

export function recordFailedAttempt(ip: string) {
  const now = Date.now()
  const record = attempts.get(ip) ?? { count: 0, blockedUntil: 0 }
  record.count += 1
  if (record.count >= 5) { record.blockedUntil = now + 30_000; record.count = 0 }
  attempts.set(ip, record)
}

export function clearAttempts(ip: string) { attempts.delete(ip) }
