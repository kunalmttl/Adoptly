import AuthForm from "@/components/auth/AuthForm";

const LoginPage = () => {
        const handleLogin = (values: unknown) => 
        {
                console.log("Login form submitted:", values);
        };

  return (
  <div className="flex min-h-screen items-center justify-center bg-neutral-50 pt-24">
          <AuthForm formtype="login" onSubmit={handleLogin} />;
  </div>
)};

export default LoginPage;
