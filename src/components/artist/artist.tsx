"use client";

import React, { useState } from "react";
import DataModal from "../dataModal";
import axios from "axios";
import { useRouter } from "next/navigation";
import { type PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { useRef } from "react";

const Artists = ({ artistDb }: { artistDb: any }) => {
  const router = useRouter();

  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [blob, setBlob] = useState<PutBlobResult | null>(null); //for profile image
  const [blob2, setBlob2] = useState<PutBlobResult | null>(null); //for cover image

  const [previewProfileUrl, setPreviewProfileUrl] = useState(""); // State for the profile image preview
  const [newProfilePhoto, setNewProfilePhoto] = useState(false); //vercelblolb check for if new image is chosen

  const [previewCoverProfileUrl, setPreviewCoverProfileUrl] = useState(""); // State for the cover image preview
  const [newCoverProfilePhoto, setNewCoverProfilePhoto] = useState(false); //vercelblolb check for if new cover image is chosen

  const [message, setMessage] = useState("");

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageType: "profile" | "cover"
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Indicate that a new photo has been chosen based on the image type
      if (imageType === "profile") {
        setNewProfilePhoto(true);
      } else if (imageType === "cover") {
        setNewCoverProfilePhoto(true);
      }

      // Use FileReader to generate a preview URL
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        // Set the result as the new preview URL based on the image type
        if (imageType === "profile") {
          setPreviewProfileUrl(fileReader.result as string);
        } else if (imageType === "cover") {
          setPreviewCoverProfileUrl(fileReader.result as string);
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  const [openArtistModal, setOpenArtistModalOpen] = useState(false);
  const [updateArtistModal, setUpdateArtistModalOpen] = useState(artistDb);

  const handleUpdateArtist = async (e: React.FormEvent) => {
    e.preventDefault();

    // checks if a new profile photo has been selected
    if (
      newProfilePhoto &&
      profileInputRef.current &&
      profileInputRef.current.files &&
      profileInputRef.current.files[0]
    ) {
      try {
        if (updateArtistModal.profileUrl) {
          await axios.delete(
            `/api/delete?url=${encodeURIComponent(
              updateArtistModal.profileUrl
            )}`
          );
        }

        const file = profileInputRef.current.files[0];

        // Use the correct upload function as demonstrated in the working test file
        const newBlob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/blobUpload",
        });

        // Check if newBlob is not null and has a URL
        if (newBlob && newBlob.url) {
          // Update the updateArtistModal object with the new profile URL
          updateArtistModal.profileUrl = newBlob.url;
          setBlob(newBlob);
          setNewProfilePhoto(false);
        } else {
          throw new Error("Upload failed, newBlob is null or missing URL.");
        }
      } catch (err) {
        console.log("Error during photo update:", err);
        return;
      }
    }

    //checks if a new cover profile photo has been selected

    if (
      newCoverProfilePhoto &&
      coverInputRef.current &&
      coverInputRef.current.files &&
      coverInputRef.current.files[0]
    ) {
      try {
        if (updateArtistModal.coverProfileUrl) {
          await axios.delete(
            `/api/delete?url=${encodeURIComponent(
              updateArtistModal.coverProfileUrl
            )}`
          );
        }

        const file = coverInputRef.current.files[0];

        // Use the correct upload function as demonstrated in the working test file
        const newBlob2 = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/blobUpload",
        });

        // Check if newBlob2 is not null and has a URL
        if (newBlob2 && newBlob2.url) {
          // Update the updateArtistModal object with the new profile URL
          updateArtistModal.coverProfileUrl = newBlob2.url;
          setBlob2(newBlob2);
          setNewCoverProfilePhoto(false);
        } else {
          throw new Error("Upload failed, newBlob is null or missing URL.");
        }
      } catch (err) {
        console.log("Error during photo update:", err);
        return;
      }
    }

    // Now we can do the PATCH
    axios
      .patch(`api/artistData/${artistDb.artistId}`, updateArtistModal)
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
    setPreviewProfileUrl("");
    setPreviewCoverProfileUrl("");
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/reset/member", {
        email: updateArtistModal.email,
      });
      // Use the response data to set a success message
      setMessage(
        response.data.message || "Password reset link sent successfully."
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(
          error?.response?.data?.message ||
            "An error occurred. Please try again."
        );
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      <button onClick={() => setOpenArtistModalOpen(true)}>
        Update Profile
      </button>

      <DataModal
        modalOpen={openArtistModal}
        setModalOpen={setOpenArtistModalOpen}
      >
        <form
          onSubmit={handleUpdateArtist}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Profile Image:
          </label>
          {previewProfileUrl ? (
            <div>
              <img
                src={previewProfileUrl}
                alt="Selected Profile Image"
                style={{ maxWidth: "200px" }}
              />
            </div>
          ) : (
            <img
              src={updateArtistModal.profileUrl}
              alt="Old Profile Image File"
              style={{ maxWidth: "100%", height: "auto" }}
              key={updateArtistModal.profileUrl}
            />
          )}
          <input
            name="profile"
            ref={profileInputRef}
            type="file"
            onChange={(e) => handleFileChange(e, "profile")}
          />
          <input
            readOnly
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="profileUrl"
            value={updateArtistModal.profileUrl || ""}
          />
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Cover Image:
          </label>
          {previewCoverProfileUrl ? (
            <div>
              <img
                src={previewCoverProfileUrl}
                alt="Selected Cover Image"
                style={{ maxWidth: "200px" }}
              />
            </div>
          ) : (
            <img
              src={updateArtistModal.coverProfileUrl}
              alt="Old Cover Image File"
              style={{ maxWidth: "100%", height: "auto" }}
              key={updateArtistModal.coverProfileUrl}
            />
          )}
          <input
            name="cover"
            ref={coverInputRef}
            type="file"
            onChange={(e) => handleFileChange(e, "cover")}
          />
          <input
            readOnly
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="coverProfileUrl"
            value={updateArtistModal.coverProfileUrl || ""}
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
            Request Password Change:
          </label>
          <button
            type="button"
            onClick={handleResetPassword}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sent Request
          </button>
          {message && <p className="text-black">{message}</p>}
          <br /> <br />
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
      </DataModal>
    </div>
  );
};

export default Artists;
