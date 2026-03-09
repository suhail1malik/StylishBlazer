import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, createToken, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Increment tokenVersion in DB to invalidate ALL existing tokens
    const updatedUser = await prisma.adminUser.update({
      where: { id: session.userId },
      data: { tokenVersion: { increment: 1 } }
    });

    // Create a NEW token for this current device/session only
    const token = await createToken({
      userId: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      tokenVersion: updatedUser.tokenVersion,
    });
    await setSessionCookie(token);

    return NextResponse.json({ success: true, message: 'Logged out from all other devices' });
  } catch (error) {
    console.error('Logout all devices error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
