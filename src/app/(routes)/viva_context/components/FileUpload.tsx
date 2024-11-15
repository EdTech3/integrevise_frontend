import { resolveBlobMimeType } from "@/lib/utils/resolveMimeType"
import { useDropzone } from "react-dropzone"
import { BsFileEarmarkPdfFill } from "react-icons/bs"
import { SiMicrosoftword } from "react-icons/si"

const FileUpload = ({ setFieldValue, onDrop }: {
    setFieldValue: (field: string, value: any) => void,
    onDrop: (acceptedFiles: File[], setFieldValue: (field: string, value: any) => void) => void
}) => {
    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
        onDrop: (acceptedFiles) => onDrop(acceptedFiles, setFieldValue),
        multiple: false
    })

    const IconMap: Record<string, JSX.Element> = {
        pdf: <BsFileEarmarkPdfFill />,
        doc: <SiMicrosoftword />,
        docx: <SiMicrosoftword />
    }

    return (
        <div className="space-y-2">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 cursor-pointer text-center transition-colors
                    ${isDragActive ? 'border-primary bg-primary/5' : 'border-input'}
                `}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-sm text-muted-foreground">Drop the file here...</p>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        {acceptedFiles[0] ?
                            <span>Replace the file by drag & drop or click here </span> :
                            <span>
                                Drag & drop a file here, or click to select a file
                            </span>}

                    </p>
                )}
            </div>
            {acceptedFiles[0] && (
                <div className="inline-flex items-center gap-2 text-foreground rounded-lg bg-secondary-100 border border-foreground p-3">
                    <span className="text-xl">
                        {IconMap[resolveBlobMimeType(acceptedFiles[0])]}
                    </span>
                    <p className="text-sm text-muted-foreground">
                        {acceptedFiles[0].name}
                    </p>
                </div>

            )}
        </div>
    )
}

export default FileUpload