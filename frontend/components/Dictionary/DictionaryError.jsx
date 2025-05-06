import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';


export default function DictionaryError() {
    return (
        <div className="container mx-auto px-4 pt-28 max-w-4xl">
            <Card className="w-full shadow-lg py-0 pb-6">
                <CardHeader>
                    <CardTitle className="pt-4">Ошибка загрузки словаря</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-red-500">{error}</p>
                    <Button
                        className="mt-4 mx-auto block bg-primary text-white px-4 py-2 rounded-md"
                        onClick={() => window.location.reload()}
                    >
                        Попробовать снова
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}