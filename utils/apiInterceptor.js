export async function fetchWithAuth(url, options = {}) {
    let response = await fetch(url, { ...options, credentials: "include" });

    if (response.status === 401) {
        // Пытаемся обновить токен
        const refreshResponse = await fetch("/api/refresh", { method: "GET", credentials: "include" });

        if (refreshResponse.ok) {
            // Пробуем ещё раз запрос после успешного рефреша
            response = await fetch(url, { ...options, credentials: "include" });
        }
    }

    return response;
}
