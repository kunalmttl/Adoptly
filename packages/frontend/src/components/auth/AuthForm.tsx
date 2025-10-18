// src/components/auth/AuthForm.tsx

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Store } from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

// --- Animation Variants for Framer Motion ---
const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// --- Zod Validation Schemas ---

// Schema for the Login form.
const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, 'Password is required'), // Simple check for login
});

// Schema for the Register form, which includes more fields.
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  profile_type: z.enum(['adopter', 'seller'], {
    required_error: 'You must select a profile type.',
  }),
});

// A union type to represent the values for either form.
export type AuthFormValues = z.infer<typeof loginSchema> | z.infer<typeof registerSchema>;

// --- Component Props ---
interface AuthFormProps {
  /** Determines if the form is for 'login' or 'register'. */
  formtype: 'login' | 'register';
  /** Callback function to handle form submission. */
  onSubmit: (values: AuthFormValues) => void;
  /** A flag to indicate if the form is currently submitting. */
  isSubmitting: boolean;
}

/**
 * A reusable and animated authentication form for both user registration and login.
 * It uses react-hook-form for state management and zod for validation.
 */
const AuthForm = ({ formtype, onSubmit, isSubmitting }: AuthFormProps) => {
  // CRITICAL FIX: Select the correct validation schema based on the form type.
  const currentSchema = formtype === 'register' ? registerSchema : loginSchema;

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      // Set a default profile_type for the registration form.
      profile_type: 'adopter',
    },
  });

  // --- Dynamic Content based on formtype ---
  const isRegister = formtype === 'register';
  const title = isRegister ? 'Create an Account' : 'Welcome Back';
  const description = isRegister ? 'Enter your details to get started.' : 'Sign in to continue.';
  const buttonText = isRegister ? 'Create Account' : 'Sign In';
  const footerText = isRegister ? 'Already have an account?' : "Don't have an account?";
  const footerLink = isRegister ? '/login' : '/register';
  const footerLinkText = isRegister ? 'Sign In' : 'Sign Up';

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
      <Card className="w-full max-w-sm border-none shadow-none">
        <CardHeader className="text-center">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* --- Name Field (Register only) --- */}
              {isRegister && (
                <motion.div variants={formVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {/* --- Email Field --- */}
              <motion.div variants={formVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* --- Password Field --- */}
              <motion.div variants={formVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* --- Profile Type Toggle (Register only) --- */}
              {isRegister && (
                <motion.div variants={formVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
                  <FormField
                    control={form.control}
                    name="profile_type"
                    render={({ field }) => (
                      <FormItem className="space-y-3 pt-2">
                        <FormLabel className="text-center block">I am joining as an...</FormLabel>
                        <FormControl>
                          <ToggleGroup
                            type="single"
                            variant="outline"
                            className="grid grid-cols-2 gap-2"
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <ToggleGroupItem value="adopter" className="h-auto flex flex-col gap-2 p-4 data-[state=on]:bg-orange-100 data-[state=on]:text-orange-900">
                              <User className="h-8 w-8" />
                              <span className="text-xs font-medium">Adopter</span>
                            </ToggleGroupItem>
                            <ToggleGroupItem value="seller" className="h-auto flex flex-col gap-2 p-4 data-[state=on]:bg-teal-100 data-[state=on]:text-teal-900">
                              <Store className="h-8 w-8" />
                              <span className="text-xs font-medium">Seller</span>
                            </ToggleGroupItem>
                          </ToggleGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {/* --- Submit Button --- */}
              <motion.div variants={formVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : buttonText}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <p>
            {footerText}{' '}
            <Link to={footerLink} className="font-semibold text-indigo-600 hover:underline">
              {footerLinkText}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AuthForm;