"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FileUpload from "@/components/ui/file-upload";
import { Uploads } from "@/generated/prisma";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const UploadImage = () => {
  const [isValid, setIsValid] = useState<boolean>(false);
  const [uploadProgress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) return;

    try {
      setIsUploading(true);

      const form = new FormData();
      form.append("file", files[0]);

      const response = await axios.post<{ data: Uploads }>(
        "/api/upload",
        form,
        {
          onUploadProgress: (progressEvent) => {
            const total = progressEvent.total || 1;
            const current = progressEvent.loaded;
            setProgress(Math.round((current / total) * 100));
          },
        }
      );

      if (response.data.data) {
        toast.success("Image uploaded successfully!");
        setIsValid(false);
        setProgress(0);

        router.push(`/uploaded/${response.data.data.code}`);
      }
    } catch {
      setIsUploading(false);
      toast.error("Failed to upload image");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Upload new file</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload new image</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <FileUpload
              onDrop={({ files, errors }) => {
                setIsValid(errors.length === 0 && files.length > 0);
                setFiles(files.map((file) => file.file as File));
              }}
              maxSize={50}
            />
            <Button disabled={!isValid || isUploading} className="w-full">
              {!isUploading ? "Upload" : `Uploading... ${uploadProgress}%`}
            </Button>
          </form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
