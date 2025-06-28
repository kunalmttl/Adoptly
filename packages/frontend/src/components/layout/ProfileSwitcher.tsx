// src/components/layout/ProfileSwitcher.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuthStore } from "@/store/authStore";
import { switchUserProfile } from "@/api/authAPI";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { User, Store } from "lucide-react";



export function ProfileSwitcher() 
{
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null; // Should not render if no user is logged in

  const handleProfileChange = async (newProfileType: 'adopter' | 'seller') => 
  {
    // If the selected profile is already the current one, just close the dialog and navigate.
    if (newProfileType === user.profile_type) 
    {
        setIsOpen(false);
        navigate(newProfileType === 'adopter' ? '/browse' : '/my-listings');
        return;
    }

    try 
    {
        // Call the backend API to switch the profile
        const { user: updatedUser } = await switchUserProfile();
        
        // Update the global state with the new user profile
        setUser(updatedUser);

        toast.success(`Profile switched to ${updatedUser.profile_type}!`);
        setIsOpen(false); // Close the dialog
        
        // Navigate to the appropriate page
        navigate(updatedUser.profile_type === 'adopter' ? '/browse' : '/my-listings');

    } 
    catch (error) 
    {
        console.error("Failed to switch profile", error);
        toast.error("Could not switch profile. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Change Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Switch Your Profile</DialogTitle>
          <DialogDescription>
            Choose how you want to interact with Adoptly.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ToggleGroup
            type="single"
            variant="outline"
            className="grid grid-cols-2 gap-4"
            defaultValue={user.profile_type} // Set default from user's current profile
            // onValueChange will trigger our API call logic
            onValueChange={(value: 'adopter' | 'seller') => {
                if (value) handleProfileChange(value);
            }}
          >
            <ToggleGroupItem value="adopter" className="h-auto flex flex-col gap-2 p-4 data-[state=on]:bg-beige data-[state=on]:text-black">
              <User className="h-8 w-8" />
              <span className="text-sm font-medium">Adopter</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="seller" className="h-auto flex flex-col gap-2 p-4 data-[state=on]:bg-limegreen data-[state=on]:text-black">
              <Store className="h-8 w-8" />
              <span className="text-sm font-medium">Seller</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
}