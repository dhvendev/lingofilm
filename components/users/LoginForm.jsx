'use client';

import { useState } from "react";
import { login } from "@/api/user";

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();
        login(email, password);
    };

    return (
        <form onSubmit={handleSubmit} method="GET" className="flex flex-col gap-4">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" required onChange={(e) => setEmail(e.target.value)} className="border border-white"/>
            
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" required onChange={(e) => setPassword(e.target.value)} className="border border-white" />
            
            <button type="submit">Login</button>
        </form>
    );
}
