"use client";

import * as React from "react";
import { fetchApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Box,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import { QuoteData } from "@/types";

export default function QuotePage({
  params,
}: {
  params: { id: string; quoteId: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [quote, setQuote] = React.useState<QuoteData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [accepting, setAccepting] = React.useState(false);

  React.useEffect(() => {
    async function loadQuote() {
      try {
        const data = await fetchApi<QuoteData>(`/quotes/${params.quoteId}`);
        setQuote(data);
      } catch (err: unknown) {
        console.error("Failed to load quote", err);
        toast({
          title: "Error",
          description: "Could not load the quote. It may have expired.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    loadQuote();
  }, [params.quoteId, toast]);

  const handleAcceptQuote = async () => {
    setAccepting(true);
    try {
      await fetchApi(`/quotes/${params.quoteId}/accept`, {
        method: "POST",
      });

      toast({
        title: "Quote Accepted",
        description: "Your order has been created successfully.",
      });

      // Redirect to dashboard/orders after a short delay
      setTimeout(() => {
        router.push("/dashboard/orders");
      }, 1500);
    } catch (err: unknown) {
      console.error("Failed to accept quote", err);
      toast({
        title: "Acceptance Failed",
        description:
          err instanceof Error ? err.message : "Failed to accept the quote.",
        variant: "destructive",
      });
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <span>Upload</span>
          <ChevronRight className="w-4 h-4" />
          <span>Analysis</span>
          <ChevronRight className="w-4 h-4" />
          <span>Material</span>
          <ChevronRight className="w-4 h-4" />
          <span>Printer</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Quote</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Skeleton className="h-10 w-2/3 mb-2" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
          <div>
            <Skeleton className="h-[500px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">Quote Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The requested quote could not be loaded or has expired.
        </p>
        <Link href="/upload">
          <Button className="w-full">Start New Quote</Button>
        </Link>
      </div>
    );
  }

  const formatCurrency = (amountInCents: number) => {
    return (amountInCents / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const p = quote.pricing;

  const pricingItems = [
    {
      name: "Material",
      amount: p?.materialCost,
      desc: "Cost of filament/resin used",
    },
    {
      name: "Machine Time",
      amount: p?.machineCost,
      desc: "Amortized hardware cost",
    },
    {
      name: "Electricity",
      amount: p?.electricityCost,
      desc: "Power consumption during print",
    },
    {
      name: "Wear & Tear",
      amount: p?.wearCost,
      desc: "Maintenance parts (nozzles, beds)",
    },
    {
      name: "Failure Margin",
      amount: p?.failureMargin,
      desc: "Statistical buffer for print failures",
    },
    {
      name: "Packaging",
      amount: p?.packagingCost,
      desc: "Box, filler, and shipping prep",
    },
    { name: "Profit", amount: p?.profitMargin, desc: "Operational margin" },
  ];

  const totalCost = pricingItems.reduce(
    (sum, item) => sum + (item.amount || 0),
    0,
  );

  // Format the time estimation
  const estSeconds = quote.analysisSnapshot?.estimatedPrintTimeSeconds || 0;
  const estHours = Math.floor(estSeconds / 3600);
  const estMinutes = Math.floor((estSeconds % 3600) / 60);
  const timeString =
    estHours > 0 ? `${estHours}h ${estMinutes}m` : `${estMinutes}m`;

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/upload" className="hover:text-foreground">
          Upload
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          href={`/upload/${params.id}/analysis`}
          className="hover:text-foreground"
        >
          Analysis
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          href={`/upload/${params.id}/materials`}
          className="hover:text-foreground"
        >
          Material
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          href={`/upload/${params.id}/printers?materialId=${quote.materialSnapshot?.id}`}
          className="hover:text-foreground"
        >
          Printer
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium">Quote</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-3">
              Your Quote is Ready
            </h1>
            <p className="text-lg text-muted-foreground">
              Review your configuration and pricing breakdown.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-muted/30 rounded-xl border p-6">
              <div className="flex items-start gap-4 mb-6 pb-6 border-b">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Box className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {quote.uploadSnapshot?.originalFilename || "3D Model"}
                  </h3>
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    <span>
                      Vol: {quote.analysisSnapshot?.volumeMm3?.toFixed(0)} mm³
                    </span>
                    <span>Est Time: {timeString}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Material</p>
                  <p className="font-medium">{quote.materialSnapshot?.name}</p>
                  <p className="text-sm opacity-80">
                    {quote.materialSnapshot?.color}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Print Quality
                  </p>
                  <p className="font-medium">{quote.printerSnapshot?.name}</p>
                  <p className="text-sm opacity-80">
                    {quote.printerSnapshot?.layerHeightMm}mm Layer
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-lg flex gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Manufacturability Verified</p>
                <p className="text-sm mt-1 opacity-90">
                  This configuration passes all structural and capability checks
                  for our production fleet.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Card className="border-2 shadow-lg h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl">Pricing Breakdown</CardTitle>
              <CardDescription>
                Transparent calculation based on exact manufacturing parameters.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
              <div className="space-y-3">
                {pricingItems.map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between items-center group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{item.name}</span>
                      <div className="hidden group-hover:block text-muted-foreground">
                        <Info className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <span className="font-medium">
                      {formatCurrency(item.amount || 0)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-6 mt-6 border-t border-dashed border-border flex justify-between items-end">
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">
                    Total Quote (USD)
                  </p>
                </div>
                <div className="text-4xl font-extrabold tracking-tight">
                  {formatCurrency(totalCost)}
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-6 bg-muted/20 border-t">
              <Button
                size="lg"
                className="w-full h-14 text-lg"
                onClick={handleAcceptQuote}
                disabled={accepting || quote.state !== "PENDING"}
              >
                {accepting
                  ? "Processing..."
                  : quote.state === "PENDING"
                    ? "Accept Quote & Order"
                    : `Quote ${quote.state}`}
                {!accepting && quote.state === "PENDING" && (
                  <ArrowRight className="ml-2 w-5 h-5" />
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
