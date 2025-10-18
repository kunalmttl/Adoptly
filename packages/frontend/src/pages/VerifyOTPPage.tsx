// src/pages/VerifyOTPPage.tsx

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { Loader2 } from 'lucide-react';

import { verifyOtp } from '@/api/authAPI';
import { useAuthStore, type User } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';

// Zod schema for the 6-digit OTP.
const otpFormSchema = z.object({
  otp: z.string().min(6, { message: 'Your one-time password must be 6 characters.' }),
});

type OtpFormValues = z.infer<typeof otpFormSchema>;

/**
 * The page for verifying the user's email via a One-Time Password (OTP).
 */
export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuthStore();

  // Retrieve the email passed from the registration page.
  const email = location.state?.email;

  // Effect to guard the route: if no email is present, redirect to login.
  useEffect(() => {
    if (!email) {
      toast.error('Verification session expired. Please try again.');
      navigate('/login', { replace: true });
    }
  }, [email, navigate]);

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: { otp: '' },
  });

  const onSubmit = async (data: OtpFormValues) => {
    const submissionPromise = verifyOtp(email, data.otp);

    toast.promise(submissionPromise, {
      loading: 'Verifying OTP...',
      success: (response) => {
        setUser(response.user as User);
        navigate('/browse');
        return `Welcome, ${response.user.name}!`;
      },
      error: (err) => (isAxiosError(err) ? err.response?.data?.message : 'Verification failed. Please try again.'),
    });
  };

  // Render nothing until the redirect effect has a chance to run.
  if (!email) return null;

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
              <FormField control={form.control} name="otp" render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="mx-auto">
                        {[...Array(6)].map((_, i) => <InputOTPSlot key={i} index={i} />)}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                </FormItem>
              )} />
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