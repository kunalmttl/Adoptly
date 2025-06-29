// # Login Page

import AuthForm, { type AuthFormValues } from "@/components/auth/AuthForm";
import { isAxiosError } from "axios"; 
import { loginUser } from "@/api/authAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore"; // * Import the auth store
import type { User } from "@/store/authStore";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore(); // * Get the setUser function from the store

  const handleLogin = async (values: AuthFormValues) => {
    try {
      // ! FIX: This now returns the full LoginResponse with user and token
      const response = await loginUser(values);
      
      // * Set the user in the global state
      setUser(response.user as User);

      toast.success(`Welcome back, ${response.user.name}!`);
      
      // * Navigate directly to the browse page
      navigate('/browse');

    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      }
      console.error("Login failed:", error);
      toast.error(errorMessage);
    }
  };

  return (
    <AuthForm formtype="login" onSubmit={handleLogin} />
  );
};

export default LoginPage;