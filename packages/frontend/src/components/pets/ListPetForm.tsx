// frontend/src/components/pets/ListPetForm.tsx

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import type { SubmitHandler } from "react-hook-form";

import { createPetListing, type CreatePetPayload } from "@/api/petAPI";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { FormLabelWithIndicator } from "@/components/ui/form-label-with-indicator";

const petFormSchema = z.object({
  name: z.string().min(2, "Name is required and must be at least 2 characters."),
  species: z.enum(["dog", "cat", "rabbit", "bird", "other"], { required_error: "Please select a species." }),
  description: z.string().min(10, "Description is required and must be at least 10 characters."),
  adoption_fee: z.coerce.number().min(0, "Adoption fee is required."),
  city: z.string().min(2, "City is required."),
  country: z.string().min(2, "Country is required."),
  images: z.array(z.string()).optional(),
  breed: z.string().optional(),
  age: z.coerce.number().positive().optional(),
  gender: z.enum(["male", "female"]).optional(),
  height: z.coerce.number().positive().optional(),
  weight: z.coerce.number().positive().optional(),
  vaccinated: z.boolean().optional().default(false),
  special_needs: z.boolean().optional().default(false),
  state: z.string().optional(),
  status: z.enum(["available", "pending", "adopted"]),
});

// This type is still useful for reference if needed elsewhere
type PetFormValues = z.infer<typeof petFormSchema>;

export const ListPetForm = () => {
  const navigate = useNavigate();

  // FIX: Removed the explicit <PetFormValues> generic.
  // The form's type is now correctly inferred from the resolver.
  const form = useForm({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: "",
      species: undefined,
      description: "",
      adoption_fee: 0,
      city: "",
      country: "",
      images: [],
      breed: "",
      age: undefined,
      gender: undefined,
      height: undefined,
      weight: undefined,
      vaccinated: false,
      special_needs: false,
      state: "",
      status: "available",
    },
  });

  // FIX: Use the inferred type from the schema for complete type safety.
  const onSubmit: SubmitHandler<PetFormValues> = async (data) => {
    const toastId = toast.loading("Submitting your listing...");
    try {
      const petDataForApi: CreatePetPayload = {
        name: data.name,
        species: data.species,
        description: data.description,
        adoption_fee: data.adoption_fee,
        images: data.images,
        breed: data.breed,
        age: data.age,
        gender: data.gender,
        health_status: {
          vaccinated: data.vaccinated,
          special_needs: data.special_needs,
        },
        size: {
          height: data.height,
          weight: data.weight,
        },
        status: data.status,
        location: {
          city: data.city,
          country: data.country,
          state: data.state,
        },
      };

      const newPet = await createPetListing(petDataForApi);
      toast.success("Pet listed successfully!", { id: toastId });
      navigate(`/pets/${newPet._id}`);
    } catch (error) {
      let errorMessage = "Failed to list pet. Please try again.";
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage, { id: toastId });
      console.error("Pet listing failed:", error);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* The rest of the form JSX remains unchanged... */}
          <div className="space-y-6">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabelWithIndicator required>Pet Name</FormLabelWithIndicator>
                <FormControl><Input placeholder="e.g., Buddy" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabelWithIndicator required>Description</FormLabelWithIndicator>
                <FormControl>
                  <Textarea placeholder="Tell us about your pet's personality..." className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField control={form.control} name="species" render={({ field }) => (
                <FormItem>
                  <FormLabelWithIndicator required>Species</FormLabelWithIndicator>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a species" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="dog">Dog</SelectItem>
                      <SelectItem value="cat">Cat</SelectItem>
                      <SelectItem value="rabbit">Rabbit</SelectItem>
                      <SelectItem value="bird">Bird</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="breed" render={({ field }) => (
                <FormItem>
                  <FormLabelWithIndicator>Breed (Optional)</FormLabelWithIndicator>
                  <FormControl><Input placeholder="e.g., Golden Retriever" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="age" render={({ field }) => (
                <FormItem>
                  <FormLabelWithIndicator>Age (Optional)</FormLabelWithIndicator>
                  <FormControl><Input type="number" placeholder="e.g., 3" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="gender" render={({ field }) => (
                <FormItem>
                  <FormLabelWithIndicator>Gender (Optional)</FormLabelWithIndicator>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="height" render={({ field }) => (
                <FormItem>
                  <FormLabelWithIndicator>Height (cm, Optional)</FormLabelWithIndicator>
                  <FormControl><Input type="number" placeholder="e.g., 55" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="weight" render={({ field }) => (
                <FormItem>
                  <FormLabelWithIndicator>Weight (kg, Optional)</FormLabelWithIndicator>
                  <FormControl><Input type="number" placeholder="e.g., 25" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField control={form.control} name="city" render={({ field }) => (
              <FormItem>
                <FormLabelWithIndicator required>City</FormLabelWithIndicator>
                <FormControl><Input placeholder="e.g., New York" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="country" render={({ field }) => (
              <FormItem>
                <FormLabelWithIndicator required>Country</FormLabelWithIndicator>
                <FormControl><Input placeholder="e.g., USA" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="vaccinated" render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 col-span-full">
                <div className="space-y-0.5">
                  <FormLabelWithIndicator>Vaccinated (Optional)</FormLabelWithIndicator>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )} />
          </div>
          <Separator />
          <FormField control={form.control} name="adoption_fee" render={({ field }) => (
            <FormItem>
              <FormLabelWithIndicator required>Adoption Fee ($)</FormLabelWithIndicator>
              <FormControl><Input type="number" placeholder="e.g., 50" {...field} /></FormControl>
              <FormDescription>Enter 0 for free adoption.</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
          <Separator />
          <FormField control={form.control} name="status" render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Listing Active</FormLabel>
                <FormDescription>Make this listing visible to all adopters on the site.</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value === "available"}
                  onCheckedChange={(checked) => field.onChange(checked ? "available" : "pending")}
                />
              </FormControl>
            </FormItem>
          )} />
          <Separator />
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" size="lg" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" size="lg">
              Save Listing
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};