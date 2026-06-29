"use client";

import * as React from "react";
import { fetchApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  ArrowRight,
  Box,
  CheckCircle2,
  ChevronRight,
  Triangle,
  FileCheck,
  Maximize,
} from "lucide-react";
import Link from "next/link";

import { AnalysisData } from "@/types";

export default function AnalysisPage({ params }: { params: { id: string } }) {
  const [analysis, setAnalysis] = React.useState<AnalysisData | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadAnalysis() {
      try {
        const data = await fetchApi<AnalysisData>(
          `/uploads/${params.id}/analysis`,
        );
        setAnalysis(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to load analysis",
        );
      } finally {
        setLoading(false);
      }
    }
    loadAnalysis();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <span>Upload</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Analysis</span>
          <ChevronRight className="w-4 h-4" />
          <span>Material</span>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Skeleton className="h-10 w-1/3 mb-4" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Analysis Failed</h2>
        <p className="text-muted-foreground mb-8 max-w-md">{error}</p>
        <Link href="/upload">
          <Button>Upload a different file</Button>
        </Link>
      </div>
    );
  }

  if (!analysis) return null;

  const isPrintable = analysis.isPrintable;

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/upload" className="hover:text-foreground">
          Upload
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium">Analysis</span>
        <ChevronRight className="w-4 h-4" />
        <span className="opacity-50">Material</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Model Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Review the geometric properties of your uploaded model.
          </p>
        </div>
        <Link href={`/upload/${params.id}/materials`}>
          <Button size="lg" disabled={!isPrintable} className="group">
            Choose Material
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      {!isPrintable && (
        <div className="mb-8 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex gap-4">
          <AlertCircle className="w-6 h-6 text-destructive shrink-0" />
          <div>
            <h3 className="font-semibold text-destructive">
              Model is not printable
            </h3>
            <p className="text-sm text-destructive/90 mt-1">
              We detected severe manifold errors or non-watertight geometry.
              Please fix your model and upload again.
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* 3D Preview Placeholder */}
          <div className="aspect-[4/3] bg-muted/30 rounded-xl border flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-background/50 to-muted/20" />
            <Box className="w-24 h-24 text-muted-foreground/30 animate-pulse" />
            <div className="absolute bottom-4 left-4 flex gap-2">
              <div className="bg-background/80 backdrop-blur px-3 py-1.5 rounded-md text-xs font-medium border shadow-sm">
                X: {analysis.dimensionsX.toFixed(2)}mm
              </div>
              <div className="bg-background/80 backdrop-blur px-3 py-1.5 rounded-md text-xs font-medium border shadow-sm">
                Y: {analysis.dimensionsY.toFixed(2)}mm
              </div>
              <div className="bg-background/80 backdrop-blur px-3 py-1.5 rounded-md text-xs font-medium border shadow-sm">
                Z: {analysis.dimensionsZ.toFixed(2)}mm
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Geometric Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Box className="w-4 h-4" />
                  <span className="text-sm">Volume</span>
                </div>
                <span className="font-medium">
                  {analysis.volumeMm3.toFixed(2)} mm³
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Maximize className="w-4 h-4" />
                  <span className="text-sm">Surface Area</span>
                </div>
                <span className="font-medium">
                  {analysis.surfaceAreaMm2.toFixed(2)} mm²
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Triangle className="w-4 h-4" />
                  <span className="text-sm">Triangle Count</span>
                </div>
                <span className="font-medium">
                  {analysis.triangleCount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileCheck className="w-4 h-4" />
                  <span className="text-sm">Manifold Status</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {analysis.isManifold ? (
                    <>
                      <span className="font-medium text-emerald-500">
                        Watertight
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </>
                  ) : (
                    <>
                      <span className="font-medium text-amber-500">
                        Open Edges
                      </span>
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-primary-foreground/90">
                Next Step
              </CardTitle>
              <CardDescription className="text-primary-foreground/70">
                Select the manufacturing material for your part to continue with
                the quote.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Link href={`/upload/${params.id}/materials`}>
                <Button
                  variant="secondary"
                  className="w-full"
                  disabled={!isPrintable}
                >
                  Select Material
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
