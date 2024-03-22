import Novels from "./novels";
import React, { useState, useEffect } from "react";

interface ChapterData {
  chapterId: string;
  chapterNumber: number;
  title: string;
  content: string;
  // Additional chapter details
}

interface VolumeData {
  volumeId: string;
  volumeNumber: number;
  title: string;
  chapters: ChapterData[];
  // Additional volume details
}

interface NovelsData {
  novelId: string;
  artistId: string;
  title: string;
  thumbnailUrl: string;
  synopsis: string;
  genre: string[];
  pinyaApproved: boolean;
  volumes?: VolumeData[];
}

interface ListNovelsProps {
  novels: NovelsData[];
  artistId: string;
}

const ListNovels = ({ novels, artistId }: ListNovelsProps) => {
  const [selectedNovelId, setSelectedNovelId] = useState<string | null>(null);
  const [selectedNovelDetails, setSelectedNovelDetails] =
    useState<NovelsData | null>(null);

  // Filter novels by the given artistId
  const filteredNovels = novels.filter((novel) => novel.artistId === artistId);

  const fetchNovelDetails = async (novelId: string) => {
    try {
      const response = await fetch(`/api/novel/${novelId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch novel details");
      }

      const data = await response.json();
      setSelectedNovelDetails(data);
    } catch (error) {
      console.error("Error fetching novel details:", error);
      setSelectedNovelDetails(null);
    }
  };

  useEffect(() => {
    if (selectedNovelId) {
      fetchNovelDetails(selectedNovelId);
    }
  }, [selectedNovelId]);

  const handleNovelSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNovelId(event.target.value);
  };

  return (
    <div>
      <select onChange={handleNovelSelect} value={selectedNovelId || ""}>
        <option value="">Select a novel</option>
        {filteredNovels.map((novel) => (
          <option key={novel.novelId} value={novel.novelId}>
            {novel.title}
          </option>
        ))}
      </select>

      {selectedNovelDetails ? (
        <>
          <Novels novel={selectedNovelDetails} />
        </>
      ) : (
        <p>
          Select a novel to see its details, including volumes and chapters.
        </p>
      )}
    </div>
  );
};

export default ListNovels;
