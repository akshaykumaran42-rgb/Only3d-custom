"use client";

import * as React from "react";
import { fetchApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  ChevronRight,
  Check,
  Zap,
  Gauge,
  Settings2,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { PrinterProfileData, QuoteData } from "@/types";

export default function PrintersPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const materialId = searchParams.materialId as string;
  const [profiles, setProfiles] = React.useState<PrinterProfileData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [generating, setGenerating] = React.useState(false);
  const [selectedProfileId, setSelectedProfileId] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    if (!materialId) {
      router.push(`/upload/${params.id}/materials`);
      return;
    }

    async function loadProfiles() {
      try {
        const data = await fetchApi<PrinterProfileData[]>("/printers/profiles");
        setProfiles(data);
      } catch (err: unknown) {
        console.error("Failed to load printer profiles", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfiles();
  }, [materialId, params.id, router]);

  const handleGenerateQuote = async () => {
    if (selectedProfileId && materialId && params.id) {
      setGenerating(true);
      try {
        const quote = await fetchApi<QuoteData>("/quotes", {
          method: "POST",
          body: JSON.stringify({
            uploadId: params.id,
            materialId,
            printerProfileId: selectedProfileId,
          }),
        });

        router.push(`/upload/${params.id}/quote/${quote.id}`);
      } catch (err: unknown) {
        console.error("Failed to generate quote", err);
        setGenerating(false);
      }
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
          <span className="text-foreground font-medium">Printer</span>
        </div>
        <Skeleton className="h-10 w-1/4 mb-8" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[280px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Group by profile type
  const groupedProfiles = profiles.reduce(
    (acc, profile) => {
      const type = profile.name.includes("Draft")
        ? "Draft"
        : profile.name.includes("Standard")
          ? "Standard"
          : profile.name.includes("High Quality")
            ? "High Quality"
            : "Specialty";
      if (!acc[type]) acc[type] = [];
      acc[type].push(profile);
      return acc;
    },
    {} as Record<string, PrinterProfileData[]>,
  );

  // Define sort order
  const typeOrder = ["Draft", "Standard", "High Quality", "Specialty"];

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
        <span className="text-foreground font-medium">Printer</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Select Print Quality
          </h1>
          <p className="text-muted-foreground mt-1">
            Choose a production profile optimized for speed, strength, or
            detail.
          </p>
        </div>
        <Button
          size="lg"
          disabled={!selectedProfileId || generating}
          onClick={handleGenerateQuote}
          className="group w-full md:w-auto min-w-[200px]"
        >
          {generating ? "Calculating Quote..." : "Generate Quote"}
          {!generating && (
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          )}
        </Button>
      </div>

      <div className="space-y-12">
        {typeOrder.map((type) => {
          const typeProfiles = groupedProfiles[type];
          if (!typeProfiles || typeProfiles.length === 0) return null;

          return (
            <div key={type}>
              <h2 className="text-xl font-semibold mb-6 pb-2 border-b">
                {type} Profiles
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {typeProfiles.map((profile) => (
                  <Card
                    key={profile.id}
                    className={`cursor-pointer transition-all hover:border-primary/50 relative overflow-hidden ${
                      selectedProfileId === profile.id
                        ? "border-primary ring-1 ring-primary"
                        : ""
                    }`}
                    onClick={() => setSelectedProfileId(profile.id)}
                  >
                    {selectedProfileId === profile.id && (
                      <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1 shadow-sm">
                        <Check className="w-4 h-4" />
                      </div>
                    )}

                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg pr-8">
                        {profile.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {profile.description ||
                          `Optimized settings for ${profile.name.toLowerCase()} prints.`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Layers className="w-4 h-4 shrink-0" />
                          <span>Layer: {profile.layerHeightMm}mm</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Settings2 className="w-4 h-4 shrink-0" />
                          <span>Nozzle: {profile.nozzleSizeMm}mm</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Gauge className="w-4 h-4 shrink-0" />
                          <span>Speed: {profile.printSpeedMmS}mm/s</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Zap className="w-4 h-4 shrink-0" />
                          <span>Infill: {profile.infillPercentage}%</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="bg-muted px-3 py-2 rounded-md text-sm font-medium flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Hourly Rate
                          </span>
                          <span>
                            {(profile.hourlyRate / 100).toLocaleString(
                              "en-US",
                              { style: "currency", currency: "USD" },
                            )}{" "}
                            / hr
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
