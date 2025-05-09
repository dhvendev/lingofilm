import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

// export default function ProfileCardStat({className, icon, text, value}) {
//     return (
//         <Card className={cn("flex justify-center items-center", className)}>
//             <CardContent>
//               <div className="flex flex-col items-center justify-between">
//                 <div className='flex items-center justify-center mb-1 gap-1'>
//                     {icon}
//                   <span className="text-md text-muted-foreground">{text}</span>
//                 </div>
//                 <p className="text-2xl font-bold">{value}</p>
//               </div>
//             </CardContent>
//         </Card>
//     )
// }

export default function ProfileCardStat({className, icon, text, value}) {
    return (
        <Card className={cn("flex justify-center items-center", className)}>
            <CardContent>
              <div className="flex flex-row items-center justify-between gap-10">
                <div className='flex flex-col items-center justify-center mb-1 gap-1'>
                    {icon}
                  <span className="text-md text-muted-foreground">{text}</span>
                </div>
                <p className="text-3xl font-bold">{value}</p>
              </div>
            </CardContent>
        </Card>
    )
}