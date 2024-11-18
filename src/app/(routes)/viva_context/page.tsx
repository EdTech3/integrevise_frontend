'use client'
import Container from '@/components/shared/Container';
import { Button } from '@/components/ui/button';
import { useDocuments, useDeleteDocument } from '@/hooks/api/useDocuments';
import { documentsApi } from '@/lib/services/api';
import { errorToast } from '@/lib/toast';
import { useState } from 'react';
import { FaArrowRight, FaPlus } from 'react-icons/fa';
import DocumentCard from './components/DocumentCard';
import NewDocumentForm, { EditDocument } from './components/NewDocumentForm';
import { useVivaSession } from '@/lib/store';
import { Loader2 } from 'lucide-react';
import DocumentCardSkeleton from './components/DocumentCardSkeleton';
import { useRouter } from 'next/navigation';
import Link from 'next/link';



const VivaContext = () => {
  const { sessionId: vivaSessionId } = useVivaSession();
  const [documentToEdit, setDocumentToEdit] = useState<EditDocument | null>(null);

  const {
    data: documents,
    isLoading,
    error
  } = useDocuments(vivaSessionId || "");

  const { mutate: deleteDocument } = useDeleteDocument();

  const handleEdit = async (document: EditDocument) => {
    setDocumentToEdit(document);

    try {
      const file = await documentsApi.getDocumentFile(document.id);

      if (file) {
        setDocumentToEdit({
          ...document,
          file: {
            networkStatus: "success",
            content: file
          }
        })
      } else {
        setDocumentToEdit({
          ...document,
          file: {
            networkStatus: "error",
            content: null
          }
        })

      }
    } catch (error) {
      if (error instanceof Error) {
        errorToast(error.message);
      } else {
        errorToast("Failed to get existing document");
      }
    }
  };

  const handleDelete = (documentId: string) => {
    deleteDocument(documentId);
  };

  if (error) return <h1>Error: {error.message}</h1>;
  if (!vivaSessionId) return <h1>No session ID found</h1>;

  return (
    <Container>
      <main className='py-2 min-h-screen flex flex-col space-y-4'>
        <section className='flex items-center justify-between'>
          <div className='flex items-center justify-between space-x-2'>
            <h1 className='text-3xl font-semibold'>Viva Context</h1>
            <NewDocumentForm vivaSessionId={vivaSessionId}>
              <Button
                variant={"outline"}
                className='rounded-full'
                size={"icon"}
              >
                <FaPlus />
              </Button>
            </NewDocumentForm>
          </div>
          <Button asChild>
            <Link href="/viva">Continue to Assessment <FaArrowRight /></Link>
          </Button>
        </section>
        <section className='grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4'>
          {isLoading &&
            [...Array(5)].map((_, index) => (
              <DocumentCardSkeleton key={index} />
            ))
          }
          {!isLoading && documents?.map((doc) => {
            return (
              <DocumentCard
                key={doc.id}
                title={doc.title}
                description={doc.description || ""}
                category={doc.category}
                updatedAt={new Date(doc.updatedAt)}
                onEdit={() => handleEdit(
                  {
                    id: doc.id,
                    title: doc.title,
                    description: doc.description || "",
                    category: doc.category,
                    fileName: doc.fileName || "",
                    filePath: doc.filePath || "",
                    file: {
                      networkStatus: "loading",
                      content: null
                    }
                  })}
                onDelete={() => handleDelete(doc.id)}
              />
            )
          })}
        </section>

        {/* Edit Form Dialog */}
        {documentToEdit && (
          <NewDocumentForm
            vivaSessionId={vivaSessionId}
            mode="edit"
            existingDocument={documentToEdit}
            onClose={() => setDocumentToEdit(null)}
          >
            <div style={{ display: 'none' }} />
          </NewDocumentForm>
        )}
      </main>
    </Container>
  );
};

export default VivaContext;