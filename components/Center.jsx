import { ChevronDownIcon } from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { forEach, shuffle } from "lodash";
import {
  featuredlistIdState,
  featuredlistState,
  playlistIdState,
  playlistState,
} from "../atoms/playlistAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";
import Song from "./Song";
import ActivateDevice from "./ActivateDevice";
import RecommendedSongs from "./RecommendedSongs";

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
  const [featuredList, setFeaturedList] = useRecoilState(featuredlistState);
  const featuredListId = useRecoilValue(featuredlistIdState);
  const spotifyApi = useSpotify();
  const [isactive, setIsActive] = useState(false);
  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getMyDevices().then(
        function (data) {
          data.body.devices.filter((device) => {
            if (device.is_active) {
              setIsActive(true);
            }
          });
        },
        function (err) {
          console.log("Something went wrong!", err);
        }
      );
    }
  }, [spotifyApi, playlistId]);

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
    <div
      className={`flex-grow text-white h-screen overflow-y-scroll scrollbar-hide bg-spotify-gray `}>
      <header className='absolute top-5 right-8'>
        <div
          className='flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 hover:bg-red-900 transition duration-100 ease-in '
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
        className={`flex items-end space-x-7 bg-gradient-to-b bg-spotify-gray ${color} h-80 text-white p-8`}>
        {isactive && playlist ? (
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
          <div>
            <h1 className='text-2xl md:text-3xl xl:text-5xl font-bold pb-16 ml-10'>
              Recommended Playlists
            </h1>
          </div>
        )}
      </section>

      <div>
        {!playlist ? <RecommendedSongs /> : ""}
        {isactive ? (
          <Songs />
        ) : (
          <div>
            <ActivateDevice />
            <RecommendedSongs />
          </div>
        )}
      </div>
    </div>
  );
}

export default Center;
