// src/components/applications/SellerApplicationCard.tsx

import type { Application } from '@/api/applicationAPI';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Check, Mail, Phone, X } from 'lucide-react';
import { Link } from 'react-router-dom';

// Define a reusable type for the badge variants.
type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

/**
 * Props for the SellerApplicationCard component.
 */
interface SellerApplicationCardProps {
  /** The application object containing applicant and pet details. */
  application: Application;
  /** Callback function to handle the 'approve' action. */
  onApprove: (applicationId: string) => void;
  /** Callback function to handle the 'reject' action. */
  onReject: (applicationId: string) => void;
}

/**
 * A detailed card for pet owners to review an adoption application.
 * It displays applicant information and provides action buttons.
 */
export const SellerApplicationCard = ({ application, onApprove, onReject }: SellerApplicationCardProps) => {
  const { applicant } = application;

  /**
   * Determines the visual style of the status badge.
   * @param status - The current application status.
   * @returns The corresponding variant name for the Badge component.
   */
  const getStatusBadgeVariant = (status: string): BadgeVariant => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'pending':
      default:
        return 'secondary';
    }
  };

  // Generates initials from the applicant's name for the avatar fallback.
  const initials = applicant.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <Card className="bg-white shadow-sm overflow-hidden">
      {/* Card Header: Applicant's basic info and application status */}
      <CardHeader className="flex-row items-center gap-4 p-6 bg-neutral-50 border-b">
        <Avatar className="h-16 w-16">
          <AvatarImage src={applicant.picture} alt={applicant.name} />
          <AvatarFallback className="text-xl">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <CardTitle className="text-xl">{applicant.name}</CardTitle>
          <p className="text-sm text-neutral-500">
            Applied on: {new Date(application.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Badge variant={getStatusBadgeVariant(application.status)} className="capitalize text-sm px-3 py-1">
          {application.status}
        </Badge>
      </CardHeader>

      {/* Card Content: Detailed information provided by the applicant */}
      <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-neutral-800">Contact Information</h4>
          <div className="flex items-center gap-3 text-sm text-neutral-600">
            <Mail className="h-4 w-4 text-neutral-400" />
            <span>{applicant.email}</span>
          </div>
          {/* With the corrected Applicant type, this conditional rendering is now fully type-safe. */}
          {applicant.contact ? (
            <div className="flex items-center gap-3 text-sm text-neutral-600">
              <Phone className="h-4 w-4 text-neutral-400" />
              <span>{applicant.contact}</span>
            </div>
          ) : null}
        </div>

        <Separator orientation="vertical" className="hidden md:block" />

        <div className="space-y-4">
          <h4 className="font-semibold text-neutral-800">Adoption Intent</h4>
          <p className="text-sm text-neutral-600 leading-relaxed">{application.adoption_intent}</p>
        </div>

        <div className="space-y-4 md:col-span-2">
          <h4 className="font-semibold text-neutral-800">Home Environment Plan</h4>
          <p className="text-sm text-neutral-600 leading-relaxed">{application.pet_location_plan}</p>
        </div>
      </CardContent>

      {/* Card Footer: Action buttons for the pet owner */}
      <CardFooter className="bg-neutral-50 p-4 flex justify-end gap-2">
        <Link to="/contact-user" state={{ recipient: applicant, petName: application.pet.name }}>
          <Button variant="ghost" size="sm">
            Contact Adopter
          </Button>
        </Link>
        {application.status === 'pending' && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
              onClick={() => onReject(application._id)}
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-green-600 border-green-300 hover:bg-green-50 hover:text-green-700"
              onClick={() => onApprove(application._id)}
            >
              <Check className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};