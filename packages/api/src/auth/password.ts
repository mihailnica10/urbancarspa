/**
 * Secure password hashing using PBKDF2-HMAC-SHA256
 * Compatible with Cloudflare Workers / Vercel Edge Functions
 *
 * Note: While Argon2 is ideal, it's not available in Web Crypto API.
 * PBKDF2 with high iteration count is still secure when properly configured.
 */

// Password hashing configuration (OWASP recommendations)
const PASSWORD_CONFIG = {
  // Iterations: OWASP minimum is 100,000 for PBKDF2-SHA256
  iterations: 100000,
  // Salt length (16 bytes = 128 bits)
  saltLen: 16,
  // Output hash length (32 bytes = 256 bits)
  hashLen: 32,
} as const

/**
 * Generate a cryptographically secure random salt
 */
function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(PASSWORD_CONFIG.saltLen))
}

/**
 * Encode bytes to base64 URL-safe
 */
function base64Encode(bytes: Uint8Array): string {
  const binString = Array.from(bytes, byte => String.fromCharCode(byte))
  return btoa(binString.join(''))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

/**
 * Decode base64 to bytes
 */
function base64Decode(str: string): Uint8Array {
  const binString = atob(
    str.replace(/-/g, '+').replace(/_/g, '/')
  )
  return Uint8Array.from(binString, char => char.charCodeAt(0))
}

/**
 * Hash a password using PBKDF2-HMAC-SHA256
 * Format: $pbkdf2-sha256$iterations$salt$hash
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = generateSalt()
  const encoder = new TextEncoder()

  // Import password as key
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )

  // Derive hash
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as unknown as ArrayBuffer,
      iterations: PASSWORD_CONFIG.iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    PASSWORD_CONFIG.hashLen * 8
  )

  const hash = new Uint8Array(hashBuffer)
  const saltB64 = base64Encode(salt)
  const hashB64 = base64Encode(hash)

  return `$pbkdf2-sha256$${PASSWORD_CONFIG.iterations}$${saltB64}$${hashB64}`
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hashString: string
): Promise<boolean> {
  try {
    const parts = hashString.split('$')

    // Handle legacy SHA-256 hash format (for migration)
    if (parts[0] !== 'pbkdf2-sha256') {
      return verifyLegacyHash(password, hashString)
    }

    const iterations = parseInt(parts[2] ?? '100000', 10)
    const saltB64 = parts[3] ?? ''
    const storedHashB64 = parts[4] ?? ''

    const salt = base64Decode(saltB64)
    const storedHash = base64Decode(storedHashB64)
    const encoder = new TextEncoder()

    // Import password as key
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    )

    // Derive hash with same parameters
    const hashBuffer = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt as unknown as ArrayBuffer,
        iterations,
        hash: 'SHA-256',
      },
      keyMaterial,
      storedHash.length * 8
    )

    const computedHash = new Uint8Array(hashBuffer)

    // Constant-time comparison to prevent timing attacks
    if (computedHash.length !== storedHash.length) {
      return false
    }

    let result = 0
    for (let i = 0; i < computedHash.length; i++) {
      result |= computedHash[i]! ^ storedHash[i]!
    }

    return result === 0
  } catch {
    return false
  }
}

/**
 * Verify legacy SHA-256 hashes (for migration only)
 */
function verifyLegacyHash(password: string, hash: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'clin-ro-salt')
  return crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const computedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return computedHash === hash
  })
}

/**
 * Check if a hash needs rehashing (for algorithm upgrades)
 */
export function needsRehash(hashString: string): boolean {
  const parts = hashString.split('$')
  if (parts[0] !== 'pbkdf2-sha256') {
    return true // Legacy hash needs upgrade
  }
  const iterations = parseInt(parts[2] ?? '0', 10)
  return iterations < PASSWORD_CONFIG.iterations
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (password.length > 128) {
    errors.push('Password must not exceed 128 characters')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one digit')
  }

  // Check for common passwords
  const commonPasswords = [
    'password',
    '12345678',
    'qwerty123',
    'admin123',
    'password1',
    'welcome1',
  ]

  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    errors.push('Password is too common')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
