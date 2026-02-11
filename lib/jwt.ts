// Small helper to extract a tenant id from a JWT token's payload.
// Returns the first matching claim among common names or null.
export function getTenantIdFromToken(token: string | null): string | null {
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = parts[1]
    // base64url -> base64
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    // pad
    const pad = b64.length % 4
    const padded = pad ? b64 + '='.repeat(4 - pad) : b64
    let json = ''
    if (typeof atob === 'function') {
      json = decodeURIComponent(Array.prototype.map.call(atob(padded), function(c: string) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
    } else if (typeof Buffer !== 'undefined') {
      json = Buffer.from(padded, 'base64').toString('utf8')
    } else {
      return null
    }

    const obj = JSON.parse(json)
    // common claim names that might hold tenant id
    const candidates = ['tenantId', 'tid', 'tenant', 'org', 'orgId', 'companyId']
    for (const k of candidates) {
      if (obj && typeof obj[k] === 'string' && obj[k].trim()) return obj[k].trim()
      if (obj && typeof obj[k] === 'number') return String(obj[k])
    }

    // fallback: try 'sub' or 'aud'
    if (obj && typeof obj.sub === 'string' && obj.sub.trim()) return obj.sub.trim()
    if (obj && typeof obj.aud === 'string' && obj.aud.trim()) return obj.aud.trim()

    return null
  } catch (err) {
    console.warn('Failed to parse token for tenant id', err)
    return null
  }
}
