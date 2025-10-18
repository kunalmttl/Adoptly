// src/pages/ApplyForAdoptionPage.tsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { applyForAdoption } from '@/api/applicationAPI';
import { getPetById, type Pet } from '@/api/petAPI';
import { useAuthStore } from '@/store/authStore';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Zod schema for validating the application form.
const applicationSchema = z.object({
  adoption_intent: z.string().min(10, 'Please explain your intent to adopt in at least 10 characters.'),
  pet_location_plan: z.string().min(5, 'Please describe where the pet will stay.'),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

/**
 * The page where a user can fill out and submit an adoption application for a specific pet.
 */
export default function ApplyForAdoptionPage() {
  const { id: petId } = useParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      adoption_intent: '',
      pet_location_plan: '',
    },
  });

  // Effect to fetch the details of the pet being applied for.
  useEffect(() => {
    if (!petId) return;
    getPetById(petId).then(setPet).catch(() => setPet(null));
  }, [petId]);

  const onSubmit = async (data: ApplicationFormValues) => {
    if (!petId) return;
    toast.promise(applyForAdoption({ petId, ...data }), {
      loading: 'Submitting your application...',
      success: () => {
        navigate('/my-applications');
        return 'Application submitted! The seller will be notified.';
      },
      error: 'Failed to submit application. Please try again.',
    });
  };

  if (!pet) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="bg-orange-50 min-h-screen flex items-center justify-center py-16 px-4">
      <Card className="w-full max-w-xl">
        <CardHeader><CardTitle>Apply for Adoption of {pet.name}</CardTitle></CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div><FormLabel>Full Name</FormLabel><Input value={user?.name || ''} disabled /></div>
              <div><FormLabel>Email</FormLabel><Input value={user?.email || ''} disabled /></div>
              <FormField control={form.control} name="adoption_intent" render={({ field }) => (
                <FormItem><FormLabel>Why do you want to adopt this pet?</FormLabel><FormControl><Textarea placeholder="Describe your motivation and suitability..." rows={4} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="pet_location_plan" render={({ field }) => (
                <FormItem><FormLabel>Where will the pet stay?</FormLabel><FormControl><Textarea placeholder="Describe your home or where the pet will live..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Application'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}