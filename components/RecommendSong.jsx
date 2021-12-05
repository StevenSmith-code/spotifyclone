import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../lib/time";

function RecommendSong({ track }) {
  const spotifyApi = useSpotify();
  const [currnetTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = () => {
    setCurrentTrackId(track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [track.uri],
    });
  };

  return (
    <div
      onClick={playSong}
      className='flex flex-col items-center hover:bg-gray-900 transition duration-100 ease-out cursor-pointer py-5 rounded-xl'>
      <div>
        <img
          className='w-36 h-36 rounded-lg'
          src={track.album?.images?.[0]?.url}
          alt=''
        />
      </div>
      <h1 className='mt-2 w-30 text-xl text-center'>{track.name}</h1>
      <div className='flex flex-col justify-center text-center items-center space-y-1 whitespace-nowrap'>
        <p className='text-center'>{track.album?.artists[0].name}</p>
        <p>{millisToMinutesAndSeconds(track.duration_ms)}</p>
      </div>
    </div>
  );
}
{
}
export default RecommendSong;
