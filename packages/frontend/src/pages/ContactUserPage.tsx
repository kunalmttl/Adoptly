// src/pages/ContactUserPage.tsx

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';

import { sendMessage } from '@/api/contactAPI';
import { useAuthStore } from '@/store/authStore';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Zod schema for the contact form.
const contactSchema = z.object({
  subject: z.string().min(3, 'Subject is required.'),
  message: z.string().min(10, 'Message must be at least 10 characters long.'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

/**
 * A page with a form for sending a message to another user on the platform.
 */
export default function ContactUserPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: sender } = useAuthStore();

  // Retrieve recipient and pet name from the route state passed by the Link component.
  const { recipient, petName } = location.state || {};

  // Guard effect: If no recipient is found, redirect the user back.
  useEffect(() => {
    if (!recipient) {
      toast.error('No recipient specified. Redirecting...');
      // FIXED: The correct syntax for navigating back one step in history is simply navigate(-1).
      navigate(-1);
    }
  }, [recipient, navigate]);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: `Inquiry about ${petName || 'your listing'}`,
      message: '',
    },
  });

  const onSubmit: SubmitHandler<ContactFormValues> = (data) => {
    const submissionPromise = sendMessage({
      recipientId: recipient._id,
      subject: data.subject,
      message: data.message,
    });

    toast.promise(submissionPromise, {
      loading: 'Sending your message...',
      success: () => {
        navigate(-1); // Go back to the previous page on success.
        return 'Message sent successfully!';
      },
      error: 'Failed to send message. Please try again.',
    });
  };

  // Render nothing until the redirect guard has run.
  if (!recipient) return null;

  return (
    <div className="bg-neutral-100 min-h-screen flex items-center justify-center py-12 px-4 pt-24">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Contact {recipient.name}</CardTitle>
          <CardDescription>Your message will be sent from {sender?.email}. Replies will go directly to your inbox.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField control={form.control} name="subject" render={({ field }) => (
                <FormItem><FormLabel>Subject</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="message" render={({ field }) => (
                <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea placeholder={`Hi ${recipient.name}, I'm interested in learning more about ${petName}...`} className="min-h-[150px] resize-y" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </CardContent>
            <CardFooter className="flex justify-end gap-2 p-6">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Send Message
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}