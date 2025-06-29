// # Seller Application Card Component

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Check, X } from "lucide-react";
import type { ApplicationWithDetails } from "@/api/applicationAPI";
import { Link } from "react-router-dom";

interface SellerApplicationCardProps {
  application: ApplicationWithDetails;
  // ? We will pass down functions to handle the approve/reject actions
  onApprove: (applicationId: string) => void;
  onReject: (applicationId: string) => void;
}

export const SellerApplicationCard = ({ application, onApprove, onReject }: SellerApplicationCardProps) => {
  
  // * Helper to get badge color based on status
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
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

  const applicant = application.applicant;
  const initials = applicant.name.split(' ').map(n => n[0]).join('');

  return (
    <Card className="bg-white shadow-sm overflow-hidden">
      <CardHeader className="flex-row items-center gap-4 p-6 bg-neutral-50 border-b">
        <Avatar className="h-16 w-16">
          <AvatarImage src={applicant.picture} alt={applicant.name} />
          <AvatarFallback className="text-xl">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <CardTitle className="text-xl">{applicant.name}</CardTitle>
          <p className="text-sm text-neutral-500">Applied on: {new Date(application.createdAt).toLocaleDateString()}</p>
        </div>
        <Badge variant={getStatusBadgeVariant(application.status)} className="capitalize text-sm px-3 py-1">
          {application.status}
        </Badge>
      </CardHeader>

      <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="font-semibold text-neutral-800">Contact Information</h4>
          <div className="flex items-center gap-3 text-sm text-neutral-600">
            <Mail className="h-4 w-4 text-neutral-400" />
            <span>{applicant.email}</span>
          </div>
          {applicant.contact && (
            <div className="flex items-center gap-3 text-sm text-neutral-600">
              <Phone className="h-4 w-4 text-neutral-400" />
              <span>{applicant.contact}</span>
            </div>
          )}
        </div>
        
        <Separator orientation="vertical" className="hidden md:block" />
        
        {/* Adoption Intent */}
        <div className="space-y-4">
          <h4 className="font-semibold text-neutral-800">Adoption Intent</h4>
          <p className="text-sm text-neutral-600 leading-relaxed">{application.adoption_intent}</p>
        </div>

        {/* Home Environment */}
        <div className="space-y-4 md:col-span-2">
          <h4 className="font-semibold text-neutral-800">Home Environment</h4>
          <p className="text-sm text-neutral-600 leading-relaxed">{application.pet_location_plan}</p>
        </div>
      </CardContent>

      <CardFooter className="bg-neutral-50 p-4 flex justify-end gap-2">
        <Link to="/contact-user" state={{ recipient: application.applicant, petName: application.pet.name }}>
            <Button variant="ghost" size="sm">Contact Adopter</Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700" onClick={() => onReject(application._id)}>
            <X className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button variant="outline" size="sm" className="text-green-600 border-green-300 hover:bg-green-50 hover:text-green-700" onClick={() => onApprove(application._id)}>
            <Check className="mr-2 h-4 w-4" />
            Approve
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};