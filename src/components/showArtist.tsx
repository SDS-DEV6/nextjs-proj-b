import Artists from "./artist";

interface ArtistData {
  ArtistId: string;
}

interface ArtistDataProps {
  artists: ArtistData;
}

const ShowArtist = ({ artists }: ArtistDataProps) => {
  return (
    <>
      <Artists key={artists.ArtistId} artistDb={artists} />
    </>
  );
};

export default ShowArtist;
