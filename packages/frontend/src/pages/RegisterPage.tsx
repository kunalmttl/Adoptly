// # Register Page

import AuthForm, { type AuthFormValues } from "@/components/auth/AuthForm";
import { registerUser } from "@/api/authAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { isAxiosError } from "axios"; 

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegister = async (values: AuthFormValues) => {
    try {
      // * This now returns { message, email }
      const response = await registerUser(values);
      
      toast.success(response.message);
      
      // ! Redirect to the OTP page, passing the email in the navigation state
      navigate('/verify-otp', { state: { email: response.email } });
      
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      }
      console.error("Registration failed:", error);
      toast.error(errorMessage);
    }
  };

  return (
    <AuthForm formtype="register" onSubmit={handleRegister} />
  );
};

export default RegisterPage;