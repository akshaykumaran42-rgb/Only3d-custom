"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ShoppingBag, UploadCloud, Clock } from "lucide-react";

export default function DashboardOverview() {
  // In a real app, these would be fetched from an API
  const stats = [
    {
      title: "Active Orders",
      value: "3",
      icon: ShoppingBag,
      change: "+1 this week",
    },
    {
      title: "Pending Quotes",
      value: "12",
      icon: FileText,
      change: "4 expiring soon",
    },
    {
      title: "Recent Uploads",
      value: "24",
      icon: UploadCloud,
      change: "+5 this week",
    },
    {
      title: "Avg. Turnaround",
      value: "3.2 days",
      icon: Clock,
      change: "-0.5 days vs last month",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your manufacturing activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div className="ml-4 space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">
                      Order #100{i} shipped
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tracking updated for Industrial Bracket Assembly
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-sm text-muted-foreground">
                    {i}d ago
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Expiring Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="ml-4 space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">
                      Custom Enclosure V2
                    </p>
                    <p className="text-sm text-muted-foreground">
                      $142.50 • Nylon 12 • Standard
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-sm text-destructive">
                    Expires in {i * 12}h
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
