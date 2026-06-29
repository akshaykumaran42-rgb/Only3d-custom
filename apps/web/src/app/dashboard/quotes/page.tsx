"use client";

import * as React from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

import { QuoteData } from "@/types";

export default function QuotesPage() {
  const [quotes, setQuotes] = React.useState<QuoteData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadQuotes() {
      try {
        const data = await fetchApi<QuoteData[]>("/quotes");
        setQuotes(data);
      } catch (err) {
        console.error("Failed to load quotes", err);
      } finally {
        setLoading(false);
      }
    }
    loadQuotes();
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
          <h1 className="text-3xl font-bold tracking-tight">Quotes</h1>
          <p className="text-muted-foreground mt-1">
            Manage your active and expired quotes.
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
          <h1 className="text-3xl font-bold tracking-tight">Quotes</h1>
          <p className="text-muted-foreground mt-1">
            Manage your active and expired quotes.
          </p>
        </div>
        <Link href="/upload">
          <Button>New Quote</Button>
        </Link>
      </div>

      {quotes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-medium mb-2">No quotes found</h3>
            <p className="text-muted-foreground mb-6">
              You haven&apos;t generated any manufacturing quotes yet.
            </p>
            <Link href="/upload">
              <Button>Upload a model</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {quotes.map((quote) => (
            <Card
              key={quote.id}
              className="hover:border-primary/50 transition-colors"
            >
              <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">
                      {quote.uploadSnapshot?.originalFilename || "3D Model"}
                    </h3>
                    <Badge
                      variant={
                        quote.state === "PENDING"
                          ? "default"
                          : quote.state === "ACCEPTED"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {quote.state}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>{quote.materialSnapshot?.name}</span>
                    <span>•</span>
                    <span>{quote.printerSnapshot?.name}</span>
                    <span>•</span>
                    <span>
                      Created {formatDistanceToNow(new Date(quote.createdAt))}{" "}
                      ago
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {formatCurrency(
                        (quote.pricing?.materialCost || 0) +
                          (quote.pricing?.machineCost || 0) +
                          (quote.pricing?.electricityCost || 0) +
                          (quote.pricing?.wearCost || 0) +
                          (quote.pricing?.failureMargin || 0) +
                          (quote.pricing?.packagingCost || 0) +
                          (quote.pricing?.profitMargin || 0),
                      )}
                    </div>
                  </div>

                  <Link href={`/upload/${quote.uploadId}/quote/${quote.id}`}>
                    <Button
                      variant={
                        quote.state === "PENDING" ? "default" : "outline"
                      }
                    >
                      View
                    </Button>
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
