'use client';
import { useState } from "react";
import { loginUser } from "@/services/axiosMethods";
import { useUser } from "@/context/userContext";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,    
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email("Введите корректный адрес электронной почты").min(1, "Email обязателен"),
    password: z.string().min(4, "Пароль должен быть минимум из 6 символов").min(1, "Пароль обязателен")
});

export default function LoginForm() {
    const { setUser } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            loginSchema.parse({ email, password });

            const response = await loginUser(email, password);
            if (!response) {
                setError("Ошибка входа. Проверьте логин и пароль.");
            } else {
                setUser(response);
            }
        } catch (err) {
            if (err instanceof z.ZodError) {
                setError(err.errors.map(e => e.message).join(", ")); // Сообщаем о ошибках валидации
            } else {
                setError("Ошибка сервера. Попробуйте позже.");
            }
            console.error("Ошибка при входе:", err);
        }
    };
    return (
        <>
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="primary1 rounded ml-2">Войти в аккаунт</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Вход</AlertDialogTitle>
                    {error && <p className="text-red-500">{error}</p>}
                    <AlertDialogDescription className="flex flex-col gap-3 my-2">
                            <Label htmlFor="email">Электронная почта:</Label>
                            <Input type="email" name="email" id="email" placeholder="welcome@lingofilms.ru" required onChange={(e) => setEmail(e.target.value)} className="bg-black"/>
                            <Label htmlFor="password">Пароль:</Label>
                            <Input type="password" name="password" id="password" placeholder="lingo_secret" required onChange={(e) => setPassword(e.target.value)} className="bg-black" />

                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit}>Продолжить</AlertDialogAction>
                </AlertDialogFooter>    
            </AlertDialogContent>
        </AlertDialog>
        </>

    )
}
