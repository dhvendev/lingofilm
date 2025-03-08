import api from "./axiosConfig";

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


async function loginUser(email, password) {
    console.log(email, password);
    try {
        const response = await api.post(`/api/users/authenticate`, { email, password }, { withCredentials: true });
        console.log(response);
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export { getUser, loginUser };