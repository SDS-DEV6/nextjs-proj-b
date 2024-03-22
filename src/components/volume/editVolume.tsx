import React, {
  useState,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
} from "react";
import axios from "axios"; // Assuming you have axios installed
import DataModal from "../dataModal";
import { useRouter } from "next/navigation";

interface EditVolumeProps {
  openEditVolumeModal: boolean;
  setOpenEditVolumeModal: Dispatch<SetStateAction<boolean>>;
  volume: {
    volumeId: string;
    title: string;
  };

  router: any;
}

const EditVolume = (props: PropsWithChildren<EditVolumeProps>) => {
  const router = useRouter();
  const [volumeDetailsModal, setVolumeDetailsModal] = useState(props.volume);

  const handleVolumeEditSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    await axios
      .patch(`/api/volume/${props.volume.volumeId}`, volumeDetailsModal, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res);
        props.setOpenEditVolumeModal(false);
        router.refresh();
        window.location.reload();
      })
      .catch((err) => {
        console.error("Failed to update volume details:", err);
        console.error(err.response?.data);
      });
  };

  const handleVolumeDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setVolumeDetailsModal((prevState: typeof volumeDetailsModal) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleNovelEditCancel = (e: React.FormEvent) => {
    e.preventDefault();
    props.setOpenEditVolumeModal(false);
  };

  return (
    <DataModal
      modalOpen={props.openEditVolumeModal}
      setModalOpen={props.setOpenEditVolumeModal}
    >
      <form
        onSubmit={handleVolumeEditSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Title:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          name="title"
          value={volumeDetailsModal.title || ""}
          onChange={handleVolumeDetailChange}
          required
        />

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Update volume
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

export default EditVolume;
