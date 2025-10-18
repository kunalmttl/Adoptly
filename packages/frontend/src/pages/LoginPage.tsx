// src/pages/LoginPage.tsx

import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

import AuthForm, { type AuthFormValues } from '@/components/auth/AuthForm';
import { loginUser } from '@/api/authAPI';
import { useAuthStore } from '@/store/authStore';
import type { User } from '@/store/authStore';

/**
 * The page component for user login.
 * It renders the reusable AuthForm and handles the login logic.
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  /**
   * Handles the form submission for logging in a user.
   * @param values - The form data (email and password).
   */
  const handleLogin = async (values: AuthFormValues) => {
    try {
      const response = await loginUser(values);
      // Set the user data in the global Zustand store.
      setUser(response.user as User);

      toast.success(`Welcome back, ${response.user.name}!`);
      // Redirect to the main browsing page on successful login.
      navigate('/browse');
    } catch (error) {
      const errorMessage = isAxiosError(error) ? error.response?.data?.message : 'Login failed. Please try again.';
      console.error('Login failed:', error);
      toast.error(errorMessage);
    }
  };

  return <AuthForm formtype="login" onSubmit={handleLogin} isSubmitting={false} />;
};

export default LoginPage;