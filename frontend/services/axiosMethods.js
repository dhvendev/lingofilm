import api from "./axiosConfig";

// TODO: add throw error if response is null
async function getUser(session_id) {
    console.log('api method', session_id);
    try {
        console.log(session_id);
        const response = await api.post(`/api/users/getUser`,{}, { withCredentials: true, headers: session_id ? { Cookie: `session_id=${session_id}` } : {}});
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// TODO: add throw error if response is null
async function loginUser(userData) {
    try {
        const response = await api.post(`/api/users/authenticate`, userData, { withCredentials: true });
        console.log(response);
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}
async function registerUser(userData) {
    try {
        const response = await api.post(`/api/users/register`, userData, { withCredentials: true });
        return response.data;
    } catch (error) {
        if (error.response?.status === 400) {
            throw new Error("Пользователь с таким логином уже существует");
        } else if (error.response?.status === 409) {
            throw new Error("Пользователь с таким email уже существует");
        } 
        throw new Error("Ошибка сервера. Попробуйте позже.");
    }
}
// TODO: add throw error if response is null
async function logoutUser() {
    try {
        const response = await api.post(`/api/users/logout`, {}, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function getMovieByQuery(query) {
    try {
        const response = await api.post(`/api/movies/searchMovies`, { query }, { withCredentials: true });
        if (!response.data) {
            return [];
        }
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}
// TODO: add throw error if response is null
async function getMovies() {
    try {
        const response = await api.post(`/api/movies/getMovies`, {}, { withCredentials: true });
        if (!response.data) {
            return [];
        }
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}
// TODO: add throw error if response is null
async function getMoviesByFilter(payload) {
    console.log(payload);
    try {
        const response = await api.post(`/api/movies/getMoviesByFilter`, { country: payload.country, genre: payload.genre, year: payload.year, actor: payload.actor, difficulty: payload.difficulty, sort: payload.sort }, { withCredentials: true });
        if (!response.data) {
            return [];
        }
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}
// TODO: add throw error if response is null
async function  getMovie(slug) {
    try {
        const response = await api.post(`/api/movies/getMovie`, { slug }, { withCredentials: true });
        if (!response.data) {
            return null;
        }
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
    
}
// TODO: add throw error if response is null
async function getGenres() {
    try {
        const response = await api.post(`/api/filters/getGenres`, { withCredentials: true });
        if (!response.data) {
            return null;
        }
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// TODO: add throw error if response is null
async function getCountries() {
    try {
        const response = await api.post(`/api/filters/getCountries`, { withCredentials: true });
        if (!response.data) {
            return null;
        }
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function editPicture(image) {
    try {
        const response = await api.post(`/api/users/editPicture`, {image} ,{ withCredentials: true });
        if (!response.data) {
            return null;
        }
        return response.data;
    } catch(error) {
        if (error.response?.status === 401) {
            throw new Error("Вы не авторизованы");
        }
        throw new Error("Ошибка сервера. Попробуйте позже.");
    }
}

export { getUser, loginUser, logoutUser, getMovieByQuery, getMovies, getMoviesByFilter, getMovie, getGenres, getCountries, registerUser };