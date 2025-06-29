// src/pages/ListPetPage.tsx

import { useAuthStore } from "@/store/authStore";
import { ListPetForm } from "@/components/pets/ListPetForm";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Stepper } from "@/components/pets/Stepper";
import { useState } from "react";




const ListPetPage = () => {
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);


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

  const steps = [
    { title: "Pet Information", description: "Details about your pet." },
    { title: "Health & Location", description: "Vaccination and address." },
    { title: "Final Details", description: "Fee and listing status." },
  ];

  // If the user is a seller, show the form.
  return (
    <div className="bg-neutral-100 min-h-screen w-full p-4 sm:p-8 pt-24">
      <div className="container mx-auto max-w-6xl">
        
        <div className="mb-6">
            <h1 className="text-2xl font-poppins font-bold text-neutral-800">Add New Pet</h1>
            <p className="text-neutral-500 font-montserrat">Complete the steps below to list your pet.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row">
          
          <aside className="w-full md:w-1/4 p-8 border-b md:border-b-0 md:border-r border-neutral-200">
            {/* =-= Pass the currentStep state to the Stepper */}
            <Stepper steps={steps} currentStep={currentStep} />
          </aside>

          <main className="w-full md:w-3/4 p-8">
            {/* =-= Pass the state and the setter function to the form */}
            <ListPetForm 
              currentStep={currentStep} 
              setCurrentStep={setCurrentStep} 
            />
          </main>

        </div>
      </div>
    </div>
  );
};

export default ListPetPage;
