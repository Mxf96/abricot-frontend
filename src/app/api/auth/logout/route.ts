import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const TOKEN_COOKIE_NAME = 'abricot_session';

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.set({
    name: TOKEN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });

  return NextResponse.json({
    success: true,
    message: 'Déconnexion réussie.',
  });
}