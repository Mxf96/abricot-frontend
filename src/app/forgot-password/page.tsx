import type { Metadata } from 'next';

import AuthPage from '@/components/auth/AuthPage';

export const metadata: Metadata = {
  title: 'Mot de passe oublié | Abricot',
};

export default function ForgotPasswordPage() {
  return <AuthPage mode="forgot-password" />;
}