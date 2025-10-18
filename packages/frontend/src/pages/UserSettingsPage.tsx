// # User Settings Page

import { useEffect, useState } from "react";
import { getMyProfile } from "@/api/userAPI";
import { useAuthStore } from "@/store/authStore";

import { AvatarUploader } from "@/components/settings/AvatarUploader";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// ? We can reuse the UpdateProfileData type as it matches the form's shape
import type { UpdateProfileData } from "@/api/userAPI";

const UserSettingsPage = () => {
  const { user: authUser } = useAuthStore();
  // =-= We still fetch the detailed profile to get fields not in the auth store (like address, bio)
  const [profileData, setProfileData] = useState<UpdateProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setProfileData(data);
      } catch (_error) {
        console.error("Failed to fetch detailed profile", _error);
        setError("Could not load all profile details. Some fields may be empty.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []); 

  


  // * If the essential auth user isn't loaded yet, show a full-page loader.
  if (!authUser) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  // * Calculate initials for the avatar fallback from the reliable authUser state.
  const initials = authUser.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="container mx-auto max-w-4xl py-12 pt-32">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      {/* =-= Display a non-blocking error if the detailed fetch fails */}
      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Loading Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        {/* Left Column: Avatar */}
        <div className="md:col-span-1">
          <AvatarUploader src={authUser.picture} fallback={initials} />
        </div>
        
        {/* Right Column: Form */}
        <div className="md:col-span-2">
          {/* ! FIX: Render a loading state for the form, then render the form itself. */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-neutral-300" />
            </div>
          ) : (
            // ! FIX: Pass defaultValues that merge the fetched data with the reliable authUser data.
            // ! This ensures the form always has at least the user's name to display.
            <ProfileForm 
              defaultValues={{
                name: authUser.name,
                ...profileData, // Fetched data (bio, contact, address) will override defaults
              }} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;