import Artists from "./artist";

interface ArtistData {
  ArtistId: string;
}

interface ArtistDataProps {
  artists: ArtistData;
}

const ShowArtist = ({ artists }: ArtistDataProps) => {
  return (
    <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
      <Artists key={artists.ArtistId} artistDb={artists} />
    </div>
  );
};

export default ShowArtist;
