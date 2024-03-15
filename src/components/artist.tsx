"use client";

import React, { useState } from "react";
import UserData from "./userData";
import axios from "axios";
import { useRouter } from "next/navigation";
import bcryptjs from "bcryptjs";
import { set } from "zod";
import { type PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { useRef } from "react";

const Artists = ({ artistDb }: { artistDb: any }) => {
  const router = useRouter();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState(""); // State for the image preview
  const [newPhoto, setNewPhoto] = useState(false); //vercelblolb check for if new image is chosen

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Indicate that a new photo has been chosen
      setNewPhoto(true);

      // Use FileReader to generate a preview URL
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        // Set the result as the new preview URL
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const [openArtistModal, setOpenArtistModalOpen] = useState(false);
  const [updateArtistModal, setUpdateArtistModalOpen] = useState(artistDb);

  const generatePasswordHash = async (password: string) => {
    const salt = await bcryptjs.genSalt(10);
    return bcryptjs.hash(password, salt);
  };

  const handleUpdateArtist = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      newPhoto &&
      updateArtistModal.profileUrl &&
      inputFileRef.current &&
      inputFileRef.current.files &&
      inputFileRef.current.files[0]
    ) {
      try {
        await axios.delete(
          `/api/delete?url=${encodeURIComponent(updateArtistModal.profileUrl)}`
        );
        const file = inputFileRef.current.files[0];
        const newBlob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });

        updateArtistModal.profileUrl = newBlob.url;
        setNewPhoto(false);
      } catch (err) {
        console.log("Error during photo update:", err);
        // Handle error (deletion or upload failure), possibly set an error state to inform the user
        return; // Exit the function if deletion or upload fails
      }
    }
    axios
      .patch(`api/artistData/${artistDb.ArtistId}`, updateArtistModal)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setOpenArtistModalOpen(false);
        router.refresh();
      });
  };

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    setPreviewUrl("");
    setOpenArtistModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setUpdateArtistModalOpen((prevState: typeof updateArtistModal) => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
    <div>
      <button onClick={() => setOpenArtistModalOpen(true)}>
        Update Profile
      </button>

      <UserData
        modalOpen={openArtistModal}
        setModalOpen={setOpenArtistModalOpen}
      >
        <form
          onSubmit={handleUpdateArtist}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          {previewUrl ? (
            <div>
              <img
                src={previewUrl}
                alt="Selected Avatar"
                style={{ maxWidth: "200px" }}
              />
            </div>
          ) : (
            <img
              src={updateArtistModal.profileUrl}
              alt="Old Image File"
              style={{ maxWidth: "100%", height: "auto" }}
              key={updateArtistModal.profileUrl}
            />
          )}
          <input
            name="file"
            ref={inputFileRef}
            type="file"
            onChange={handleFileChange}
            required
          />

          <input
            type="hidden"
            name="profileUrl"
            value={updateArtistModal.profileUrl || ""}
          />
          <input
            type="hidden"
            name="profileKeyUrl"
            value={updateArtistModal.profileKeyUrl || ""}
          />

          <label className="block text-gray-700 text-sm font-bold mb-2">
            First Name:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="firstName"
            value={updateArtistModal.firstName || ""}
            onChange={handleChange}
            required
          />

          <label className="block text-gray-700 text-sm font-bold mb-2">
            Last Name:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="lastName"
            value={updateArtistModal.lastName || ""}
            onChange={handleChange}
            required
          />

          <label className="block text-gray-700 text-sm font-bold mb-2">
            Suffix:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="suffix"
            value={updateArtistModal.suffix || ""}
            onChange={handleChange}
          />

          <label className="block text-gray-700 text-sm font-bold mb-2">
            About:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="aboutMe"
            value={updateArtistModal.aboutMe || ""}
            onChange={handleChange}
          />

          <label className="block text-gray-700 text-sm font-bold mb-2">
            Update Password: (Feature Currently Unavailable)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="password"
            value={updateArtistModal.password || ""}
            onChange={handleChange}
            readOnly
          />

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update Admin Data
          </button>
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </form>
      </UserData>
    </div>
  );
};

export default Artists;
