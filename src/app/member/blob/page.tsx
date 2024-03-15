"use client";

import { type PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { del } from "@vercel/blob";
import { useState, useRef } from "react";

export default function AvatarUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState(null); // State for the image preview

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Generate a temporary URL to display the preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <>
      <h1>Upload Your Avatar</h1>

      <form
        onSubmit={async (event) => {
          event.preventDefault();

          if (!inputFileRef.current?.files) {
            throw new Error("No file selected");
          }

          const file = inputFileRef.current.files[0];

          const newBlob = await upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/upload",
          });

          setBlob(newBlob);
        }}
      >
        <input
          name="file"
          ref={inputFileRef}
          type="file"
          onChange={handleFileChange}
          required
        />
        <button type="submit">Upload</button>
      </form>
      {previewUrl && (
        <div>
          <img
            src={previewUrl}
            alt="Selected Avatar"
            style={{ maxWidth: "200px" }}
          />
        </div>
      )}

      {blob && (
        <div>
          Blob url: <a href={blob.url}>{blob.url}</a>
        </div>
      )}
    </>
  );
}
