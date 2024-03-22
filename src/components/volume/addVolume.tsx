// AddVolume.jsx
import React, {
  useState,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DataModal from "../dataModal";

interface AddVolumeProps {
  openAddVolumeModal: boolean;
  setOpenAddVolumeModal: Dispatch<SetStateAction<boolean>>;
  novel: {
    novelId: string;
    title: string;
    thumbnailUrl: string;
    synopsis: string;
    genre: string[];
    volumes?: Array<{
      volumeId: string;
      volumeNumber: number;
      title: string;
      chapters: Array<{
        chapterId: string;
        chapterNumber: number;
        title: string;
        content: string;
      }>;
      totalChapters?: number;
    }>;
  };
  router: any;
}

const AddVolume = (props: PropsWithChildren<AddVolumeProps>) => {
  const router = useRouter();

  // Removed the duplicated state for modal visibility.
  const [volumeInputs, setVolumeInputs] = useState<{
    title?: string;
  }>({});

  const handleVolumeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setVolumeInputs((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddVolumeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const postData = {
      ...volumeInputs,
      novelId: props.novel.novelId,
    };

    axios
      .post("/api/volume", postData)
      .then((res) => {
        console.log(res);
        props.setOpenAddVolumeModal(false);
        router.refresh();
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setVolumeInputs({});
      });
  };

  const handleVolumeCancel = () => {
    props.setOpenAddVolumeModal(false);
    setVolumeInputs({});
    router.refresh();
  };

  return (
    <DataModal
      modalOpen={props.openAddVolumeModal}
      setModalOpen={props.setOpenAddVolumeModal}
    >
      <form
        onSubmit={handleAddVolumeSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Title:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          name="title"
          value={volumeInputs.title || ""}
          onChange={handleVolumeInputChange}
          required
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add New Volume
        </button>
        <button
          type="button"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleVolumeCancel}
        >
          Cancel
        </button>
      </form>
    </DataModal>
  );
};

export default AddVolume;
