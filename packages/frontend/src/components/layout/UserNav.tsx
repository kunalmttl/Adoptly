// src/components/layout/UserNav.tsx

import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuthStore } from '@/store/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

/**
 * A dropdown menu component for authenticated users.
 * It displays the user's avatar and provides links to profile-specific pages
 * and a logout action.
 */
export function UserNav() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  /**
   * Handles the user logout process.
   */
  const handleLogout = () => {
    logout();
    toast.success('You have been logged out.');
    navigate('/');
  };

  // Do not render if there is no user or the user object is incomplete.
  if (!user?.name) {
    return null;
  }

  // Generate initials from the user's name for the avatar fallback.
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.picture} alt={user.name} />
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

        {/* Conditionally render the Adopter-specific menu items. */}
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

        {/* Conditionally render the Seller-specific menu items. */}
        {user.profile_type === 'seller' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">Seller</DropdownMenuLabel>
            <Link to="/my-listings">
              <DropdownMenuItem>My Listings</DropdownMenuItem>
            </Link>
            <Link to="/sell">
              <DropdownMenuItem>List a Pet</DropdownMenuItem>
            </Link>
          </>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}