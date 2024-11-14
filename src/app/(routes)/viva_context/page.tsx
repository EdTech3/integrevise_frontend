'use client'

import Container from '@/components/shared/Container'
import Logo from '@/components/shared/Logo'
import { Button } from '@/components/ui/button'
import { TooltipProvider } from '@/components/ui/tooltip'
import { FaPlus } from 'react-icons/fa'
import NewDocumentForm from './components/NewDocumentForm'
import DocumentCard from './components/DocumentCard'

const VivaContext = () => {
  return (
    <TooltipProvider>
      <Container>
        <main className='py-2 min-h-screen flex flex-col space-y-4'>
          <section className='flex items-center justify-between'>
            <h1 className='text-3xl font-semibold'>Viva Context</h1>
            <NewDocumentForm>
              <Button size={"icon"}>
                <FaPlus />
              </Button>
            </NewDocumentForm>
          </section>

          <section className='grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4'>
            <DocumentCard
              title='Document 1'
              description='Description 1'
              category='ASSESSMENT_BRIEF'
              updatedAt={new Date()}
              onEdit={() => { }}
              onDelete={() => { }}
            />
            <DocumentCard
              title='Document 1'
              description='Description 1'
              category='ASSESSMENT_BRIEF'
              updatedAt={new Date()}
              onEdit={() => { }}
              onDelete={() => { }}
            />
            <DocumentCard
              title='Document 1'
              description='Description 1'
              category='ASSESSMENT_BRIEF'
              updatedAt={new Date()}
              onEdit={() => { }}
              onDelete={() => { }}
            />
            <DocumentCard
              title='Document 1'
              description='Description 1'
              category='ASSESSMENT_BRIEF'
              updatedAt={new Date()}
              onEdit={() => { }}
              onDelete={() => { }}
            />
            <DocumentCard
              title='Document 1'
              description='Description 1'
              category='ASSESSMENT_BRIEF'
              updatedAt={new Date()}
              onEdit={() => { }}
              onDelete={() => { }}
            />
            <DocumentCard
              title='Document 1'
              description='Description 1'
              category='ASSESSMENT_BRIEF'
              updatedAt={new Date()}
              onEdit={() => { }}
              onDelete={() => { }}
            />
            <DocumentCard
              title='Document 1'
              description='Description 1'
              category='ASSESSMENT_BRIEF'
              updatedAt={new Date()}
              onEdit={() => { }}
              onDelete={() => { }}
            />
            <DocumentCard
              title='Document 1'
              description='Description 1'
              category='ASSESSMENT_BRIEF'
              updatedAt={new Date()}
              onEdit={() => { }}
              onDelete={() => { }}
            />
          </section>
          <Logo className='mx-auto' />

        </main>
      </Container>
    </TooltipProvider>
  )
}

export default VivaContext