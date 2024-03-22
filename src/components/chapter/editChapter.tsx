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
  openEditChapterModal: boolean;
  setOpenEditChapterModal: Dispatch<SetStateAction<boolean>>;
  chapter: {
    chapterId: string;
    title: string;
    content: string;
  };

  router: any;
}

const EditChapter = (props: PropsWithChildren<EditVolumeProps>) => {
  const router = useRouter();
  const [chapterDetailsModal, setChapterDetailsModal] = useState(props.chapter);

  const handleVolumeEditSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    await axios
      .patch(`/api/chapter/${props.chapter.chapterId}`, chapterDetailsModal, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res);
        props.setOpenEditChapterModal(false);
        router.refresh();
        window.location.reload();
      })
      .catch((err) => {
        console.error("Failed to update chapter details:", err);
        console.error(err.response?.data);
      });
  };

  const handleVolumeDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setChapterDetailsModal((prevState: typeof chapterDetailsModal) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleNovelEditCancel = (e: React.FormEvent) => {
    e.preventDefault();
    props.setOpenEditChapterModal(false);
  };

  return (
    <DataModal
      modalOpen={props.openEditChapterModal}
      setModalOpen={props.setOpenEditChapterModal}
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
          value={chapterDetailsModal.title || ""}
          onChange={handleVolumeDetailChange}
          required
        />

        <label className="block text-gray-700 text-sm font-bold mb-2">
          Content:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          name="content"
          value={chapterDetailsModal.content || ""}
          onChange={handleVolumeDetailChange}
          required
        />

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Update Chapter
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

export default EditChapter;
