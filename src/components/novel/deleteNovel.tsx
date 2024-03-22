import React, { PropsWithChildren, Dispatch, SetStateAction } from "react";
import axios from "axios";
import DataModal from "../dataModal";
import { useRouter } from "next/navigation";

interface DeleteNovelProps {
  openDeleteNovelModal: boolean;
  setOpenDeleteNovelModal: Dispatch<SetStateAction<boolean>>;
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
      }>;
    }>;
  };
  router: any;
}

const DeleteNovel = (props: PropsWithChildren<DeleteNovelProps>) => {
  const router = useRouter();

  const handleNovelDeleteSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Delete volumes and their chapters
    try {
      await axios.delete(`/api/novel/${props.novel.novelId}`);

      // Inform the user of success if needed
      // Refresh or navigate as needed
      props.setOpenDeleteNovelModal(false);
      router.refresh();
      window.location.reload();
    } catch (err) {
      console.error("Error during novel deletion process:", err);
      // Handle error (deletion failure), possibly set an error state to inform the user
    }
  };

  const handleNovelDeleteCancel = (e: React.FormEvent) => {
    e.preventDefault();
    props.setOpenDeleteNovelModal(false);
  };

  return (
    <DataModal
      modalOpen={props.openDeleteNovelModal}
      setModalOpen={props.setOpenDeleteNovelModal}
    >
      <form
        onSubmit={handleNovelDeleteSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Warning this action is irreversible. Are you sure you want to delete
          this novel and all its contents?
        </label>

        <button
          type="submit"
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Delete Novel
        </button>
        <button
          type="button"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleNovelDeleteCancel}
        >
          Cancel
        </button>
      </form>
    </DataModal>
  );
};

export default DeleteNovel;
