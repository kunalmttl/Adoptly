// # My Applications Page

import { useEffect, useState } from "react";
import { getMyApplications, type ApplicationWithPet } from "@/api/applicationAPI";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2, NotebookPen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ApplicationCard } from "@/components/applications/ApplicationCard"; 


export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationWithPet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getMyApplications();
        setApplications(data);
      } catch (_error) {
        setError("Could not load your applications. Please try again later.");
        console.error("Failed to fetch applications:", _error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, []);


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
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 pt-32">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Adoption Applications</h1>
        <p className="text-neutral-500">Track the status of pets you've applied for.</p>
      </div>

      {/* # 3. Content: Either empty state or list of applications */}
      {applications.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <NotebookPen className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-xl font-semibold">No applications yet.</h3>
            <p className="text-neutral-500 mt-2">When you apply to adopt a pet, your application will appear here.</p>
            <Link to="/browse">
                <Button className="mt-4">Find a Friend</Button>
            </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* =-= Use the new ApplicationCard component for a cleaner layout */}
          {applications.map((app) => (
            <ApplicationCard key={app._id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}