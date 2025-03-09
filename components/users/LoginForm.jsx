'use client';
import { useState } from "react";
import { loginUser } from "@/services/axiosMethods";
import { useUser } from "@/context/userContext";

export default function LoginForm() {
    const { setUser } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await loginUser(email, password);
            if (!response) {
                setError("Ошибка входа. Проверьте логин и пароль.");
            } else {
                setUser(response);
            }
        } catch (err) {
            setError("Ошибка сервера. Попробуйте позже.");
            console.error("Ошибка при входе:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} method="GET" className="flex flex-col gap-4">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" required onChange={(e) => setEmail(e.target.value)} className="bg-black"/>
            
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" required onChange={(e) => setPassword(e.target.value)} className="bg-black" />
            
            <button type="submit">Login</button>
        </form>
    );
}
