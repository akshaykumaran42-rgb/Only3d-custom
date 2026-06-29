import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Box, Zap, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-24 pb-32">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-8">
          Only3D Platform 2.0 is live
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mb-6 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
          Upload your 3D model and receive an instant manufacturing quote.
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-10">
          Industrial-grade 3D printing with instant pricing, deterministic
          material cost calculation, and automated manufacturing pipelines.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/upload">
            <Button size="lg" className="h-12 px-8 text-base group">
              Start your quote
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/materials">
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              Explore materials
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/20 py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Box className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Intelligent Analysis</h3>
              <p className="text-muted-foreground">
                Our engine automatically repairs meshes, calculates bounding
                boxes, and detects printability issues before you order.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Deterministic Pricing</h3>
              <p className="text-muted-foreground">
                Quotes aren&apos;t estimates. We calculate exact filament usage,
                machine depreciation, power consumption, and failure margins.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Production Quality</h3>
              <p className="text-muted-foreground">
                Access a fleet of industrial and prosumer printers calibrated
                for dimensional accuracy and structural integrity.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
