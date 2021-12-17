import useSpotify from "../hooks/useSpotify";
import {useCallback, useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import {currentTrackIdState, isPlayingState, devicesState} from "../atoms/songAtom";
import {useSession} from "next-auth/react";
import useSongInfo from "../hooks/useSongInfo";
import {PauseIcon, SwitchHorizontalIcon} from "@heroicons/react/outline";
import {FastForwardIcon, PlayIcon, ReplyIcon, RewindIcon, VolumeUpIcon} from "@heroicons/react/solid";
import {VolumeUpIcon as VolumeUpIconOutline} from "@heroicons/react/outline";
import {debounce} from "lodash";

export default function Player() {
    const spotifyApi = useSpotify()
    const {data: session, status} = useSession()
    const [currentTrackId, setCurrentIdTrack] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
    const [devices, setDevicesState] = useRecoilState(devicesState)
    const [volume, setVolume] = useState(50)

    const songInfo = useSongInfo()

    const fetchCurrentSong = () => {
        if(!songInfo){
            spotifyApi.getMyCurrentPlayingTrack().then((data) => {
                if (data.body?.item?.id) {
                    console.log('Now playing:', data.body?.item)
                    setCurrentIdTrack(data.body?.item?.id)
                    setIsPlaying(data.body?.is_playing)
                }
            })
        }
    }

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if(data.body.is_playing){
                spotifyApi.pause()
                setIsPlaying(false)
            } else {
                spotifyApi.play()
                setIsPlaying(true)
            }
        })
    }

    useEffect(() => {
        spotifyApi.getMyDevices().then((data) => {
            const devices = data.body.devices
            setDevicesState(devices)
            if(volume > 0 && volume < 100 && currentTrackId && devices.length && devices.some((device) => device.is_active === true)){
                debouncedAdjustVolume(volume)
            }
        })
    }, [volume])

    const debouncedAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch((err) => {})
        }, 500),[])

    useEffect(() => {
        if(spotifyApi.getAccessToken() && !currentTrackId){
            fetchCurrentSong()
            setVolume(50)
        }
    }, [currentTrackId,spotifyApi, session])

    return (
        <div>
            {currentTrackId ? (
                <div className='h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base
        px-2 md:px-8'>
                    <div className='flex items-center space-x-4'>
                        <img className='hidden md:inline h-10 w-10' src={songInfo?.album?.images?.[0]?.url} alt=""/>
                        <div>
                            <h3>{songInfo?.name}</h3>
                            <p>{songInfo?.artists?.[0]?.name}</p>
                        </div>
                    </div>

                    <div className='flex items-center justify-evenly'>
                        <SwitchHorizontalIcon className='button'/>
                        <RewindIcon className='button'/>
                        {isPlaying ? (
                            <PauseIcon onClick={handlePlayPause} className='button'/>
                        ) : (
                            <PlayIcon onClick={handlePlayPause} className='button'/>
                        )}
                        <FastForwardIcon className='button'/>
                        <ReplyIcon className='button'/>
                    </div>

                    <div className='flex items-center space-x-3 md:space-x-4 justify-end pr-5'>
                        <VolumeUpIconOutline onClick={() => volume > 0 && setVolume(volume-10)} className='button'/>
                        <input className='w-14 md:w-28' type="range" onChange={(e) => setVolume(Number(e.target.value))} value={volume} min={0} max={100}/>
                        <VolumeUpIcon onClick={() => volume < 100 && setVolume(volume+ 10)} className='button'/>
                    </div>
                </div>
            ) : (
              ''
            )}
        </div>




    )
}