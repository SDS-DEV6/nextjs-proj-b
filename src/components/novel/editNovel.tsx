import React, {
  useState,
  useEffect,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
} from "react";
import axios from "axios"; // Assuming you have axios installed
import DataModal from "../dataModal";
import { useRouter } from "next/navigation";
import { type PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { useRef } from "react";

interface EditNovelProps {
  openEditNovelModal: boolean;
  setOpenEditNovelModal: Dispatch<SetStateAction<boolean>>;
  novel: {
    novelId: string;
    title: string;
    thumbnailUrl: string;
    synopsis: string;
    genre: string[];
  };

  router: any;
}

const EditNovel = (props: PropsWithChildren<EditNovelProps>) => {
  const router = useRouter();

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState(""); // State for the image preview
  const [newPhoto, setNewPhoto] = useState(false);

  const [novelDetailsModal, setNovelDetailsModal] = useState(props.novel);

  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    props.novel.genre || []
  );
  useEffect(() => {
    setSelectedGenres(props.novel.genre || []);
  }, [props.novel.genre]);

  const [genreInputs, setGenreInputs] = useState({
    genre: Array.isArray(novelDetailsModal.genre)
      ? novelDetailsModal.genre
      : [],
  });

  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setSelectedGenres((prevGenres) => {
      const safePrevGenres = Array.isArray(prevGenres) ? prevGenres : []; // Ensure it's always an array

      if (checked) {
        return safePrevGenres.includes(value)
          ? safePrevGenres
          : [...safePrevGenres, value];
      } else {
        return safePrevGenres.filter((genre) => genre !== value);
      }
    });
  };

  /*

  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setSelectedGenres((prevGenres) => {
      if (checked) {
        return [...prevGenres, value];
      } else {
        return prevGenres.filter((genre) => genre !== value);
      }
    });
  };  */

  const handleNovelEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      newPhoto &&
      novelDetailsModal.thumbnailUrl &&
      inputFileRef.current &&
      inputFileRef.current.files &&
      inputFileRef.current.files[0]
    ) {
      try {
        await axios.delete(
          `/api/delete?url=${encodeURIComponent(
            novelDetailsModal.thumbnailUrl
          )}`
        );
        const file = inputFileRef.current.files[0];
        const newBlob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/blobUpload",
        });

        if (newBlob && newBlob.url) {
          // Update the updateArtistModal object with the new profile URL
          novelDetailsModal.thumbnailUrl = newBlob.url;
          setBlob(newBlob);
          setNewPhoto(false);
        } else {
          throw new Error("Upload failed, newBlob is null or missing URL.");
        }
      } catch (err) {
        console.log("Error during photo update:", err);
        // Handle error (deletion or upload failure), possibly set an error state to inform the user
        return; // Exit the function if deletion or upload fails
      }
    }

    const updatedNovelDetails = {
      ...novelDetailsModal,
      genre: selectedGenres.join(","),
    };

    await axios
      .patch(`/api/novel/${props.novel.novelId}`, updatedNovelDetails, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res);
        props.setOpenEditNovelModal(false);
        router.refresh(); // or router.replace(router.asPath);
      })
      .catch((err) => {
        console.error("Failed to update novel details:", err);
        console.error(err.response?.data);
      });
  };

  const handleNovelPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  const handleNovelDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setNovelDetailsModal((prevState: typeof novelDetailsModal) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleNovelEditCancel = (e: React.FormEvent) => {
    e.preventDefault();
    props.setOpenEditNovelModal(false);
  };

  return (
    <DataModal
      modalOpen={props.openEditNovelModal}
      setModalOpen={props.setOpenEditNovelModal}
    >
      <form
        onSubmit={handleNovelEditSubmit}
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
            src={novelDetailsModal.thumbnailUrl}
            alt="Old Image File"
            style={{ maxWidth: "100%", height: "auto" }}
            key={novelDetailsModal.thumbnailUrl}
          />
        )}
        <input
          name="file"
          ref={inputFileRef}
          type="file"
          onChange={handleNovelPhotoChange}
        />

        <input
          type="hidden"
          name="profileUrl"
          value={novelDetailsModal.thumbnailUrl || ""}
        />

        <label className="block text-gray-700 text-sm font-bold mb-2">
          Title:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          name="title"
          value={novelDetailsModal.title || ""}
          onChange={handleNovelDetailChange}
          required
        />

        <fieldset className="mb-4">
          <legend className="block text-gray-700 text-sm font-bold mb-2">
            Select Genre(s):
          </legend>
          {["Action", "Fantasy", "Comedy", "Romance", "Sci-Fi"].map((genre) => (
            <div key={genre}>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="genre"
                  value={genre}
                  checked={selectedGenres.includes(genre)}
                  onChange={handleGenreChange}
                  className="form-checkbox"
                />
                <span className="ml-2">{genre}</span>
              </label>
            </div>
          ))}
        </fieldset>

        <label className="block text-gray-700 text-sm font-bold mb-2">
          Synopsis:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          name="synopsis"
          value={novelDetailsModal.synopsis || ""}
          onChange={handleNovelDetailChange}
        />

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Update Novel
        </button>
        <button
          type="button"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleNovelEditCancel}
        >
          Cancel
        </button>
      </form>
    </DataModal>
  );
};

export default EditNovel;
