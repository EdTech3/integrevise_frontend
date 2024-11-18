import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const DocumentCardSkeleton = () => {
    return (
        <Card className="w-full bg-secondary-200 text-foreground animate-pulse">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-2">
                    {/* Title skeleton */}
                    <div className="h-6 w-48 bg-secondary-200/50 rounded-md animate-pulse" />
                    {/* Category skeleton */}
                    <div className="h-5 w-24 bg-secondary-200/50 rounded-full animate-pulse" />
                </div>
                {/* Menu button skeleton */}
                <div className="h-8 w-8 rounded-md bg-secondary-200/50 animate-pulse" />
            </CardHeader>
            <CardContent className='h-24 overflow-hidden flex-grow flex flex-col justify-start'>
                {/* Description skeleton */}
                <div className="space-y-2">
                    <div className="h-4 w-full bg-secondary-200/50 rounded-md animate-pulse" />
                    <div className="h-4 w-3/4 bg-secondary-200/50 rounded-md animate-pulse" />
                </div>
            </CardContent>
            <CardFooter>
                {/* Date skeleton */}
                <div className="h-4 w-40 bg-secondary-200/50 rounded-md animate-pulse" />
            </CardFooter>
        </Card>
    )
}

export default DocumentCardSkeleton
