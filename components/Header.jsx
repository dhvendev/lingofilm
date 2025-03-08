"use client";

import dynamic from "next/dynamic";
import { useUser } from "@/context/userContext";
import Link from "next/link";

const LoginForm = dynamic(() => import("./users/LoginForm"), { ssr: false, loading: () => <span>Загрузка...</span> });
const ProfileBar = dynamic(() => import("./users/ProfileBar"), { ssr: false, loading: () => <span>Загрузка...</span> });


export default function Header() {
    const { user } = useUser();
    console.log("берется из контекста", user);

    return (
        <div className="w-[1/4] flex items-center gap-4">
            {user ? <ProfileBar /> : <LoginForm />}
            <ul>
                <li><Link href="/pages/1">Page 1</Link></li>
                <li><Link href="/pages/2">Page 2</Link></li>
                <li><Link href="/pages/3">Page 3</Link></li>
            </ul>
        </div>
    );
}
