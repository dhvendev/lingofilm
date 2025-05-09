import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function ProgressSteps({ steps, currentStep }) {
  // Рассчитываем процент прогресса для полосы
  const progressPercentage = (currentStep / (steps.length - 1)) * 100;
  
  return (
    <div className="w-full py-2 px-4 flex flex-col justify-between gap-5">
      <div className='flex flex-col gap-2'>
        <h3 className="font-semibold text-lg">Путь к мастерству</h3>
        <p className="text-sm text-muted-foreground">Для разблокировки опыта, уровня и набора достижения, выполните шаги</p>
      </div>
      {/* Текущий шаг и описание */}
      <div className="text-center">
        <h3 className="font-semibold text-lg text-white">{steps[currentStep].label}</h3>
        <p className="text-sm text-gray-300 mt-1">
          {steps[currentStep].action}
        </p>
      </div>
      <div className="relative mb-8">
        {/* Основной прогресс бар */}
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-600 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        {/* Точки шагов и их метки */}
        <div className="absolute top-4 w-full flex justify-between transform -translate-y-1/2">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center">
                      <div 
                        className={`
                          w-8 h-8 rounded-full flex items-center justify-center border-2
                          ${isCompleted 
                            ? 'bg-green-600 border-green-600' 
                            : isCurrent 
                              ? 'bg-gray-800 border-green-600' 
                              : 'bg-gray-800 border-gray-700'}
                        `}
                      >
                        {isCompleted ? (
                          <Check className="h-5 w-5 text-white" />
                        ) : isCurrent ? (
                          <ArrowRight className="h-5 w-5 text-white" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-gray-400" />
                        )}
                      </div>
                      <span className="mt-2 text-xs font-medium text-white">{step.label}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{step.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>
      
      
    </div>
  );
};
