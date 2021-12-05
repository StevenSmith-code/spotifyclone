import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { recommendIdState, recommendState } from "../atoms/recommendedAtom";
import useSpotify from "../hooks/useSpotify";
import RecommendSong from "./RecommendSong";

function RecommendedSongs() {
  const spotifyApi = useSpotify();
  const [recommendId, setRecommendId] = useRecoilState(recommendIdState);
  const [recommend, setRecommend] = useRecoilState(recommendState);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      // Get Recommendations Based on Seeds
      spotifyApi
        .getRecommendations({
          min_energy: 0.4,
          seed_artists: ["0xpJGyjbEzkWSNfcf2tcMl", "2IQvTnOS1sicZ3plBZL6KR"],
          min_popularity: 50,
        })
        .then(
          function (data) {
            let recommendations = data.body;
            setTracks(recommendations.tracks);
          },
          function (err) {
            console.log("Something went wrong!", err);
          }
        );
    }
  }, [spotifyApi]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getMyTopTracks().then(
        function (data) {
          let topTracks = data.body;
          console.log(topTracks);
        },
        function (err) {
          console.log("Something went wrong!", err);
        }
      );
    }
  }, [spotifyApi]);
  console.log(tracks);
  return (
    <div className='grid grid-cols-1 gap-2 md:grid-cols-2 mb-36 lg:grid-cols-3 xl:grid-cols-4 -mt-20'>
      {tracks.map((track) => (
        <RecommendSong track={track} />
      ))}
    </div>
  );
}

export default RecommendedSongs;
