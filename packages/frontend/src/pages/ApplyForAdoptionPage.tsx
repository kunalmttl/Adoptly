// # Apply for Adoption Page
// * This page allows adopters to apply for a pet, pre-filling user data and collecting adoption intent and pet location plan.

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { applyForAdoption } from "@/api/applicationAPI";
import { getPetById } from "@/api/petAPI";
import { useAuthStore } from "@/store/authStore";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// # Zod schema for form validation
const schema = z.object({
  adoption_intent: z.string().min(10, "Please explain your intent to adopt in at least 10 characters."),
  pet_location_plan: z.string().min(5, "Please describe where the pet will stay in at least 5 characters."),
});

type FormType = z.infer<typeof schema>;

export default function ApplyForAdoptionPage() {
  // * Extract pet ID from URL params
  const { petId } = useParams<{ petId: string }>();
  const [pet, setPet] = useState<null | { name: string }>(null);
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // * Initialize form with Zod validation
  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      adoption_intent: "",
      pet_location_plan: "",
    },
  });

  // * Fetch pet details to display name
  useEffect(() => {
    if (!petId) return;
    getPetById(petId)
      .then(setPet)
      .catch(() => setPet(null));
  }, [petId]);

  // # Handle form submission
  const onSubmit = async (data: FormType) => {
    // ! Ensure user is logged in
    if (!user) {
      toast.error("You must be logged in to apply.");
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      await applyForAdoption({
        petId: petId!,
        ...data,
      });
      // * Success: Show toast and navigate to "My Applications"
      toast.success("Application submitted successfully!");
      navigate("/my-applications");
    } catch (e) {
      // ! Show error toast
      toast.error("Failed to submit application. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // * Show loading or missing pet
  if (!pet) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 pt-32">
      <Card>
        <CardHeader>
          <CardTitle>Apply to Adopt {pet.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Pre-filled fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <Input value={user?.name || "Not logged in"} disabled className="mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <Input value={user?.email || "Not logged in"} disabled className="mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              {/* <Input
                value={
                  user?.address
                    ? `${user.address.city || ""}, ${user.address.state || ""}, ${user.address.country || ""}`
                    : "Not provided"
                }
                disabled
                className="mt-1"
              /> */}
            </div>
            {/* Form fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Why do you want to adopt this pet? {/* ? Intent */}
              </label>
              <Textarea
                {...form.register("adoption_intent")}
                className="mt-1"
                placeholder="Explain your reasons for adopting this pet"
              />
              {form.formState.errors.adoption_intent && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.adoption_intent.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Where will the pet stay? {/* ? Home situation */}
              </label>
              <Textarea
                {...form.register("pet_location_plan")}
                className="mt-1"
                placeholder="Describe where the pet will live (e.g., house, apartment)"
              />
              {form.formState.errors.pet_location_plan && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.pet_location_plan.message}</p>
              )}
            </div>
            <CardFooter className="p-0 pt-6">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Submit Application
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}