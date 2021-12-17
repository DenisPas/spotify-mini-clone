import logoSpotify from "../public/logoSpotify.png";
import {signOut, useSession} from "next-auth/react";
import {ChevronDownIcon, ChevronUpIcon, PauseIcon} from "@heroicons/react/outline";
import {useEffect, useState} from "react";
import { shuffle } from "lodash";
import {useRecoilState, useRecoilValue} from "recoil";
import { playlistIdState, playlistState} from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";
import {PlayIcon} from "@heroicons/react/solid";

const colors = [
    'from-indigo-500',
    'from-blue-500',
    'from-green-500',
    'from-red-500',
    'from-yellow-500',
    'from-pink-500',
    'from-purple-500',
]

export default function Center(state, options) {
    const {data: session} = useSession()
    const spotifyApi =useSpotify()
    const [color, setColor] = useState(null)
    const playlistId = useRecoilValue(playlistIdState)
    const [playlist, setPlaylist] = useRecoilState(playlistState)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setColor(shuffle(colors).pop())
    },[playlistId])

    useEffect(() => {
        if(playlistId) {
            spotifyApi.getPlaylist(playlistId)
                .then((data) => {
                    setPlaylist(data.body)
                })
                .catch((err) => {
                    console.log('Wrong', err)
                })
        }
    },[spotifyApi, playlistId])

    return (
        <div className='flex-grow' >
            <header className='absolute top-5 right-8'>
                <div onClick={() => setVisible(!visible)} className='flex items-center bg-black space-x-3 opacity-90
                                hover:opacity:80 cursor-pointer rounded-full bg-black p-1 pr-2 text-white'>

                        <img
                            className='h-10 w-10 rounded-full'
                            src={session?.user?.image || logoSpotify}
                            alt="spotifyLogo"
                        />
                    <h2>{session?.user.name}</h2>
                    {visible ?  <ChevronUpIcon className='h-5 w-5 '/> : <ChevronDownIcon className='h-5 w-5'/>}


                </div>
                {visible && (
                    <div onClick={signOut} className='bg-black w-50 mt-2 rounded-lg p-2 hover:bg-gray-900  cursor-pointer' >
                        <span className='text-white'>Sign Out</span>
                    </div>
                )}
            </header>

            <section className={`flex text-white p-8 h-80  items-end space-x-7 bg-gradient-to-b header
            to-black ${color}`}>
                {playlist?.name ? (
                    <div>
                        <img className='h-44 w-44 shadow-2xl' src={playlist?.images?.[0]?.url} alt=""/>
                        <div>
                            <p>PLAYLIST</p>
                            <h1 className='xl:text-5xl md:text-3xl text-2xl font-bold'>{playlist?.name}</h1>
                        </div>
                    </div>
                ) : (
                    <div>
                        Please choose playlist
                    </div>
                )}
            </section>

            <div>
                <Songs/>
            </div>
        </div>
    )
}