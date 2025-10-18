// src/pages/MyApplicationsPage.tsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Loader2, NotebookPen } from 'lucide-react';

import { getMyApplications, type Application } from '@/api/applicationAPI';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ApplicationCard } from '@/components/applications/ApplicationCard';

/**
 * A page where users can view and track the status of all the adoption
 * applications they have submitted.
 */
export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect to fetch the user's applications on component mount.
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getMyApplications();
        setApplications(data);
      } catch (_error) {
        setError('Could not load your applications. Please try again later.');
        console.error('Failed to fetch applications:', _error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // --- Render Logic ---
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (error) {
    return (
      <div className="container flex h-[calc(100vh-6rem)] items-center justify-center pt-24">
        <Alert variant="destructive" className="max-w-md"><AlertTriangle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 pt-32">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Adoption Applications</h1>
        <p className="text-neutral-500">Track the status of pets you've applied for.</p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <NotebookPen className="mx-auto h-12 w-12 text-neutral-400" />
          <h3 className="mt-4 text-xl font-semibold">No applications yet.</h3>
          <p className="text-neutral-500 mt-2">When you apply to adopt a pet, your application will appear here.</p>
          <Link to="/browse"><Button className="mt-4">Find a Friend</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => <ApplicationCard key={app._id} application={app} />)}
        </div>
      )}
    </div>
  );
}