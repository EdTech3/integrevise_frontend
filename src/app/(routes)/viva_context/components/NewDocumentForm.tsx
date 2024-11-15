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
import { useUploadDocument } from '@/hooks/api/useDocuments'
import { DocumentCategory } from '@prisma/client'
import { Field, Form, Formik } from 'formik'
import React, { useCallback } from 'react'
import * as Yup from 'yup'
import FileUpload from './FileUpload'

interface DocumentFormValues {
    title: string;
    description: string;
    category: string;
    file: File | null;
}

interface Props {
    children: React.ReactNode
}

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string(),
    category: Yup.string().required('Category is required'),
    file: Yup.mixed().required('File is required')
})


const NewDocumentForm = ({ children }: Props) => {
    const onDrop = useCallback((acceptedFiles: File[], setFieldValue: (field: string, value: any) => void) => {
        setFieldValue('file', acceptedFiles[0])
    }, [])

    const { mutate: uploadDocument } = useUploadDocument();


    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="w-full max-w-xl">
                <DialogHeader>
                    <DialogTitle>New Document</DialogTitle>
                    <DialogDescription>
                        Add a new document to your viva context
                    </DialogDescription>
                </DialogHeader>
                <Formik<DocumentFormValues>
                    initialValues={{
                        title: '',
                        description: '',
                        category: '',
                        file: null
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        uploadDocument({
                            ...values,
                            vivaSessionId: "cm3gt1ps0000dkdmjtzf7hvqe"
                        })
                    }}
                >
                    {({ errors, touched, setFieldValue }) => (
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
                                <Select name="category" onValueChange={(value) => setFieldValue('category', value)}>
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
                                <FileUpload setFieldValue={setFieldValue} onDrop={onDrop} />
                                {errors.file && touched.file && (
                                    <p className="text-sm text-red-500">{errors.file}</p>
                                )}
                            </div>

                            <DialogFooter>
                                <Button className='w-full' type="submit">Upload Document</Button>
                            </DialogFooter>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}
export default NewDocumentForm
