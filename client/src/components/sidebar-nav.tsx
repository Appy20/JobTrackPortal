import { Link, useLocation } from "wouter";
import { Users, UserPlus, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [location] = useLocation();

  return (
    <div className="border-r bg-card w-64 p-4 space-y-4">
      <div className="flex items-center space-x-2 px-2 py-4">
        <Users className="h-6 w-6" />
        <h1 className="text-xl font-bold">ATS Portal</h1>
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
