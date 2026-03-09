import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getSession, createToken, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Both passwords are required' }, { status: 400 });
    }

    const user = await prisma.adminUser.findUnique({
      where: { id: session.userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password AND increment tokenVersion to logout all other devices
    const updatedUser = await prisma.adminUser.update({
      where: { id: session.userId },
      data: {
        password: hashedNewPassword,
        tokenVersion: { increment: 1 }
      }
    });

    // Create a new token for the current device
    const token = await createToken({
      userId: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      tokenVersion: updatedUser.tokenVersion,
    });
    await setSessionCookie(token);

    return NextResponse.json({ success: true, message: 'Password updated and sessions refreshed' });
  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
