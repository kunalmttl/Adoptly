// src/pages/UserSettingsPage.tsx

import { useEffect, useState } from "react";
import { getMyProfile } from "@/api/userAPI";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/store/authStore";

import { AvatarUploader } from "@/components/settings/AvatarUploader";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { Loader2 } from "lucide-react";

interface ProfileData extends User 
{
    picture?: string;
    bio?: string;
    // ... any other fields from the backend
}


const UserSettingsPage = () => {
  const { user: authUser } = useAuthStore();
  // We use local state to hold the detailed profile fetched from the API
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setProfileData(data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading || !authUser) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  // Calculate initials for the avatar fallback
  const initials = authUser.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="container mx-auto max-w-4xl py-12 pt-32">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        {/* Left Column: Avatar */}
        <div className="md:col-span-1">
          <AvatarUploader src={profileData?.picture} fallback={initials} />
        </div>
        
        {/* Right Column: Form */}
        <div className="md:col-span-2">
          {profileData && <ProfileForm defaultValues={profileData} />}
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;