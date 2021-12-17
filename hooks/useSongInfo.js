import useSpotify from "../hooks/useSpotify";
import {useRecoilState} from "recoil";
import {currentTrackIdState, isPlayingState} from "../atoms/songAtom";
import {useEffect, useState} from "react";

export default function useSongInfo() {
    const spotifyApi = useSpotify()
    const [currentIdTrack, setCurrentIdTrack] = useRecoilState(currentTrackIdState)
    const [songInfo, setSongInfo] = useState(null)

   useEffect(()=> {
       const fetchSongInfo = async () => {
               const trackInfo = await fetch(`https://api.spotify.com/v1/tracks/${currentIdTrack}`,
                   {
                       headers:{
                           Authorization: `Bearer ${spotifyApi.getAccessToken()}`
                       }
                   }
               ).then(res => res.json())

               setSongInfo(trackInfo)
       }

        if(currentIdTrack){
            fetchSongInfo()
        }

   }, [currentIdTrack,spotifyApi])

    return songInfo
}