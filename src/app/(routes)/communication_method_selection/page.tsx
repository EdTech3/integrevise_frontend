"use client"
import { useCommunicationMethodStore } from '@/app/store';
import Logo from '@/components/shared/Logo';
import { FaKeyboard } from "react-icons/fa";
import { GiSoundWaves } from "react-icons/gi";
import { CommunicationMethodTypes } from '../../../type';
import CommunicationMethod from './components/CommunicationMethod';
import { useRouter } from 'next/navigation';


const CommunicationMethodSelection = () => {
  const updateCommunicationMethod = useCommunicationMethodStore((state) => state.updateCommunicationMethod)
  const router = useRouter()

  function handleMethodSelected(option: CommunicationMethodTypes) {
    updateCommunicationMethod(option)
    router.push("/facial_recognition")

  }

  return (
    <main className='flex flex-col items-center mt-20'>
      <Logo width={200} height={200} className='mb-4' />

      <h4 className='text-center lg:w-[35ch] text-2xl lg:text-3xl mb-20 font-medium'>
        Hello Chloe! How would you like take this test?
      </h4>

      <div className='flex flex-col items-center lg:items-start space-y-8 lg:space-y-0 lg:flex-row justify-between w-full max-w-lg'>
        <CommunicationMethod handleClick={handleMethodSelected} value='voice' icon={<GiSoundWaves className='text-4xl lg:text-5xl' />} text="Voice" />
        <CommunicationMethod handleClick={handleMethodSelected} value='keyboard' icon={<FaKeyboard className='text-3xl lg:text-4xl' />} text="Keyboard" />
      </div>
    </main>
  )
}

export default CommunicationMethodSelection