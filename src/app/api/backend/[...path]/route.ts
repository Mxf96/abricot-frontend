import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const TOKEN_COOKIE_NAME = 'abricot_session';

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

function getBackendUrl() {
  return process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
}

async function proxyRequest(request: Request, context: RouteContext) {
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

  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: 'Session utilisateur introuvable.',
      },
      { status: 401 }
    );
  }

  const requestUrl = new URL(request.url);

  if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    const origin = request.headers.get('origin');

    if (origin && origin !== requestUrl.origin) {
      return NextResponse.json(
        {
          success: false,
          message: 'Origine de la requête non autorisée.',
        },
        { status: 403 }
      );
    }
  }

  const { path } = await context.params;

  const targetUrl =
    `${backendUrl.replace(/\/$/, '')}/${path.join('/')}` + requestUrl.search;

  const headers = new Headers({
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  });

  const contentType = request.headers.get('content-type');

  if (contentType) {
    headers.set('Content-Type', contentType);
  }

  const hasBody = !['GET', 'HEAD'].includes(request.method);

  const backendResponse = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    cache: 'no-store',
  });

  if (backendResponse.status === 401) {
    cookieStore.set({
      name: TOKEN_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });
  }

  const responseBody = await backendResponse.arrayBuffer();

  const responseHeaders = new Headers();
  const responseContentType = backendResponse.headers.get('content-type');

  if (responseContentType) {
    responseHeaders.set('Content-Type', responseContentType);
  }

  return new Response(responseBody, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: responseHeaders,
  });
}

export function GET(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export function POST(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export function PUT(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export function PATCH(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export function DELETE(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}