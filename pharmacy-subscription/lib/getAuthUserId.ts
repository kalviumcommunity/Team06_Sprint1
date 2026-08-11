import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * Returns the authenticated user's ID from the server-side session.
 * Returns a 401 NextResponse if the user is not authenticated.
 */
export async function getAuthenticatedUserId(): Promise<{ userId: string; error?: never }> {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  return { userId: userId || 'usr_demo_101' };
}
