import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUploadDocument, useUpdateDocument } from '@/hooks/api/useDocuments'
import { DocumentCategory } from '@prisma/client'
import { Field, Form, Formik } from 'formik'
import React, { useCallback, useEffect, useState } from 'react'
import * as Yup from 'yup'
import FileUpload from './FileUpload'

// TODO: cleanup the types definition 

interface DocumentFormValues {
    title: string;
    description: string;
    category: string;
    file: File | null;
}

export type EditDocument = {
    id: string;
    title: string;
    description: string;
    category: DocumentCategory;
    fileName: string;
    filePath: string;
    file: {
        networkStatus: "idle" | "loading" | "success" | "error";
        content: File | null
    }
}

interface Props {
    children: React.ReactNode;
    mode?: 'create' | 'edit';
    existingDocument?: EditDocument;
    onClose?: () => void;
    vivaSessionId: string;
}

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string(),
    category: Yup.string().required('Category is required'),
    file: Yup.mixed().required('File is required')
})


const NewDocumentForm = ({ children, mode, existingDocument, onClose, vivaSessionId }: Props) => {
    const [open, setOpen] = useState(false)
    const onDrop = useCallback((acceptedFiles: File[], setFieldValue: (field: string, value: any) => void) => {
        setFieldValue('file', acceptedFiles[0])
    }, [])

    const { mutate: uploadDocument, isSuccess, isPending } = useUploadDocument();
    const { mutate: updateDocument, isSuccess: isUpdateSuccess, isPending: isUpdatePending } = useUpdateDocument();

    useEffect(() => {
        if (isSuccess || isUpdateSuccess) {
            setOpen(false)
        }
    }, [isSuccess, isUpdateSuccess])

    useEffect(() => {
        if (existingDocument) {
            setOpen(true);
        }
    }, [existingDocument]);

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen && onClose) {
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="w-full max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'edit' ? 'Edit Document' : 'New Document'}
                    </DialogTitle>
                    <DialogDescription>
                        Add a new document to your viva context
                    </DialogDescription>
                </DialogHeader>
                <Formik<DocumentFormValues>
                    initialValues={{
                        title: existingDocument?.title || '',
                        description: existingDocument?.description || '',
                        category: existingDocument?.category || '',
                        file: null
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                        if (mode === 'edit' && existingDocument) {
                            const data = {
                                ...values,
                                id: existingDocument.id,
                                fileName: existingDocument.fileName,
                                filePath: existingDocument.filePath
                            }
                            updateDocument(data);
                        } else {
                            uploadDocument({
                                ...values,
                                vivaSessionId
                            });
                        }
                        resetForm();
                    }}
                >
                    {({ errors, touched, setFieldValue, values }) => (
                        <Form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Field
                                    name="title"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                {errors.title && touched.title && (
                                    <p className="text-sm text-red-500">{errors.title}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Field
                                    as="textarea"
                                    name="description"
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                {errors.description && touched.description && (
                                    <p className="text-sm text-red-500">{errors.description}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    name="category"
                                    onValueChange={(value) => setFieldValue('category', value)}
                                    value={values.category}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(DocumentCategory).map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category.toLowerCase().replace(/_/g, ' ')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && touched.category && (
                                    <p className="text-sm text-red-500">{errors.category}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Document</Label>
                                <FileUpload
                                    setFieldValue={setFieldValue}
                                    onDrop={onDrop}
                                    isEditingDocument={mode === 'edit'}
                                    existingDocumentFile={existingDocument?.file}
                                />
                                {errors.file && touched.file && (
                                    <p className="text-sm text-red-500">{errors.file}</p>
                                )}
                            </div>

                            <DialogFooter>
                                <Button
                                    className='w-full'
                                    type="submit"
                                    disabled={isPending || isUpdatePending}
                                >
                                    {isPending || isUpdatePending ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            {mode === 'edit' ? 'Updating...' : 'Uploading...'}
                                        </>
                                    ) : (
                                        mode === 'edit' ? 'Update Document' : 'Upload Document'
                                    )}
                                </Button>
                            </DialogFooter>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}
export default NewDocumentForm
