// # 404 Not Found Page

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-8xl font-black text-neutral-300">404</CardTitle>
          <CardDescription className="text-2xl font-semibold text-neutral-800">
            Page Not Found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-600">
            Sorry, we couldn't find the page you were looking for. It might have been moved or deleted.
          </p>
        </CardContent>
        <div className="p-6 pt-0">
          <Link to="/">
            <Button size="lg">
              <Home className="mr-2 h-4 w-4" />
              Return to Homepage
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}