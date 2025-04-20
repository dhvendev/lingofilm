"use client";
import { useUser } from "@/context/userContext";
import { redirect } from "next/navigation";
export default function Profile() {
    const userContext = useUser();
    const user = userContext.user
    if (!user) {
        return redirect("/");
    }
    return (
        <div className="flex min-h-screen flex-col items-center p-24">
            <h1>Profile</h1>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Gender: {user.gender}</p>
            <p>Date of Birth: {user.date_of_birth}</p>
            <p>Created At: {user.created_at}</p>
            <div>Subscription: 
                {user.subscription &&
                    <div className="flex flex-col">
                        <p>Subscription Type: {user.subscription.sub_type}</p>
                        <p>Expire: {user.subscription.expire}</p>
                        <p>Is Active: {user.subscription.is_active ? "Активна" : "Не активна"}</p>
                    </div>
                }
            </div>
        </div>
    );
}