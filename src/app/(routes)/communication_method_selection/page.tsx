"use client"
import Logo from '@/components/shared/Logo';
import { useRouter } from 'next/navigation';
import { FaKeyboard } from "react-icons/fa";
import { GiSoundWaves } from "react-icons/gi";
import { CommunicationMethodTypes } from '../../../type';
import CommunicationMethod from './components/CommunicationMethod';
import Container from '@/components/shared/Container';
import { useVivaConfig } from '@/lib/store/vivaConfig';


const CommunicationMethodSelection = () => {
  const router = useRouter()
  const { setCommunicationMethod } = useVivaConfig()

  function handleMethodSelected(method: CommunicationMethodTypes) {
    setCommunicationMethod(method)
    router.push(`/audio_test`)
  }

  return (
    <Container>
      <main className='flex flex-col items-center mt-20'>
        <Logo width={200} height={200} className='mb-4' />

        <h4 className='text-center lg:w-[35ch] text-2xl lg:text-3xl mb-20 font-medium'>
          Hello Kyle! How would you like take this test?
        </h4>

        <div className='flex flex-col items-start lg:items-start space-y-8 lg:space-y-0 lg:flex-row justify-between w-full max-w-lg'>
          <CommunicationMethod handleClick={handleMethodSelected} value='voice' icon={<GiSoundWaves className='text-3xl lg:text-4xl' />} text="Voice" />
          <CommunicationMethod handleClick={handleMethodSelected} value='keyboard' icon={<FaKeyboard className='text-3xl lg:text-4xl' />} text="Keyboard" />
        </div>
      </main>
    </Container>
  )
}

export default CommunicationMethodSelection