// src/pages/RegisterPage.tsx

import AuthForm from "@/components/auth/AuthForm";

const RegisterPage = () => {
  const handleRegister = (values: unknown) => {
    console.log("Register form submitted:", values);
  };

  return (
  <div className="flex min-h-screen items-center justify-center bg-neutral-50 pt-24">
          <AuthForm formtype="register" onSubmit={handleRegister} />;
  </div>
)};

export default RegisterPage;