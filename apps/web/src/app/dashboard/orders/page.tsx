"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

import { OrderData } from "@/types";

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<OrderData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Fake the orders endpoint for now if it doesn't exist
    setOrders([]);
    setLoading(false);
  }, []);

  const formatCurrency = (amountInCents: number) => {
    return (amountInCents / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Track the status of your manufacturing orders.
          </p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Track the status of your manufacturing orders.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-medium mb-2">No orders found</h3>
            <p className="text-muted-foreground mb-6">
              You haven&apos;t placed any manufacturing orders yet.
            </p>
            <Link href="/upload">
              <Button>Upload a model</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="hover:border-primary/50 transition-colors"
            >
              <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">
                      Order #{order.id.substring(0, 8)}
                    </h3>
                    <Badge variant="default">{order.status}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>{order.itemCount} items</span>
                    <span>•</span>
                    <span>
                      Placed {formatDistanceToNow(new Date(order.createdAt))}{" "}
                      ago
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </div>

                  <Link href={`/dashboard/orders/${order.id}`}>
                    <Button variant="outline">Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
