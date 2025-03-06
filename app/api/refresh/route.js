import { cookies } from "next/headers";

export async function GET() {
    const refresh_token = cookies().get("refresh_token")?.value;

    if (!refresh_token) {
        return new Response(JSON.stringify({ message: "No refresh token" }), { status: 401 });
    }

    // Отправляем refresh_token в FastAPI
    const apiResponse = await fetch("http://127.0.0.1:8000/api/users/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token }),
    });

    if (!apiResponse.ok) {
        return new Response(JSON.stringify({ message: "Failed to refresh token" }), { status: 401 });
    }

    const data = await apiResponse.json();

    // Обновляем access_token в куки
    cookies().set("access_token", data.access_token, {
        httpOnly: true, secure: false, sameSite: "lax", path: "/",
    });

    return new Response(JSON.stringify({ message: "Token refreshed" }), { status: 200 });
}
