import { resolveBlobMimeType } from '@/lib/utils/documentFormatParsing'
import React from 'react'
import { BsFileEarmarkPdfFill } from 'react-icons/bs'
import { SiMicrosoftword } from 'react-icons/si'

interface Props {
    acceptedFile: File
}

const UploadDocumentCard = ({ acceptedFile }: Props) => {
    const IconMap: Record<string, JSX.Element> = {
        "PDF": <BsFileEarmarkPdfFill />,
        "WORD": <SiMicrosoftword />,
    }

    return (
        <div>
            {
                <div className="inline-flex items-center gap-2 text-foreground rounded-lg bg-secondary-100 border border-foreground p-3">
                    <span className="text-xl">
                        {IconMap[resolveBlobMimeType(acceptedFile)]}
                    </span>
                    <p className="text-sm text-muted-foreground">
                        {acceptedFile.name}
                    </p>
                </div>
            }
        </div>
    )
}

export default UploadDocumentCard