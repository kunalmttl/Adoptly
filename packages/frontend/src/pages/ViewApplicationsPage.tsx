// src/pages/ViewApplicationsPage.tsx

import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { AlertTriangle, Loader2 } from 'lucide-react';

import { getPetById, type Pet } from '@/api/petAPI';
import { getApplicationsForPet, updateApplicationStatus, type Application } from '@/api/applicationAPI';
import { useAuthStore } from '@/store/authStore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ApplicationStatusFilter, type ApplicationStatus } from '@/components/applications/ApplicationStatusFilter';
import { SellerApplicationCard } from '@/components/applications/SellerApplicationCard';
import { Badge } from '@/components/ui/badge';

/**
 * A page for pet owners to view and manage all applications submitted for one of their pets.
 */
export default function ViewApplicationsPage() {
  const { id: petId } = useParams<{ id: string }>();
  const { user } = useAuthStore();

  const [pet, setPet] = useState<Pet | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus>('all');

  // Effect to fetch both pet and application data in parallel.
  useEffect(() => {
    if (!petId) {
      setError('Pet ID is missing from the URL.');
      setIsLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const [petData, applicationsData] = await Promise.all([getPetById(petId), getApplicationsForPet(petId)]);
        if (petData.listed_by._id !== user?.id) {
          setError('You are not authorized to view these applications.');
          return;
        }
        setPet(petData);
        setApplications(applicationsData);
      } catch (_error) {
        setError('Could not load data. Please refresh the page.');
        console.error('Failed to fetch page data:', _error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [petId, user?.id]);

  // Memoized value to filter applications based on the selected status.
  const filteredApplications = useMemo(() => {
    if (statusFilter === 'all') return applications;
    return applications.filter((app) => app.status === statusFilter);
  }, [applications, statusFilter]);

  /**
   * Handles updating an application's status and provides optimistic UI updates.
   */
  const handleStatusUpdate = async (applicationId: string, newStatus: 'approved' | 'rejected') => {
    toast.promise(updateApplicationStatus(applicationId, newStatus), {
      loading: 'Updating status...',
      success: () => {
        // Optimistically update the UI for a faster user experience.
        setApplications((prevApps) => {
          if (newStatus === 'approved') {
            // If one application is approved, all other pending ones are automatically rejected.
            return prevApps.map((app) => {
              if (app._id === applicationId) return { ...app, status: 'approved' };
              if (app.status === 'pending') return { ...app, status: 'rejected' };
              return app;
            });
          }
          // Otherwise, just update the status of the single rejected application.
          return prevApps.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app));
        });
        if (newStatus === 'approved' && pet) {
          setPet({ ...pet, status: 'adopted' });
        }
        return `Application has been ${newStatus}.`;
      },
      error: 'Failed to update status. Please try again.',
    });
  };

  // --- Render Logic ---
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (error) {
    return (
      <div className="container flex h-[calc(100vh-6rem)] items-center justify-center pt-24">
        <Alert variant="destructive" className="max-w-md"><AlertTriangle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error} <Link to="/my-listings" className="font-bold underline">Return to your listings.</Link></AlertDescription></Alert>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="container mx-auto max-w-5xl py-12 pt-32">
        {pet && (
          <div className="flex items-center gap-6 p-4 mb-8 rounded-lg bg-white shadow-sm">
            <Avatar className="h-24 w-24 rounded-lg"><AvatarImage src={pet.images[0]} alt={pet.name} className="object-cover" /><AvatarFallback>{pet.name.charAt(0)}</AvatarFallback></Avatar>
            <div>
              <p className="text-sm text-neutral-500">Applications for</p>
              <h1 className="text-3xl font-bold">{pet.name}</h1>
              <p className="text-neutral-600">{pet.age} y/o {pet.breed}</p>
            </div>
            <div className="ml-auto"><Badge className={`capitalize text-base ${pet.status === 'adopted' ? 'bg-green-600' : 'bg-neutral-400'}`}>{pet.status}</Badge></div>
          </div>
        )}
        <ApplicationStatusFilter onFilterChange={setStatusFilter} />
        <div className="space-y-6">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => <SellerApplicationCard key={app._id} application={app} onApprove={() => handleStatusUpdate(app._id, 'approved')} onReject={() => handleStatusUpdate(app._id, 'rejected')} />)
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