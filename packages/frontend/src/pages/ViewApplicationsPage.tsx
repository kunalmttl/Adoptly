// # View Applications Page

import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";

import { getPetById, type Pet } from "@/api/petAPI";
import { getApplicationsForPet, updateApplicationStatus, type ApplicationWithDetails } from "@/api/applicationAPI";
import { useAuthStore } from "@/store/authStore";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle, Loader2 } from "lucide-react";

import { ApplicationStatusFilter, type ApplicationStatus } from "@/components/applications/ApplicationStatusFilter";
import { SellerApplicationCard } from "@/components/applications/SellerApplicationCard";
import { Badge } from "@/components/ui/badge";



export default function ViewApplicationsPage() {
  const { id: petId } = useParams<{ id: string }>();
  const { user } = useAuthStore();

  const [pet, setPet] = useState<Pet | null>(null);
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus>('all');


  useEffect(() => {
    if (!petId) {
      setError("Pet ID is missing from the URL.");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // * Fetch pet details and applications in parallel for faster loading
        const [petData, applicationsData] = await Promise.all([
          getPetById(petId),
          getApplicationsForPet(petId)
        ]);

        // ! Security check: Ensure the logged-in user owns this pet listing
        if (petData.listed_by._id !== user?.id) {
          setError("You are not authorized to view these applications.");
          return;
        }

        setPet(petData);
        setApplications(applicationsData);
      } catch (_error) {
        setError("Could not load data. Please refresh the page.");
        console.error("Failed to fetch page data:", _error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [petId, user?.id]);

  const filteredApplications = useMemo(() => {
    if (statusFilter === 'all') {
      return applications;
    }
    return applications.filter(app => app.status === statusFilter);
  }, [applications, statusFilter]);

  const handleStatusUpdate = async (applicationId: string, newStatus: 'approved' | 'rejected') => {
    toast.promise(updateApplicationStatus(applicationId, newStatus), {
      loading: 'Updating status...',
      success: () => {
        // # Logic to update the UI instantly
        setApplications(prevApps => {
          // If we approved one, reject all others that were pending
          if (newStatus === 'approved') {
            return prevApps.map(app => {
              if (app._id === applicationId) return { ...app, status: 'approved' };
              if (app.status === 'pending') return { ...app, status: 'rejected' };
              return app;
            });
          }
          // Otherwise, just update the one we rejected
          return prevApps.map(app => 
            app._id === applicationId ? { ...app, status: newStatus } : app
          );
        });
        
        // =-= If we approved an application, update the pet's status in the header
        if (newStatus === 'approved' && pet) {
            setPet({ ...pet, status: 'adopted' });
        }

        return `Application has been ${newStatus}.`;
      },
      error: 'Failed to update status. Please try again.',
    });
  };


  // # 1. Loading State
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // # 2. Error State
  if (error) {
    return (
      <div className="container flex h-[calc(100vh-6rem)] items-center justify-center pt-24">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}{" "}
            <Link to="/my-listings" className="font-bold underline">
              Return to your listings.
            </Link>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // # 3. Main Content
  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="container mx-auto max-w-5xl py-12 pt-32">
        
        {pet && (
          <div className="flex items-center gap-6 p-4 mb-8 rounded-lg bg-white shadow-sm">
            <Avatar className="h-24 w-24 rounded-lg">
              <AvatarImage src={pet.images[0]} alt={pet.name} className="object-cover" />
              <AvatarFallback>{pet.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-neutral-500">Applications for</p>
              <h1 className="text-3xl font-bold">{pet.name}</h1>
              <p className="text-neutral-600">{pet.age} y/o {pet.breed}</p>
            </div>
            {/* * NEW: Show the pet's overall status */}
            <div className="ml-auto">
                <Badge className={`capitalize text-base ${pet.status === 'adopted' ? 'bg-primary' : 'bg-neutral-400'}`}>
                    {pet.status}
                </Badge>
            </div>
          </div>
        )}

        <ApplicationStatusFilter onFilterChange={setStatusFilter} />
        
        <div className="space-y-6">
          {filteredApplications.length > 0 ? (
            filteredApplications.map(app => (
              <SellerApplicationCard 
                key={app._id} 
                application={app} 
                // =-= Pass the new handler to the card component
                onApprove={() => handleStatusUpdate(app._id, 'approved')}
                onReject={() => handleStatusUpdate(app._id, 'rejected')}
              />
            ))
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <h3 className="text-xl font-semibold">No applications match your filter.</h3>
              <p className="text-neutral-500 mt-2">Try selecting a different status or check back later.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
