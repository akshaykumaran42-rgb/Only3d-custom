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
import { ArrowRight, ChevronRight, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { MaterialData } from "@/types";

export default function MaterialsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [materials, setMaterials] = React.useState<MaterialData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedMaterialId, setSelectedMaterialId] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    async function loadMaterials() {
      try {
        const data = await fetchApi<MaterialData[]>("/materials");
        // We might want to filter active ones only, but API might already do that
        setMaterials(data.filter((m) => m.isActive));
      } catch (err: unknown) {
        console.error("Failed to load materials", err);
      } finally {
        setLoading(false);
      }
    }
    loadMaterials();
  }, []);

  const handleContinue = () => {
    if (selectedMaterialId) {
      router.push(
        `/upload/${params.id}/printers?materialId=${selectedMaterialId}`,
      );
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
          <span className="text-foreground font-medium">Material</span>
          <ChevronRight className="w-4 h-4" />
          <span>Printer</span>
        </div>
        <Skeleton className="h-10 w-1/4 mb-8" />
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[250px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Group materials by family
  const groupedMaterials = materials.reduce(
    (acc, material) => {
      const family = material.family || "Other";
      if (!acc[family]) acc[family] = [];
      acc[family].push(material);
      return acc;
    },
    {} as Record<string, MaterialData[]>,
  );

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
        <span className="text-foreground font-medium">Material</span>
        <ChevronRight className="w-4 h-4" />
        <span className="opacity-50">Printer</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Select Material</h1>
          <p className="text-muted-foreground mt-1">
            Choose the optimal material for your application requirements.
          </p>
        </div>
        <Button
          size="lg"
          disabled={!selectedMaterialId}
          onClick={handleContinue}
          className="group w-full md:w-auto"
        >
          Continue to Printers
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      <div className="space-y-12">
        {Object.entries(groupedMaterials).map(([family, mats]) => (
          <div key={family}>
            <h2 className="text-xl font-semibold mb-6 pb-2 border-b">
              {family}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mats.map((material) => (
                <Card
                  key={material.id}
                  className={`cursor-pointer transition-all hover:border-primary/50 relative overflow-hidden ${
                    selectedMaterialId === material.id
                      ? "border-primary ring-1 ring-primary"
                      : ""
                  }`}
                  onClick={() => setSelectedMaterialId(material.id)}
                >
                  {selectedMaterialId === material.id && (
                    <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1 shadow-sm">
                      <Check className="w-4 h-4" />
                    </div>
                  )}

                  {/* Color strip indicating material color */}
                  <div
                    className="h-2 w-full"
                    style={{ backgroundColor: material.hexColor || "#888" }}
                  />

                  <CardHeader className="pb-3">
                    <CardTitle className="flex justify-between items-start">
                      <span className="text-lg">{material.name}</span>
                    </CardTitle>
                    <CardDescription>
                      {material.color} • {material.type}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {material.description ||
                        `High-quality ${material.name} perfect for general prototyping and end-use parts.`}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <div className="bg-muted px-2.5 py-1 rounded-md text-xs font-medium">
                        {(material.costPerGram / 100).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}{" "}
                        / g
                      </div>
                      <div className="bg-muted px-2.5 py-1 rounded-md text-xs font-medium">
                        {material.densityGcm3} g/cm³
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
