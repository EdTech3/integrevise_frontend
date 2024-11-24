import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '@/lib/services/api';
import { queryKeys } from '@/lib/config/queryKeys';
import { Document } from '@/types/api';
import { toast } from 'react-toastify';
import { errorToast, successToast } from '@/lib/toast';

export function useDocuments(vivaSessionId: string) {
  return useQuery({
    queryKey: queryKeys.documents.list(vivaSessionId),
    queryFn: () => documentsApi.getAll(vivaSessionId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProcessDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: documentsApi.process,
    onMutate: async (documentId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.documents.all });

      // Snapshot the previous value
      const previousDocuments = queryClient.getQueryData<Document[]>(queryKeys.documents.all);

      // Optimistically update the document status
      queryClient.setQueryData<Document[]>(queryKeys.documents.all, (old) => 
        old?.map(doc => 
          doc.id === documentId 
            ? { ...doc, status: 'PROCESSING' }
            : doc
        )
      );

      return { previousDocuments };
    },
    onError: (err, documentId, context) => {
      // Rollback on error
      if (context?.previousDocuments) {
        queryClient.setQueryData(queryKeys.documents.all, context.previousDocuments);
      }
      toast.error('Failed to process document');
    },
    onSuccess: () => {
      toast.success('Document processed successfully');
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all });
    },
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: documentsApi.upload,
    onError: () => {
      errorToast('Failed to upload document');
    },
    onSuccess: () => {
      successToast('Document uploaded successfully');
      // Refetch the documents list
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all });
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: documentsApi.update,
    onError: () => {
      errorToast('Failed to update document');
    },
    onSuccess: () => {
      successToast('Document updated successfully');
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: documentsApi.delete,
    onError: () => {
      errorToast('Failed to delete document');
    },
    onSuccess: () => {
      successToast('Document deleted successfully');
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all });
    },
  });
}




