import { useDropzone } from "react-dropzone";
import UploadDocumentCard from "./UploadDocumentCard";
import { useEffect } from "react";

interface Props {
    setFieldValue: (field: string, value: any) => void,
    onDrop: (acceptedFiles: File[], setFieldValue: (field: string, value: any) => void) => void,
    existingDocumentFile?: {
        networkStatus: "idle" | "loading" | "success" | "error";
        content: File | null
    },
    isEditingDocument: boolean
}

const FileUpload = ({ setFieldValue, onDrop, existingDocumentFile, isEditingDocument }: Props) => {
    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
        onDrop: (acceptedFiles) => onDrop(acceptedFiles, setFieldValue),
        multiple: false
    })

    useEffect(() => {
        if (isEditingDocument && existingDocumentFile?.content) {
            setFieldValue('file', existingDocumentFile.content)
        }
    }, [isEditingDocument, existingDocumentFile?.content, setFieldValue])

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
                        {acceptedFiles[0] || existingDocumentFile?.content ?
                            <span>Replace the file by drag & drop or click here </span> :
                            <span>
                                Drag & drop a file here, or click to select a file
                            </span>}

                    </p>
                )}
            </div>
            {acceptedFiles[0] && <UploadDocumentCard acceptedFile={acceptedFiles[0]} />}

            {!acceptedFiles[0] && isEditingDocument && existingDocumentFile?.content && existingDocumentFile.networkStatus === "success"
                && <UploadDocumentCard acceptedFile={existingDocumentFile.content} />}

            {!acceptedFiles[0] && isEditingDocument && existingDocumentFile?.networkStatus === "error"
                && <p className="text-sm text-muted-foreground">Error getting existing document</p>}

            {!acceptedFiles[0] && isEditingDocument && !existingDocumentFile?.content && existingDocumentFile?.networkStatus === "loading"
                && <p className="text-sm text-muted-foreground">Getting existing document...</p>}
        </div>
    )
}

export default FileUpload