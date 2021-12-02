import { ChevronDownIcon } from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { shuffle } from "lodash";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

function Center() {
  const { data: session } = useSession();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const spotifyApi = useSpotify();

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getPlaylist(playlistId)
        .then((data) => {
          setPlaylist(data.body);
        })
        .catch((e) => console.error(e));
    }
  }, [spotifyApi, playlistId]);
  return (
    <div className='flex-grow text-white h-screen overflow-y-scroll scrollbar-hide'>
      <header className='absolute top-5 right-8'>
        <div
          className='flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 '
          onClick={() => signOut()}>
          <img
            className='rounded-full w-10 h-10'
            src={session?.user.image}
            alt=''
          />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className='w-5 h-5' />
        </div>
      </header>

      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
        {playlist ? (
          <div className='flex items-center space-x-5 relative'>
            <img
              className='h-44 w-44 shadow-2xl'
              src={playlist?.images?.[0]?.url}
              alt=''
            />
            <div>
              <p className='mb-2'>PLAYLIST</p>
              <h1 className='text-2xl md:text-3xl xl:text-5xl font-bold'>
                {playlist?.name}
              </h1>
            </div>
          </div>
        ) : (
          <h1 className='text-2xl md:text-3xl xl:text-5xl font-bold left-80 absolute top-40 font-mono'>
            Spotify home page
          </h1>
        )}
      </section>

      <div>
        <Songs />
      </div>
    </div>
  );
}

export default Center;
