"use server"

import { fetchWithAuth } from "@/utils/apiInterceptor";

/*
export function getUserData() {
    return fetchWithAuth("http://127.0.0.1:8000/api/users/me")
        .then((res) => res.json());
}
*/


export async function login(email, password) {
    console.log(email, password);
}