import { X, Check } from "lucide-react"

export default function GameHistoryTable({gameHistory}) {
    const tableHeaders = ['Слово', 'Ваш ответ', 'Правильный ответ', 'Результат'];
    return (
        <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
                <tr>
                    {tableHeaders.map((header, index) => (
                        <th key={index} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
            {gameHistory.map((item, rowIndex) => (
                <tr key={`row-${rowIndex}`} className={item.correct ? "bg-green-500/10" : "bg-red-500/10"}>
                <td 
                    key={`cell-question-${rowIndex}`} 
                    className="px-6 py-4 whitespace-nowrap text-sm"
                >
                    <span className="font-medium">{item.questionWord}</span>
                </td>
                <td 
                    key={`cell-user-${rowIndex}`} 
                    className="px-6 py-4 whitespace-nowrap text-sm"
                >
                    <span className="font-medium">{item.userAnswer}</span>
                </td>
                <td 
                    key={`cell-correct-${rowIndex}`} 
                    className="px-6 py-4 whitespace-nowrap text-sm"
                >
                    <span className="font-medium">{item.correctWord}</span>
                </td>
                <td 
                    key={`cell-result-${rowIndex}`} 
                    className="px-6 py-4 whitespace-nowrap text-sm"
                >
                    {item.correct ? (
                    <Check className="h-5 w-5 text-green-600" />
                    ) : (
                    <X className="h-5 w-5 text-red-600" />
                    )}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}