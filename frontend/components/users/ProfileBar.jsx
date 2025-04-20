import LogoutButton from "./LogoutButton";
import { useUser } from "@/context/userContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronDown, User, BookA, Ticket, LogOut } from "lucide-react";
import Link from "next/link";

export default function ProfileBar() {
    const user = useUser();
    const data = user.user
    console.log(data);
    return (
        <div className="flex flex-row gap-2 items-center">
            <Avatar className="border-solid border-white border-2">
                <AvatarImage src={ "https://github.com/shadcn.png"} />
                <AvatarFallback>{data.username}</AvatarFallback>
            </Avatar>
            <Popover>
                <PopoverTrigger asChild>
                <ChevronDown size={20} strokeWidth={2.25} />
                </PopoverTrigger>
                <PopoverContent className="w-50 mt-5 border-3 bg-white">
                    <div className="grid grid-cols-1 text-sm gap-1 text-black">
                        <Link href={"/profile"} className="flex flex-row gap-1 items-center">
                            <User size={15} strokeWidth={2.25} />
                            Профиль
                        </Link>
                        <Link href={"/profile/dictionary"} className="flex flex-row gap-1 items-center">
                            <BookA size={15} strokeWidth={2.25} />
                            Словарь
                        </Link>
                        <Link href={"/profile/subscription"} className="flex flex-row gap-1 items-center">
                            <Ticket size={15} strokeWidth={2.25} />
                            Подписка
                        </Link>
                    </div>
                </PopoverContent>
            </Popover>
            <LogoutButton />
        </div>
    );
}