// src/pages/ListPetPage.tsx

import { useAuthStore } from "@/store/authStore";
import { ListPetForm } from "@/components/pets/ListPetForm";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { ImageUploader } from "@/components/pets/ImageUploader";

const ListPetPage = () => {
  const { user } = useAuthStore();
  if (!user) {
    return (
      <div className="container mx-auto flex items-start justify-center py-12 pt-32">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You must be logged in to list a pet. Please{" "}
            <Link to="/login" className="font-bold underline">
              log in
            </Link>{" "}
            to continue.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Guard Clause: If the user is not a seller, show a message.
  if (user?.profile_type !== 'seller') {
    return (
      <div className="container mx-auto flex items-start justify-center py-12 pt-24">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You must have a "Seller" profile to list a pet. Please{" "}
            <Link to="/settings" className="font-bold underline">
              update your profile
            </Link>{" "}
            to continue.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If the user is a seller, show the form.
  return (
    <div className="container mx-auto flex items-start justify-center py-12 pt-24">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Pet</h1>
        <p className="text-neutral-500">Add a new pet to your listings.</p>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Left Column: Image Uploader */}
        <div className="lg:col-span-1">
          <ImageUploader />
        </div>

        {/* Right Column: Pet Details Form */}
        <div className="lg:col-span-2">
          <ListPetForm />
        </div>
      </div>
    </div>
  );
};

export default ListPetPage;