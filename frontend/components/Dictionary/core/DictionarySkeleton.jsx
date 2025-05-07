import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function DictionarySkeleton() {
    return (
        <div className="container mx-auto px-4 pt-28 max-w-5xl">
            <Card className="w-full shadow-lg py-0 pb-6 border-none">
                <div className="relative">
                    <div className="h-48 w-full bg-gradient-to-r from-green-900 via-green-700 to-green-500 rounded-t-lg"></div>
                    <div className="absolute bottom-4 left-8 flex items-center">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <div className="ml-4">
                            <Skeleton className="h-8 w-40" />
                            <Skeleton className="h-4 w-64 mt-2" />
                        </div>
                    </div>
                </div>
                
                <CardHeader className="pt-4">
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                
                <CardContent>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-60 w-full mt-4" />
                </CardContent>
            </Card>
        </div>
    );
}