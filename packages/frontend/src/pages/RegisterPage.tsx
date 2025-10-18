// src/pages/RegisterPage.tsx

import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

import AuthForm, { type AuthFormValues } from '@/components/auth/AuthForm';
import { registerUser } from '@/api/authAPI';

/**
 * The page component for user registration.
 * It renders the reusable AuthForm and handles the initial registration step.
 */
const RegisterPage = () => {
  const navigate = useNavigate();

  /**
   * Handles the form submission for registering a new user.
   * On success, it redirects to the OTP verification page.
   * @param values - The form data (name, email, password, profile_type).
   */
  const handleRegister = async (values: AuthFormValues) => {
    try {
      const response = await registerUser(values);
      toast.success(response.message);

      // Redirect to the OTP verification page, passing the user's email
      // in the route state so the next page knows who is verifying.
      navigate('/verify-otp', { state: { email: response.email } });
    } catch (error) {
      const errorMessage = isAxiosError(error) ? error.response?.data?.message : 'Registration failed. Please try again.';
      console.error('Registration failed:', error);
      toast.error(errorMessage);
    }
  };

  return <AuthForm formtype="register" onSubmit={handleRegister} isSubmitting={false} />;
};

export default RegisterPage;