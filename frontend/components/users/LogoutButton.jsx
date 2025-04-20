'use client'
import { useUser } from "@/context/userContext";
import { Button } from "../ui/button";
import { logoutUser } from "@/services/axiosMethods";
export default function LogoutButton() {
    const { setUser } = useUser();
    const handleLogout = async () => {
        setUser(null);
        try {
            const response = await logoutUser();
        } catch (error) {
            console.log(error);
        }
    }
    return (<Button onClick={handleLogout} className={"bg-white border border-black text-black"}>Logout</Button>);
}