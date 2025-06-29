// # User Navigation Dropdown Component

import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function UserNav() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out.");
    navigate("/");
  };

  if (!user || !user.name) {
    return null;
  }

  const initials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <Link to="/settings">
            <DropdownMenuItem>User Settings</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        
        {/* ! FIX: Conditionally render the entire Adopter section */}
        {user.profile_type === 'adopter' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">Adopter</DropdownMenuLabel>
            <Link to="/my-applications">
              <DropdownMenuItem>My Applications</DropdownMenuItem>
            </Link>
            <Link to="/browse">
              <DropdownMenuItem>Rehome a Pet</DropdownMenuItem>
            </Link>
          </>
        )}
        
        {/* =-= This logic was already correct */}
        {user.profile_type === 'seller' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">Seller</DropdownMenuLabel>
            <Link to="/my-listings">
              <DropdownMenuItem>My Listings</DropdownMenuItem>
            </Link>
            <Link to="/sell">
              <DropdownMenuItem>List A Pet</DropdownMenuItem>
            </Link>
          </>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}