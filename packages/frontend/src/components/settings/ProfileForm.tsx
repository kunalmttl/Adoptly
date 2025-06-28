// src/components/settings/ProfileForm.tsx

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { updateMyProfile } from "@/api/userAPI";
import type {UpdateProfileData} from "@/api/userAPI";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

// Schema for the fields we can update
const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  contact: z.string().optional(),
  bio: z.string().optional(),
  address: z.object({
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    pincode: z.string().optional(),
  }).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  // We'll pass the current user data as a prop
  defaultValues: Partial<ProfileFormValues>;
}

export const ProfileForm = ({ defaultValues }: ProfileFormProps) => {
  const { setUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: ProfileFormValues) => {
    const toastId = toast.loading("Saving changes...");
    try {
      const updatedUser = await updateMyProfile(data as UpdateProfileData);
      
      // Update the global state with the new user info
      setUser(updatedUser);

      toast.success("Profile updated successfully!", { id: toastId });
    } catch (_error) {
      toast.error("Failed to update profile.", { id: toastId });
      console.error("Profile update failed:", _error); 

    }
  };

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out.");
    navigate("/");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            
            <FormField control={form.control} name="bio" render={({ field }) => (
                <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl><Textarea placeholder="Tell us a little about yourself" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            {/* We will add more fields here */}

            <Separator />
            
            <div className="flex items-center justify-between">
                <Button type="button" variant="destructive" onClick={handleLogout}>Log Out</Button>
                <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};