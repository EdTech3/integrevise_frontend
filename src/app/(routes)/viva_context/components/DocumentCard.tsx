import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DocumentCategory } from '@prisma/client'
import { Pencil, Trash } from 'lucide-react'
import { BsThreeDotsVertical } from "react-icons/bs"

interface Props {
    title: string,
    description: string,
    category: DocumentCategory,
    updatedAt: Date,
    onEdit: () => void
    onDelete: () => void
}

const DocumentCard = ({ title, description, category, updatedAt, onEdit, onDelete }: Props) => {

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(updatedAt)

    return (
        <Card className="w-full bg-secondary-100 text-foreground">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                    <CardTitle className="text-xl font-semibold">{title}</CardTitle>
                    <CardDescription >
                        {category && (
                            <span className="inline-block px-2 py-1 text-xs font-thin rounded-full capitalize border border-secondary-200 text-secondary-200">
                                {category.replace(/_/g, ' ').toLocaleLowerCase()}
                            </span>
                        )}
                    </CardDescription>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <BsThreeDotsVertical size={20} />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={onEdit}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onDelete} className="bg-red-600 text-white hover:bg-red-700 focus:bg-red-700">
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className='h-24 overflow-hidden flex flex-col justify-center'>
                <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground">Last updated: {formattedDate}</p>
            </CardFooter>
        </Card>
    )
}

export default DocumentCard