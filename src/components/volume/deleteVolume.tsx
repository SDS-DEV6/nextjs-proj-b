import React, { PropsWithChildren, Dispatch, SetStateAction } from "react";
import axios from "axios";
import DataModal from "../dataModal";
import { useRouter } from "next/navigation";

interface DeleteVolumeProps {
  openDeleteVolumeModal: boolean;
  setOpenDeleteVolumeModal: Dispatch<SetStateAction<boolean>>;
  volume: {
    volumeId: string;
    title: string;
  };
  router: any;
}

const DeleteNovel = (props: PropsWithChildren<DeleteVolumeProps>) => {
  const router = useRouter();

  const handleVolumeDeleteSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Delete volumes and their chapters
    try {
      await axios.delete(`/api/volume/${props.volume.volumeId}`);

      props.setOpenDeleteVolumeModal(false);
      router.refresh();
      window.location.reload();
    } catch (err) {
      console.error("Error during volume deletion process:", err);
      // Handle error (deletion failure), possibly set an error state to inform the user
    }
  };

  const handleVolumeDeleteCancel = (e: React.FormEvent) => {
    e.preventDefault();
    props.setOpenDeleteVolumeModal(false);
  };

  return (
    <DataModal
      modalOpen={props.openDeleteVolumeModal}
      setModalOpen={props.setOpenDeleteVolumeModal}
    >
      <form
        onSubmit={handleVolumeDeleteSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Warning this action is irreversible. Are you sure you want to delete
          this volume and all its chapters?
        </label>

        <button
          type="submit"
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Delete Volume
        </button>
        <button
          type="button"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleVolumeDeleteCancel}
        >
          Cancel
        </button>
      </form>
    </DataModal>
  );
};

export default DeleteNovel;
