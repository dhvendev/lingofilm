import { calculateProgress } from '@/utils/vocabularyUtils';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Award, TrendingUp } from 'lucide-react';

export default function DictionaryInfo({ vocabulary }) {
    const progress = calculateProgress(vocabulary);
    const totalWords = vocabulary.length;
    const learnedWords = vocabulary.filter(item => item.is_learned).length;
    
    
    
    return (
        <CardHeader className="pt-4 pb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="flex flex-col">
                    <CardTitle className="text-2xl flex items-center gap-2">
                        Прогресс:
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mt-1">
                        Следите за прогрессом в изучении вашего словарного запаса
                    </CardDescription>
                </div>

                
                
                {/* Stats Cards */}
                <div className="flex flex-row gap-4">
                    <div className="bg-card border rounded-lg px-4 py-2 text-center shadow-sm">
                        <div className="flex items-center justify-center mb-1">
                            <Award className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm">Всего слов</span>
                        </div>
                        <p className="text-xl font-bold">{totalWords}</p>
                    </div>
                    
                    <div className="bg-card border rounded-lg px-4 py-2 text-center shadow-sm">
                        <div className="flex items-center justify-center mb-1">
                            <BrainCircuit className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-sm">Изучено</span>
                        </div>
                        <p className="text-xl font-bold">{learnedWords}</p>
                    </div>
                    
                    <div className="bg-card border rounded-lg px-4 py-2 text-center shadow-sm">
                        <div className="flex items-center justify-center mb-1">
                            <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
                            <span className="text-sm">Прогресс</span>
                        </div>
                        <p className="text-xl font-bold">{progress}%</p>
                    </div>
                </div>
            </div>
        </CardHeader>
    );
}