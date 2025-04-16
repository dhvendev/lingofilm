"use client";

import dynamic from "next/dynamic";
import { useUser } from "@/context/userContext";
import { ModeToggle } from "./toogleTheme";
import SearchComponent from "./Search";
import { LoginButtonsSkeleton } from "./SkeletonLoader";

const LoginForm = dynamic(() => import("./users/LoginForm"), { ssr: false, loading: () => <LoginButtonsSkeleton /> });
const ProfileBar = dynamic(() => import("./users/ProfileBar"), { ssr: false, loading: () => <LoginButtonsSkeleton /> });

export default function HeaderButtons() {
    const { user } = useUser();
    return (
        <div className="flex col-span-2 md:col-span-1 justify-center md:justify-end py-2 gap-2 md:py-0 items-center">
            <SearchComponent />
            <ModeToggle></ModeToggle>
            {user ? <ProfileBar /> : <LoginForm />}
        </div>
    );
}
