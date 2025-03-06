"use server";
import { cookies } from "next/headers";

export async function loginAction(email, password) {
    const apiResponse = await fetch("http://127.0.0.1:8000/api/users/aunthenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!apiResponse.ok) {
        throw new Error("Ошибка авторизации");
    }

    const data = await apiResponse.json();
    const cookieStore = await cookies();
    // Сохраняем access_token и refresh_token в куки
    cookieStore.set("access_token", data.access_token, {
        httpOnly: true, secure: false, sameSite: "lax", path: "/",
    });

    cookieStore.set("refresh_token", data.refresh_token, {
        httpOnly: true, secure: false, sameSite: "lax", path: "/",
    });

    return data;
}
