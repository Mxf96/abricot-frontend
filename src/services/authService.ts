const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  createdAt?: string;
};

type AuthResponse = {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    token: string;
  };
};

type ProfileResponse = {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
  };
};

type ApiErrorResponse = {
  success: false;
  message: string;
  error?: string;
};

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data: AuthResponse | ApiErrorResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors de l'inscription");
  }

  return data as AuthResponse;
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data: AuthResponse | ApiErrorResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erreur lors de la connexion');
  }

  return data as AuthResponse;
}

export async function getProfile(token: string): Promise<ProfileResponse> {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data: ProfileResponse | ApiErrorResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Session invalide');
  }

  return data as ProfileResponse;
}

export async function updateProfile(
  token: string,
  name: string,
  email: string
): Promise<ProfileResponse> {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      email,
    }),
  });

  const data: ProfileResponse | ApiErrorResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erreur lors de la modification du profil');
  }

  return data as ProfileResponse;
}