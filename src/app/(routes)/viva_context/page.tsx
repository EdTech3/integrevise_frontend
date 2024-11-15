'use client'

import { useDocuments } from '@/hooks/api/useDocuments';
import DocumentCard from './components/DocumentCard';
import NewDocumentForm from './components/NewDocumentForm';
import { Button } from '@/components/ui/button';
import { FaPlus } from 'react-icons/fa';
import Container from '@/components/shared/Container';
import { useEffect } from 'react';


const VivaContext = () => {
  const vivaSessionId = "cm3gt1ps0000dkdmjtzf7hvqe"; // Get this from your auth context or route params

  const {
    data: documents,
    isLoading,
    error
  } = useDocuments(vivaSessionId);


  useEffect(() => {
    console.log("Documents", documents)
  }, [documents])


  if (isLoading) {
    return <h1>Loading...</h1>
  }

  if (error) {
    return <h1>Error: {error.message}</h1>
  }

  return (
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
          {documents?.map((doc) => (
            <DocumentCard
              key={doc.title}
              title={doc.title}
              description={"Hello world"}
              category={doc.category}
              updatedAt={new Date(doc.updatedAt)}
              onEdit={() => { }}
              onDelete={() => { }}
            />
          ))}
        </section>
      </main>
    </Container>
  );
};

export default VivaContext;