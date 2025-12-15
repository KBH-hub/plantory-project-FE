import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:9000",
    withCredentials: true,
});

export const login = (payload: {
    membername: string;
    password: string;
}) => {
    return api.post("/api/auth/login", payload);
};
