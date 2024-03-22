"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { useRef } from "react";
import { useSession } from "next-auth/react";
import DataModal from "../dataModal";

const AddNovel = () => {
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: session, status } = useSession();

  const [inputs, setInputs] = useState<{
    title?: string;
    genre?: string[];
    synopsis?: string;
    thumbnailUrl?: string;
    artistId?: string;
  }>({ genre: [] });

  const genres = ["Action", "Fantasy", "Comedy", "Romance", "Sci-Fi"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name !== "genre") {
      setInputs((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const triggerFileInput = () => {
    inputFileRef.current?.click();
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputs((inputs) => {
      const currentGenres = inputs.genre || [];
      const isSelected = currentGenres.includes(value);
      if (isSelected) {
        return {
          ...inputs,
          genre: currentGenres.filter((genre) => genre !== value),
        };
      } else {
        return { ...inputs, genre: [...currentGenres, value] };
      }
    });
  };

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    setModalOpen(false);
    setInputs({});
    router.refresh();
    window.location.reload();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputFileRef.current?.files) {
      throw new Error("No cover photo selected");
    }

    const file = inputFileRef.current?.files[0];
    if (file) {
      try {
        const newBlob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/blobUpload",
        });

        const novelData = {
          ...inputs,
          genre: inputs.genre?.join(", "),
          artistId: session?.user?.ID,
          thumbnailUrl: newBlob.url,
        };

        console.log(novelData);

        await axios
          .post("/api/novel", novelData)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            setInputs({});
            setPreviewUrl(null);
            setModalOpen(false);
            router.refresh();
            window.location.reload();
          });
      } catch (error) {
        console.error("Error uploading cover photo:", error);
      }
    } else {
      console.error("No file selected for upload.");
    }
    router.refresh();
  };

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => setModalOpen(true)}
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Create Novel
      </button>

      <DataModal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Thumbnail:
          </label>
          <div className="mb-4">
            {previewUrl && (
              <div>
                <img
                  src={previewUrl}
                  alt="Selected Avatar"
                  style={{ maxWidth: "200px" }}
                />
              </div>
            )}
            <input
              name="file"
              ref={inputFileRef}
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }} // Hide the input
              required
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={triggerFileInput}
            >
              Choose Photo
            </button>

            <br />

            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="title"
              value={inputs.title || ""}
              onChange={handleChange}
              required
            />

            <fieldset className="mb-4">
              <legend className="block text-gray-700 text-sm font-bold mb-2">
                Select Genre(s):
              </legend>
              {genres.map((genre) => (
                <div key={genre}>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="genre"
                      value={genre}
                      checked={
                        inputs.genre ? inputs.genre.includes(genre) : false
                      }
                      onChange={handleGenreChange}
                      className="form-checkbox"
                    />
                    <span className="ml-2">{genre}</span>
                  </label>
                </div>
              ))}
            </fieldset>

            <label className="block text-gray-700 text-sm font-bold mb-2">
              Enter Synopsis:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="synopsis"
              value={inputs.synopsis || ""}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create New Novel
          </button>
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </form>
      </DataModal>
    </div>
  );
};

export default AddNovel;
