// src/pages/RegisterPage.tsx

import AuthForm, { type AuthFormValues } from "@/components/auth/AuthForm";
import { registerUser } from "@/api/authAPI";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { isAxiosError } from "axios"; 

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegister = async (values: AuthFormValues) => {
    try {
      // Await the API call
      await registerUser(values);
      
      // Show a success notification
      toast.success("Account created successfully! Please log in.");
      
      // Redirect the user to the login page
      navigate('/login');
      
    } catch (error) {
      // If the API call fails, show an error notification
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      // 1. Check if the error is an Axios error
      if (isAxiosError(error)) 
      {
        // 2. If it is, we can now safely access error.response
        errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      }
      
      console.error("Login failed:", error);
      toast.error(errorMessage);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 pt-24">
      <AuthForm formtype="register" onSubmit={handleRegister} />
    </div>
  );
};

export default RegisterPage;