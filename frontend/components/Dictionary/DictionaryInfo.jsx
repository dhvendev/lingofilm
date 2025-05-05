import { calculateProgress } from '@/utils/vocabularyUtils';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DictionaryInfo({username, vocabulary}) {
    return (
        <CardHeader className="pt-4">
            <div className="flex justify-between items-center">
            <div className="flex flex-col">
                <CardTitle className="text-2xl">Словарь {username}</CardTitle>
                <CardDescription className="text-muted-foreground mt-1">
                Всего слов: {vocabulary.length} / Изучено: {vocabulary.filter(item => item.is_learned).length}
                </CardDescription>
            </div>
            <Badge className="bg-blue-600">
                {calculateProgress(vocabulary)}% изучено
            </Badge>
            </div>
        </CardHeader>
    )
}