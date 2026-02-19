// lib/auth.ts (Replace complete file)
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Secret key for JWT signing (production mein .env se lena chahiye)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
);

// Token expiry time
const TOKEN_EXPIRY = '7d'; // 7 days

// Types for better TypeScript support
export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
  expiresAt: Date;
};

/**
 * Create JWT token
 * Interview Point: "SignJWT se token create hota hai with payload and expiry"
 */
export async function createToken(payload: Omit<SessionPayload, 'expiresAt'>) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const token = await new SignJWT({
    ...payload,
    expiresAt: expiresAt.toISOString(),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify JWT token
 * Interview Point: "jwtVerify token ki authenticity check karta hai"
 */
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Check if token is expired
    if (payload.expiresAt && new Date(payload.expiresAt as string) < new Date()) {
      return null;
    }

    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Set session cookie
 * Interview Point: "httpOnly cookie XSS attacks se bachata hai"
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  
  cookieStore.set('session', token, {
    httpOnly: true, // JavaScript se access nahi ho sakta (XSS protection)
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'lax', // CSRF protection
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    path: '/',
  });
}

/**
 * Get current session
 * Interview Point: "Server components mein direct cookie access kar sakte hain"
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) return null;

  return await verifyToken(token);
}

/**
 * Delete session cookie
 * Interview Point: "Logout mein cookie delete karte hain"
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
