import AuthForm, { type AuthFormValues } from "@/components/auth/AuthForm";
import { isAxiosError } from "axios"; 
import { loginUser } from "@/api/authAPI";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const LoginPage = () => {

        const navigate = useNavigate();

        const handleLogin = async (values: AuthFormValues) => {
    try {
      // Await the API call
      const { user } = await loginUser(values);

      // Show a success notification
      toast.success(`Welcome back, ${user.name}!`);
      
      // We will set up global state here later. For now, just redirect.
      
      // Redirect the user to the pet browser page
      navigate('/browse');

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
  };;

  return (
  <div className="flex items-center justify-center pt-20">
          <AuthForm formtype="login" onSubmit={handleLogin} />;
  </div>
)};

export default LoginPage;
