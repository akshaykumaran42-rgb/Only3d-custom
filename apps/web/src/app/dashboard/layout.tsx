"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  ShoppingBag,
  UploadCloud,
  User,
  MapPin,
  Receipt,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Quotes", href: "/dashboard/quotes", icon: FileText },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { name: "Uploads", href: "/dashboard/uploads", icon: UploadCloud },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Addresses", href: "/dashboard/addresses", icon: MapPin },
    { name: "Invoices", href: "/dashboard/invoices", icon: Receipt },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
