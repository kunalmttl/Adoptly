// # OTP Verification Page

import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import { verifyOtp } from "@/api/authAPI";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/store/authStore";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

// * Zod schema for the OTP form
const otpFormSchema = z.object({
  otp: z.string().min(6, { message: "Your one-time password must be 6 characters." }),
});

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuthStore();

  // =-= Get the email passed from the previous (login/register) page
  const email = location.state?.email;

  // ? If the user lands here directly without an email, redirect them to login.
  useEffect(() => {
    if (!email) {
      navigate('/login', { replace: true });
    }
  }, [email, navigate]);


  const form = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: { otp: "" },
  });

  const onSubmit = async (data: z.infer<typeof otpFormSchema>) => {
    const submissionPromise = verifyOtp(email, data.otp);

    toast.promise(submissionPromise, {
      loading: 'Verifying OTP...',
      success: (response) => {
        // =-= On successful verification, set the user state and redirect
        setUser(response.user as User);
        navigate('/browse');
        return `Welcome, ${response.user.name}!`;
      },
      error: (err) => {
        // =-= Provide a specific error message from the backend if available
        if (isAxiosError(err)) {
          return err.response?.data?.message || "An unexpected error occurred.";
        }
        return "Verification failed. Please try again.";
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Check your email</CardTitle>
          <CardDescription>We've sent a 6-digit code to {email}.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup className="mx-auto">
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify Account
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}