import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className="bg-blue-900 w-screen h-screen flex items-center">
      <div className='text-center w-full'>
        <button className="bg-white p-2 rounded-md px-4">Login with google</button>
      </div>
    </div>
  );
}
