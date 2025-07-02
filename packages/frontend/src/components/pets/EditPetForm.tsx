// frontend/src/components/pets/EditPetForm.tsx

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { updatePetListing, deletePet, type Pet, type UpdatePetPayload } from "@/api/petAPI";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

const editPetFormSchema = z.object({
  description: z.string().min(10, "Description is required."),
  age: z.coerce.number().positive().optional(),
  status: z.enum(["available", "pending", "adopted"]),
  vaccinated: z.boolean().optional().default(false),
  special_needs: z.boolean().optional().default(false),
  images: z.array(z.string()).optional(),
});

type EditPetFormValues = z.infer<typeof editPetFormSchema>;

export const EditPetForm = ({ pet }: { pet: Pet }) => {
  const navigate = useNavigate();

  // FIX: Removed the explicit generic. The type is now inferred.
  const form = useForm({
    resolver: zodResolver(editPetFormSchema),
    defaultValues: {
      description: pet.description || "",
      age: pet.age,
      status: pet.status,
      vaccinated: pet.health_status?.vaccinated ?? false,
      special_needs: pet.health_status?.special_needs ?? false,
      images: pet.images || [],
    },
  });

  // FIX: Use the inferred type for the data parameter.
  const onSubmit = async (data: EditPetFormValues) => {
    const toastId = toast.loading("Saving changes...");
    try {
      const dataForApi: UpdatePetPayload = {
        ...data,
        health_status: {
          vaccinated: data.vaccinated,
          special_needs: data.special_needs,
        },
      };

      await updatePetListing(pet._id, dataForApi);
      toast.success("Listing updated successfully!", { id: toastId });
      navigate("/my-listings");
    } catch (error) {
      toast.error("Failed to update listing.", { id: toastId });
      console.log("Failed to update the pet listing:", error);
      navigate("/my-listings")
    }
  };

  const handleDelete = async () => 
    {
    const toastId = toast.loading("Deleting listing...");
    try 
    {
      await deletePet(pet._id);
      toast.success("Listing deleted successfully.", { id: toastId });
      navigate("/my-listings"); // Redirect after successful deletion
    } 
    catch (error) 
    {
      toast.error("Failed to delete listing.", { id: toastId });
      console.error("Pet deletion failed:", error);
    }
  };


  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Static (disabled) fields */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input disabled value={pet.name} />
            </div>
            <div className="space-y-1">
              <Label>Species</Label>
              <Input disabled value={pet.species} className="capitalize" />
            </div>
            <div className="space-y-1">
              <Label>Breed</Label>
              <Input disabled value={pet.breed} />
            </div>
            <div className="space-y-1">
              <Label>Gender</Label>
              <Input disabled value={pet.gender} className="capitalize" />
            </div>
          </div>

          <Separator />

          {/* Editable fields */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} className="min-h-[100px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="adopted">Adopted</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vaccinated"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Vaccinated</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <FormField
            control={form.control}
            name="special_needs"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <FormLabel>Special Needs</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between pt-4">
            {/* Delete Button with Confirmation Dialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive">
                  Delete Listing
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this pet listing from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Yes, Delete Listing
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Save and Cancel Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" size="lg">
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};