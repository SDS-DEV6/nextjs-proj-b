import React, { PropsWithChildren, Dispatch, SetStateAction } from "react";
import axios from "axios";
import DataModal from "../dataModal";
import { useRouter } from "next/navigation";

interface DeleteChapterProps {
  openDeleteChapterModal: boolean;
  setOpenDeleteChapterModal: Dispatch<SetStateAction<boolean>>;
  chapter: {
    chapterId: string;
    title: string;
    content: string;
  };
  router: any;
}

const DeleteChapter = (props: PropsWithChildren<DeleteChapterProps>) => {
  const router = useRouter();

  const handleVolumeDeleteSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Delete chapter
    try {
      await axios.delete(`/api/chapter/${props.chapter.chapterId}`);

      props.setOpenDeleteChapterModal(false);
      router.refresh();
      window.location.reload();
    } catch (err) {
      console.error("Error during chapter deletion process:", err);
      // Handle error (deletion failure), possibly set an error state to inform the user
    }
  };

  const handleVolumeDeleteCancel = (e: React.FormEvent) => {
    e.preventDefault();
    props.setOpenDeleteChapterModal(false);
  };

  return (
    <DataModal
      modalOpen={props.openDeleteChapterModal}
      setModalOpen={props.setOpenDeleteChapterModal}
    >
      <form
        onSubmit={handleVolumeDeleteSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Warning this action is irreversible. Are you sure you want to delete
          this chapter and all its contents?
        </label>

        <button
          type="submit"
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Delete Chapter
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

export default DeleteChapter;
