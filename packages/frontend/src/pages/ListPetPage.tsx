// src/pages/ListPetPage.tsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

import { useAuthStore } from '@/store/authStore';
import { ListPetForm } from '@/components/pets/ListPetForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Stepper } from '@/components/pets/Stepper';

// Define the steps for the multi-step form.
const steps = [
  { title: 'Pet Information', description: 'Name, photos, and description.' },
  { title: 'Health & Details', description: 'Species, breed, and health status.' },
  { title: 'Location & Final Details', description: 'Location, fee, and listing status.' },
];

/**
 * The page for creating a new pet listing.
 * It features a multi-step form guided by a stepper component.
 */
const ListPetPage = () => {
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);

  // --- Guard Clauses for Access Control ---
  if (!user) {
    return (
      <div className="container mx-auto flex items-start justify-center py-12 pt-32">
        <Alert variant="destructive" className="max-w-md"><AlertTriangle className="h-4 w-4" /><AlertTitle>Authentication Required</AlertTitle><AlertDescription>You must be logged in to list a pet. Please <Link to="/login" className="font-bold underline">log in</Link> to continue.</AlertDescription></Alert>
      </div>
    );
  }

  if (user.profile_type !== 'seller') {
    return (
      <div className="container mx-auto flex items-start justify-center py-12 pt-24">
        <Alert variant="destructive" className="max-w-md"><AlertTriangle className="h-4 w-4" /><AlertTitle>Access Denied</AlertTitle><AlertDescription>You must have a "Seller" profile to list a pet. Please <Link to="/settings" className="font-bold underline">update your profile</Link> to continue.</AlertDescription></Alert>
      </div>
    );
  }

  // --- Main Component Render ---
  return (
    <div className="bg-orange-50 min-h-screen w-full p-4 sm:p-8 pt-24">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Add New Pet</h1>
          <p className="text-neutral-500">Complete the steps below to list your pet.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row">
          {/* Left Column: Stepper */}
          <aside className="w-full md:w-1/4 p-8 border-b md:border-b-0 md:border-r">
            <Stepper steps={steps} currentStep={currentStep} />
          </aside>
          {/* Right Column: Form */}
          <main className="w-full md:w-3/4 p-8">
            <ListPetForm currentStep={currentStep} setCurrentStep={setCurrentStep} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ListPetPage;