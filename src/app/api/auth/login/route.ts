import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const TOKEN_COOKIE_NAME = 'abricot_session';

function getBackendUrl() {
  return process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
}

export async function POST(request: Request) {
  const backendUrl = getBackendUrl();

  if (!backendUrl) {
    return NextResponse.json(
      {
        success: false,
        message: "L'URL du backend n'est pas configurée.",
      },
      { status: 500 }
    );
  }

  const response = await fetch(`${backendUrl.replace(/\/$/, '')}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: await request.text(),
    cache: 'no-store',
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(data, {
      status: response.status,
    });
  }

  const token = data?.data?.token;
  const user = data?.data?.user;

  if (!token || !user) {
    return NextResponse.json(
      {
        success: false,
        message: 'Réponse d’authentification invalide.',
      },
      { status: 502 }
    );
  }

  const cookieStore = await cookies();

  cookieStore.set({
    name: TOKEN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json(
    {
      success: data.success,
      message: data.message,
      data: {
        user,
      },
    },
    {
      status: response.status,
    }
  );
}