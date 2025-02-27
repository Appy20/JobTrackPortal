
import { Link, useLocation } from "wouter";
import { Users, UserPlus, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SidebarNav() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  if (!user) return null;

  return (
    <div className="border-r min-h-screen w-64 p-6 hidden md:block">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">ATS Portal</h2>
        <p className="text-sm text-muted-foreground">
          Welcome, {user.username}
        </p>
      </div>
      <nav className="space-y-1">
        <NavItem 
          href="/" 
          icon={<LayoutDashboard className="mr-2 h-4 w-4" />}
          isActive={location === "/"}
        >
          Dashboard
        </NavItem>
        
        <NavItem 
          href="/candidates" 
          icon={<Users className="mr-2 h-4 w-4" />}
          isActive={location === "/candidates"}
        >
          Candidates
        </NavItem>
        
        <NavItem 
          href="/add-candidate" 
          icon={<UserPlus className="mr-2 h-4 w-4" />}
          isActive={location === "/add-candidate"}
        >
          Add Candidate
        </NavItem>
      </nav>
      <div className="mt-auto pt-8">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              Account
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => logoutMutation.mutate()}
              className="cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function NavItem({ 
  href, 
  icon, 
  children, 
  isActive 
}: { 
  href: string; 
  icon: React.ReactNode; 
  children: React.ReactNode; 
  isActive: boolean;
}) {
  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center px-3 py-2 text-sm rounded-md",
          isActive
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted cursor-pointer"
        )}
      >
        {icon}
        {children}
      </div>
    </Link>
  );
}
