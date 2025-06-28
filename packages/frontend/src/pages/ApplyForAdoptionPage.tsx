// frontend/src/pages/ApplyForAdoptionPage.tsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { applyForAdoption } from "@/api/applicationAPI";
import { getPetById, type Pet } from "@/api/petAPI"; // <-- Import Pet type
import { useAuthStore } from "@/store/authStore";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const schema = z.object({
  adoption_intent: z.string().min(10, "Please explain your intent to adopt."),
  pet_location_plan: z.string().min(5, "Please describe where the pet will stay."),
});

type FormType = z.infer<typeof schema>;

export default function ApplyForAdoptionPage() {
  const { id: petId } = useParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null); // <-- Use imported Pet type instead of any
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      adoption_intent: "",
      pet_location_plan: "",
    },
  });

  useEffect(() => {
    if (!petId) return;
    getPetById(petId)
      .then(setPet)
      .catch(() => setPet(null));
  }, [petId]);

  if (!pet) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const onSubmit = async (data: FormType) => {
    setLoading(true);
    try {
      await applyForAdoption({
        petId: petId!,
        ...data,
      });
      navigate("/my-applications");
    } catch (_error) {
    console.error("Apply-for-adoption failed:", _error);
    alert("Failed to submit application. Try again.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-orange-50 min-h-screen flex items-center justify-center py-16">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Apply for Adoption</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <label className="block mb-1 font-semibold">Full Name</label>
              <Input value={user?.name || ""} disabled />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Email</label>
              <Input value={user?.email || ""} disabled />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Pet</label>
              <Input value={pet?.name || ""} disabled />
            </div>
            <div>
              <label className="block mb-1 font-semibold">
                Why do you want to adopt this pet?
              </label>
              <Textarea
                {...form.register("adoption_intent")}
                placeholder="Describe your motivation and suitability..."
                rows={4}
              />
              <span className="text-xs text-red-500">{form.formState.errors.adoption_intent?.message}</span>
            </div>
            <div>
              <label className="block mb-1 font-semibold">
                Where will the pet stay?
              </label>
              <Textarea
                {...form.register("pet_location_plan")}
                placeholder="Describe your home or where the pet will live..."
                rows={3}
              />
              <span className="text-xs text-red-500">{form.formState.errors.pet_location_plan?.message}</span>
            </div>
            <CardFooter>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Application"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}