"use client";

import React, { useState } from "react";
import UserData from "./userData";
import axios from "axios";
import { useRouter } from "next/navigation";
import bcryptjs from "bcryptjs";
import { set } from "zod";

const Artists = ({ artistDb }: { artistDb: any }) => {
  const router = useRouter();

  const [openArtistModal, setOpenArtistModalOpen] = useState(false);
  const [updateArtistModal, setUpdateArtistModalOpen] = useState(artistDb);

  const generatePasswordHash = async (password: string) => {
    const salt = await bcryptjs.genSalt(10);
    return bcryptjs.hash(password, salt);
  };

  const handleUpdateArtist = (e: React.FormEvent) => {
    e.preventDefault();

    // const hashed = await generatePasswordHash(result.data.password);
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
