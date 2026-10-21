import { NextResponse } from 'next/server';

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

  const response = await fetch(
    `${backendUrl.replace(/\/$/, '')}/auth/register`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: await request.text(),
      cache: 'no-store',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(data, {
      status: response.status,
    });
  }

  return NextResponse.json(
    {
      success: data.success,
      message: data.message,
      data: {
        user: data?.data?.user,
      },
    },
    {
      status: response.status,
    }
  );
}