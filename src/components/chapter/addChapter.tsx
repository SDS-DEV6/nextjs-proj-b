// AddChapter.jsx
import React, {
  useState,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DataModal from "../dataModal";

interface AddChapterProps {
  openAddChapterModal: boolean;
  setOpenAddChapterModal: Dispatch<SetStateAction<boolean>>;
  currentVolumeId: string;
  novel: {
    novelId: string;
    volumes?: Array<{
      volumeId: string;
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

const AddChapter = (props: PropsWithChildren<AddChapterProps>) => {
  const router = useRouter();

  // Removed the duplicated state for modal visibility.
  const [chapterInputs, setChapterInputs] = useState<{
    title?: string;
    content?: string;
  }>({});

  const handleChapterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setChapterInputs((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddChapterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const postData = {
      ...chapterInputs,
      volumeId: props.currentVolumeId,
    };

    axios
      .post("/api/chapter", postData)
      .then((res) => {
        console.log(res);
        props.setOpenAddChapterModal(false);
        router.refresh();
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setChapterInputs({});
      });
  };

  const handleChapterCancel = () => {
    props.setOpenAddChapterModal(false);
    setChapterInputs({});
    router.refresh();
  };

  return (
    <DataModal
      modalOpen={props.openAddChapterModal}
      setModalOpen={props.setOpenAddChapterModal}
    >
      <form
        onSubmit={handleAddChapterSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Title:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          name="title"
          value={chapterInputs.title || ""}
          onChange={handleChapterInputChange}
          required
        />

        <label className="block text-gray-700 text-sm font-bold mb-2">
          Content:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          name="content"
          value={chapterInputs.content || ""}
          onChange={handleChapterInputChange}
          required
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add New Chapter
        </button>
        <button
          type="button"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleChapterCancel}
        >
          Cancel
        </button>
      </form>
    </DataModal>
  );
};

export default AddChapter;
