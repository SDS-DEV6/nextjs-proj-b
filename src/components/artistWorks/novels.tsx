"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import DataModal from "../dataModal";
import { useRouter } from "next/navigation";
import axios from "axios";
import { type PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { useRef } from "react";
import AddVolume from "../volume/addVolume";
import EditNovel from "../novel/editNovel";
import DeleteNovel from "../novel/deleteNovel";
import AddChapter from "../chapter/addChapter";
import EditVolume from "../volume/editVolume";
import DeleteVolume from "../volume/deleteVolume";
import EditChapter from "../chapter/editChapter";
import DeleteChapter from "../chapter/deleteChapter";

interface NovelProps {
  novel: {
    novelId: string;
    title: string;
    thumbnailUrl: string;
    synopsis: string;
    genre: string[];
    pinyaApproved: boolean;
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
}

const Novels = ({ novel }: NovelProps) => {
  const router = useRouter();

  const countChaptersForVolume = (volumes: NovelProps["novel"]["volumes"]) => {
    return (
      volumes?.map((volume) => ({
        ...volume,
        totalChapters: volume.chapters.length,
      })) || []
    );
  };

  const volumesWithChaptersCount = countChaptersForVolume(novel.volumes);

  //add volumes
  const [openAddVolumeModal, setOpenAddVolumeModal] = useState(false);
  //edit current novel
  const [openEditNovelModal, setOpenEditNovelModal] = useState(false);
  //delete current novel
  const [openDeleteNovelModal, setOpenDeleteNovelModal] = useState(false);

  //create chapter to volume
  const [openAddChapterModal, setOpenAddChapterModal] = useState(false);
  //edit volume
  const [openEditVolumeModal, setOpenEditVolumeModal] = useState(false);
  //delete volume
  const [openDeleteVolumeModal, setOpenDeleteVolumeModal] = useState(false);

  //edit chapter
  const [openEditChapterModal, setOpenEditChapterModal] = useState(false);
  //delete chapter
  const [openDeleteChapterModal, setOpenDeleteChapterModal] = useState(false);

  return (
    <div>
      {/* PRIMARY */}

      <div className="p-3 my-5 bg-slate-200" id={novel.novelId}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-bold">{novel.title}</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setOpenAddVolumeModal(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add New Volume
            </button>
            <AddVolume
              openAddVolumeModal={openAddVolumeModal}
              setOpenAddVolumeModal={setOpenAddVolumeModal}
              novel={novel}
              router={router}
            />

            <button
              onClick={() => setOpenEditNovelModal(true)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Edit Novel
            </button>
            <EditNovel
              openEditNovelModal={openEditNovelModal}
              setOpenEditNovelModal={setOpenEditNovelModal}
              novel={novel}
              router={router}
            />

            <button
              onClick={() => setOpenDeleteNovelModal(true)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Delete Novel
            </button>
            <DeleteNovel
              openDeleteNovelModal={openDeleteNovelModal}
              setOpenDeleteNovelModal={setOpenDeleteNovelModal}
              novel={novel}
              router={router}
            />
          </div>
        </div>

        <p className="text-lg font-bold">
          Status:{" "}
          {novel.pinyaApproved
            ? "Approved"
            : "This novel has not been approved"}
        </p>
        <div className="flex items-center">
          <div className="novel-image">
            <Image
              src={novel.thumbnailUrl}
              width={140}
              height={198}
              alt="Novel Cover Photo"
            />
          </div>
          <div className="novel-details">
            {volumesWithChaptersCount &&
              volumesWithChaptersCount.length > 0 && (
                <div>
                  {volumesWithChaptersCount.map((volume) => (
                    <div key={volume.volumeId} className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h1 className="text-xl font-bold">
                          Volume: {volume.volumeNumber} {volume.title} -{" "}
                          {volume.totalChapters} Chapters &nbsp;
                        </h1>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setOpenAddChapterModal(true)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          >
                            Add New Chapter
                          </button>
                          <AddChapter
                            openAddChapterModal={openAddChapterModal}
                            setOpenAddChapterModal={setOpenAddChapterModal}
                            novel={novel}
                            router={router}
                            currentVolumeId={volume.volumeId}
                          />

                          <button
                            onClick={() => setOpenEditVolumeModal(true)}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          >
                            Edit Volume
                          </button>
                          <EditVolume
                            openEditVolumeModal={openEditVolumeModal}
                            setOpenEditVolumeModal={setOpenEditVolumeModal}
                            volume={volume}
                            router={router}
                          />

                          <button
                            onClick={() => setOpenDeleteVolumeModal(true)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          >
                            Delete Volume
                          </button>
                          <DeleteVolume
                            openDeleteVolumeModal={openDeleteVolumeModal}
                            setOpenDeleteVolumeModal={setOpenDeleteVolumeModal}
                            volume={volume}
                            router={router}
                          />
                        </div>
                      </div>

                      {volume.chapters && volume.chapters.length > 0 && (
                        <ul>
                          {volume.chapters.map((chapter) => (
                            <li
                              key={chapter.chapterId}
                              className="flex justify-start items-center space-x-4"
                            >
                              Chapter {chapter.chapterNumber}: {chapter.title}{" "}
                              &nbsp;
                              <button
                                onClick={() => setOpenEditChapterModal(true)}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                              >
                                Edit Chapter
                              </button>
                              <EditChapter
                                openEditChapterModal={openEditChapterModal}
                                setOpenEditChapterModal={
                                  setOpenEditChapterModal
                                }
                                chapter={chapter}
                                router={router}
                              />
                              <button
                                onClick={() => setOpenDeleteChapterModal(true)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                              >
                                Delete Chapter
                              </button>
                              <DeleteChapter
                                openDeleteChapterModal={openDeleteChapterModal}
                                setOpenDeleteChapterModal={
                                  setOpenDeleteChapterModal
                                }
                                chapter={chapter}
                                router={router}
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>

      {/* SECONDARY - USER ACTIONS TO CURRRENT NOVEL 
                       ADD VOLUME []
      */}

      {/* SECONDARY - USER ACTIONS TO CURRRENT NOVEL 
                       EDIT CURRENT NOVEL
      */}
    </div>
  );
};

export default Novels;
