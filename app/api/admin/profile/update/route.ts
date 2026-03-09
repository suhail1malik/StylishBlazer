import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, createToken, setSessionCookie } from '@/lib/auth';

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Check if email is already taken by another user (though there's usually only one admin)
    const existingUser = await prisma.adminUser.findFirst({
      where: {
        email,
        NOT: { id: session.userId }
      }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const updatedUser = await prisma.adminUser.update({
      where: { id: session.userId },
      data: { name, email }
    });

    // Update the session cookie with new info
    const token = await createToken({
      userId: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      tokenVersion: updatedUser.tokenVersion,
    });
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        name: updatedUser.name,
        email: updatedUser.email
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
