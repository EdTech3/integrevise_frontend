export function resolveBlobMimeType(file: File) {
    switch (file.type) {
        case "application/pdf":
            return "PDF"
        case "application/msword":
            return "WORD"
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            return "WORD"
        default:
            return file.type
    }
}

export function checkSupportedType(resolvedType: string) {
    const supportedTypes = ["PDF", "WORD"]
    return supportedTypes.includes(resolvedType)
}

export function getFileNameFromPath(filePath: string) {
    return filePath.split('-')[1]
}