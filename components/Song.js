import useSpotify from "../hooks/useSpotify";
import {millisToMinutesAndSeconds} from "../lib/time";
import {useRecoilState} from "recoil";
import {currentTrackIdState, devicesState, isPlayingState} from "../atoms/songAtom";

export default function Song(props) {
    const spotifyApi = useSpotify()
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
    const [devices, setDevicesState] = useRecoilState(devicesState)

    const playSong = () => {
        if (devices.some((device) => device.is_active === true)) {
            setCurrentTrackId(props.track.id)
            setIsPlaying(true)
            spotifyApi.play({
                uris: [props.track.uri]
            })
        }
    }

    return (
        <div>
            {devices.some((device) => device.is_active === true) ? (
                <div onClick={playSong} className='grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer'>
                    <div className='flex items-center space-x-4'>
                        <p>{props.order+1}</p>
                        <img className='h-10 w-10' src={props.track?.album?.images[0].url} alt=""/>
                        <div>
                            <p className='w-36 lg:w-64 text-white truncate'>{props.track?.name}</p>
                            <p className='w-40'>{props.track?.artists[0]?.name}</p>
                        </div>
                    </div>
                    <div className='flex items-center justify-between ml-auto md:ml-0'>
                        <p className='hidden md:inline w-40'>{props.track?.album?.name}</p>
                        <p>{millisToMinutesAndSeconds(props.track?.duration_ms)}</p>
                    </div>
                </div>
            ) : (
                <div className='grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg'>Please open Spotify in your device and click to play</div>
            )}
        </div>
    )
}