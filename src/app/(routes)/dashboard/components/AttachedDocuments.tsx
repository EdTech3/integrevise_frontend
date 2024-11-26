import React from 'react'
import UploadDocumentCard from '@/app/(routes)/viva_context/components/UploadDocumentCard'

const AttachedDocuments = () => {
    // Mock Files array
    const mockFiles = [
        new File([''], 'document1.pdf', { type: 'application/pdf' }),
        new File([''], 'report.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
        new File([''], 'presentation.pdf', { type: 'application/pdf' }),
    ];

    return (
        <div className='space-y-2'>
            <h4 className='text-lg font-semibold'>Attached Documents</h4>
            <div className='flex gap-2'>
                {mockFiles.map((file, index) => (
                    <UploadDocumentCard key={index} acceptedFile={file} />
                ))}
            </div>
        </div>
    )
}

export default AttachedDocuments