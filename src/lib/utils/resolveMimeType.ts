export function resolveBlobMimeType(file: File) {
    switch (file.type) {
        case "application/pdf":
            return "pdf"
        case "	application/msword":
            return "doc"
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            return "docx"
        default:
            return file.type
    }
}

