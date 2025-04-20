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
import { useState } from "react"

export function SelectScrollable({title, icon, options, onChange, value}) {
  return (
    <Select onValueChange={onChange}  value={value || undefined} key={value}> 
      <SelectTrigger className="w-[280px] ">
        <div className="flex items-center gap-2 justify-between">
            {icon}
            <SelectValue  placeholder={title}></SelectValue>
        </div>
        
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
        
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
