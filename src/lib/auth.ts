// lib/session.ts
'use server'

import { SignJWT, jwtVerify, JWTPayload } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET as string) // strong secret from .env

/**
 * Encrypts a payload into a signed JWT
 * @param payload - JSON object payload to include in the token
 * @returns JWT as a string
 */
export async function encrypt(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' }) // algorithm used
    .setIssuedAt()
    .setExpirationTime('2d') // 2 days expiry
    .sign(secret)
}

/**
 * Decrypts and verifies a JWT
 * @param session - JWT token string
 * @returns Decoded payload or null if invalid
 */
export async function decrypt(session: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(session, secret, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.error('Failed to verify session:', error)
    return null
  }
}
