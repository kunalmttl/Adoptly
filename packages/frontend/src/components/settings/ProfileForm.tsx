// # User Profile Settings Form

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "@/store/authStore";
import { updateMyProfile, type UpdateProfileData } from "@/api/userAPI";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// ! FIX: Update the schema to include all editable fields from the user model.
const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  bio: z.string().max(500, "Bio cannot be more than 500 characters.").optional(),
  contact: z.string().optional(),
  address: z.object({
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    pincode: z.string().optional(),
  }).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  defaultValues: Partial<ProfileFormValues>;
}

export const ProfileForm = ({ defaultValues }: ProfileFormProps) => {
  const { setUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    // =-= The defaultValues prop will populate the form with existing user data
    defaultValues,
  });

  const onSubmit = async (data: ProfileFormValues) => {
    const submissionPromise = updateMyProfile(data as UpdateProfileData);

    toast.promise(submissionPromise, {
        loading: "Saving changes...",
        success: (updatedUser) => {
            // * Update the global state with the new user info
            setUser(updatedUser);
            return "Profile updated successfully!";
        },
        error: "Failed to update profile. Please try again."
    });
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* # Personal Info Section */}
            <div className="space-y-6">
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
            </div>

            <Separator />

            {/* # NEW: Contact & Location Section */}
            <div className="space-y-6">
                <h3 className="text-lg font-medium">Contact & Location</h3>
                <FormField control={form.control} name="contact" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl><Input placeholder="+1 (555) 123-4567" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="address.city" render={({ field }) => (
                        <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl><Input placeholder="e.g., New York" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="address.state" render={({ field }) => (
                        <FormItem>
                            <FormLabel>State / Province</FormLabel>
                            <FormControl><Input placeholder="e.g., NY" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="address.country" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl><Input placeholder="e.g., USA" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="address.pincode" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Zip / Postal Code</FormLabel>
                            <FormControl><Input placeholder="e.g., 10001" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
            </div>
            
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