// src/components/layout/ProfileSwitcher.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User, Store } from 'lucide-react';

import { useAuthStore } from '@/store/authStore';
import { switchUserProfile } from '@/api/authAPI';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

/**
 * A dialog component that allows authenticated users to switch between
 * their 'adopter' and 'seller' profiles.
 */
export function ProfileSwitcher() {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Do not render the component if there is no logged-in user.
  if (!user) return null;

  /**
   * Handles the logic for changing the user's profile type.
   * @param newProfileType - The profile type to switch to.
   */
  const handleProfileChange = async (newProfileType: 'adopter' | 'seller') => {
    // If the selected profile is the same as the current one, do nothing.
    if (newProfileType === user.profile_type) {
      setIsOpen(false);
      return;
    }

    try {
      // Call the backend API to perform the switch.
      const { user: updatedUser } = await switchUserProfile();
      // Update the global user state in Zustand.
      setUser(updatedUser);

      toast.success(`Profile switched to ${updatedUser.profile_type}!`);
      setIsOpen(false); // Close the dialog.

      // Navigate to the most relevant page for the new profile type.
      navigate(updatedUser.profile_type === 'adopter' ? '/browse' : '/my-listings');
    } catch (error) {
      console.error('Failed to switch profile', error);
      toast.error('Could not switch profile. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full" variant="outline">
          Change Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Switch Your Profile</DialogTitle>
          <DialogDescription>Choose how you want to interact with Adoptly.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ToggleGroup
            type="single"
            variant="outline"
            className="grid grid-cols-2 gap-4"
            defaultValue={user.profile_type}
            onValueChange={(value: 'adopter' | 'seller') => {
              if (value) handleProfileChange(value);
            }}
          >
            <ToggleGroupItem value="adopter" className="h-auto flex flex-col gap-2 p-4 data-[state=on]:bg-orange-100 data-[state=on]:text-orange-900">
              <User className="h-8 w-8" />
              <span className="text-sm font-medium">Adopter</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="seller" className="h-auto flex flex-col gap-2 p-4 data-[state=on]:bg-teal-100 data-[state=on]:text-teal-900">
              <Store className="h-8 w-8" />
              <span className="text-sm font-medium">Seller</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
}