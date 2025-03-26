"use client"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectScrollable({title, icon, options, onChange}) {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className="w-[280px] ">
        <div className="flex items-center gap-2 justify-between">
            {icon}
            <SelectValue placeholder={title} />
        </div>
        
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
        
          {options && options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
