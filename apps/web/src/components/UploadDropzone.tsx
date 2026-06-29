"use client";

import * as React from "react";
import { UploadCloud, File, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/api";
import { useRouter } from "next/navigation";

interface UploadDropzoneProps {
  className?: string;
}

export function UploadDropzone({ className }: UploadDropzoneProps) {
  const router = useRouter();
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    setError(null);

    // Validate file type
    const validExtensions = [".stl", ".3mf"];
    const extension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!validExtensions.includes(extension)) {
      setError(
        `Unsupported file format. Please upload ${validExtensions.join(" or ")}`,
      );
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      // 50MB
      setError("File is too large. Maximum size is 50MB.");
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Using XHR to track upload progress
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_URL}/uploads`, true);

      // Try to get token from localStorage if in browser
      let token = null;
      if (typeof window !== "undefined") {
        token = localStorage.getItem("accessToken");
      }
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100,
          );
          setProgress(percentComplete);
        }
      };

      const response = await new Promise<unknown>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error("Upload failed"));
          }
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(formData);
      });

      // Redirect to analysis page
      if (response && typeof response === "object" && "id" in response) {
        router.push(`/upload/${response.id}/analysis`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
      setIsUploading(false);
    }
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-80 rounded-xl border-2 border-dashed transition-all duration-200 ease-in-out",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
          isUploading && "pointer-events-none opacity-80",
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".stl,.3mf"
          onChange={handleFileSelect}
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center text-center p-6">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-lg font-medium">Uploading your model...</p>
            <div className="w-64 h-2 bg-secondary rounded-full mt-6 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center p-6 cursor-pointer">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
              <UploadCloud className="w-8 h-8" />
            </div>
            <p className="text-xl font-semibold mb-2">
              Drag & drop your 3D model
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Supported formats: .STL, .3MF (Max 50MB)
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Select File
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-destructive">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
