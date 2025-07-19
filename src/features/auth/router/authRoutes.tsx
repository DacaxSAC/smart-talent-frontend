import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RecoveryPasswordPage } from '@/features/auth/pages/RecoveryPasswordPage';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';

export const authRoutes = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/recovery-password',
    element: <RecoveryPasswordPage />, 
  },
  {
    path:'/reset-password',
    element: <ResetPasswordPage />
  }
];