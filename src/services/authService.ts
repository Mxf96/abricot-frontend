const API_URL = '/api/backend';

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
  };
};

type ProfileResponse = {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
  };
};

type ApiValidationError = {
  field: string;
  message: string;
};

type ApiErrorResponse = {
  success: false;
  message: string;
  error?: string;

  data?: {
    errors?: ApiValidationError[];
  };
};

type UpdatePasswordResponse = {
  success: boolean;
  message: string;
};

type LogoutResponse = {
  success: boolean;
  message: string;
};

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch('/api/auth/register', {
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
  const response = await fetch('/api/auth/login', {
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

export async function logoutSession(): Promise<LogoutResponse> {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
  });

  const data: LogoutResponse | ApiErrorResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erreur lors de la déconnexion');
  }

  return data as LogoutResponse;
}

export async function getProfile(): Promise<ProfileResponse> {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'GET',
    cache: 'no-store',
  });

  const data: ProfileResponse | ApiErrorResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Session invalide');
  }

  return data as ProfileResponse;
}

export async function updateProfile(
  name: string,
  email: string
): Promise<ProfileResponse> {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
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

export async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<UpdatePasswordResponse> {
  const response = await fetch(`${API_URL}/auth/password`, {
    method: 'PUT',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  const data: UpdatePasswordResponse | ApiErrorResponse = await response.json();

  if (!response.ok) {
    const errorData = data as ApiErrorResponse;

    const validationMessage = errorData.data?.errors?.[0]?.message;

    throw new Error(
      validationMessage ||
        errorData.message ||
        'Erreur lors de la modification du mot de passe'
    );
  }

  return data as UpdatePasswordResponse;
}