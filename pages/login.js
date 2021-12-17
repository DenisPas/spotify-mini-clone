import {getProviders, signIn} from "next-auth/react";
import Image from 'next/image'

import logoSpotify from '../public/logoSpotify.png';

export default function Login({providers}) {
    return (
        <div className='flex flex-col items-center bg-black min-h-screen w-full justify-center'>
            <div className='mb-5'>
                <Image
                    src={logoSpotify}
                    alt="spotifyLogo"
                    width={500}
                    height={500}
                />
            </div>
            {Object.values(providers).map((provider) => (
                <div key={provider.name}>
                    <button className='bg-[#18D860] text-white p-5 rounded-full'
                    onClick={() => signIn(provider.id, {callbackUrl: '/'})}
                    >Login with {provider.name}</button>
                </div>
            ))}
        </div>
    )
}

export async function getServerSideProps(context) {
    const providers = await getProviders()
    return {
        props: {
            providers
        }
    }
}