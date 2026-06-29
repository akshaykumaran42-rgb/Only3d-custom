import { UploadDropzone } from "@/components/UploadDropzone";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Model | Only3D",
  description:
    "Upload your 3D model to receive an instant manufacturing quote.",
};

export default function UploadPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      <div className="text-center max-w-2xl mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          Start your quote
        </h1>
        <p className="text-xl text-muted-foreground">
          Upload your 3D model for instant structural analysis, material
          selection, and deterministic pricing.
        </p>
      </div>

      <div className="w-full max-w-3xl bg-card border rounded-2xl shadow-sm p-8">
        <UploadDropzone />
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>Your files are securely encrypted and automatically analyzed.</p>
        <p>We do not share your IP or designs with third parties.</p>
      </div>
    </div>
  );
}
