import {
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  VolumeOffIcon,
  VolumeUpIcon,
} from "@heroicons/react/outline";
import {
  RewindIcon,
  SwitchHorizontalIcon,
  FastForwardIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [currnetTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currnetTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackIdState, spotifyApi, session]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {});
    }, 400),
    []
  );

  return (
    <div className='text-white h-24 bg-spotify-player grid grid-cols-3 text-xs md:text-base px-2 md:px-8 border-t-[1px] border-gray-700'>
      {/* left side */}
      <div className='flex items-center space-x-4'>
        <img
          className='hidden md:inline h-10 w-10'
          src={songInfo?.album.images?.[0]?.url}
          alt=''
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      <div className='flex items-center justify-evenly'>
        <SwitchHorizontalIcon className='button' />
        <RewindIcon
          //   onClick={() => spotifyApi.skipToPrevious()} spotifyApi is currently broken
          className='button'
        />
        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className=' button w-10 h-10' />
        ) : (
          <PlayIcon className=' button w-10 h-10' onClick={handlePlayPause} />
        )}
        <FastForwardIcon className='button' />

        <ReplyIcon className='button' />
      </div>
      <div className='flex items-center space-x-3 md:space-x-4 justify-end pr-5'>
        <VolumeOffIcon
          onClick={() => volume > 0 && setVolume(1)}
          className='button'
        />
        <input
          className='w-14 md:w-28'
          type='range'
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
          id=''
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className='button'
        />
      </div>
    </div>
  );
}

export default Player;
