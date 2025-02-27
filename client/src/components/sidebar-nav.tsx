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

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Candidates",
    href: "/candidates",
    icon: Users,
  },
  {
    title: "Add Candidate",
    href: "/add-candidate",
    icon: UserPlus,
  },
];

export default function SidebarNav() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  // Move rendering logic into a conditional rather than early return
  if (user) {
    return (
      <div className="border-r bg-card w-64 p-4 space-y-4">
        <div className="flex items-center justify-between px-2 py-4">
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6" />
            <h1 className="text-xl font-bold">ATS Portal</h1>
          </div>
        </div>

        <div className="px-2 py-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                {user.username}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-accent",
                  location === item.href && "bg-accent"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </a>
            </Link>
          ))}
        </nav>
      </div>
    );
  }

  return null;
}