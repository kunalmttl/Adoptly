// src/pages/UserSettingsPage.tsx

import { useEffect, useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';

import { getMyProfile, type UpdateProfileData } from '@/api/userAPI';
import { useAuthStore } from '@/store/authStore';
import { AvatarUploader } from '@/components/settings/AvatarUploader';
import { ProfileForm } from '@/components/settings/ProfileForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

/**
 * The page where users can update their account settings, including their
 * avatar and personal profile information.
 */
const UserSettingsPage = () => {
  const { user: authUser } = useAuthStore();
  // State to hold the detailed profile data fetched from the API.
  const [profileData, setProfileData] = useState<UpdateProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect to fetch the user's full profile, which may contain more details
  // than the basic user object stored in the global auth state.
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setProfileData(data);
      } catch (_error) {
        console.error('Failed to fetch detailed profile', _error);
        setError('Could not load all profile details. Some fields may be empty.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // If the basic user info from the auth store isn't available yet, show a full-page loader.
  if (!authUser) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  // Calculate initials from the reliable authUser state for the avatar fallback.
  const initials = authUser.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="container mx-auto max-w-4xl py-12 pt-32">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      {error && (
        <Alert variant="destructive" className="mb-8"><AlertTriangle className="h-4 w-4" /><AlertTitle>Loading Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left Column: Avatar Uploader */}
        <div className="md:col-span-1">
          <AvatarUploader src={authUser.picture} fallback={initials} />
        </div>
        {/* Right Column: Profile Form */}
        <div className="md:col-span-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-neutral-300" /></div>
          ) : (
            // Populate the form with a merge of the basic authUser data and the more detailed fetched profile data.
            <ProfileForm defaultValues={{ name: authUser.name, ...profileData }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;