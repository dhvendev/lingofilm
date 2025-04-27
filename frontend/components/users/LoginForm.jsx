'use client';
import { useState } from "react";
import { loginUser, registerUser } from "@/services/axiosMethods";
import { useUser } from "@/context/userContext";
import { SmartCaptcha } from '@yandex/smart-captcha';
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
import { Checkbox } from "../ui/checkbox";
import { z } from "zod";
import { Select, SelectContent,  SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner"

const loginSchema = z.object({
    email: z.string().email("Введите корректный адрес электронной почты").min(1, "Email обязателен"),
    password: z.string().min(4, "Пароль должен быть минимум из 6 символов").min(1, "Пароль обязателен")
});

const registerSchema = z.object({
    username: z.string().min(3, "Имя пользователя должно быть минимум из 3 символов").max(30, "Имя пользователя не должно превышать 30 символов"),
    email: z.string().email("Введите корректный адрес электронной почты").min(1, "Email обязателен"),
    password: z.string().min(8, "Пароль должен быть минимум из 8 символов").min(1, "Пароль обязателен"),
    gender: z.string().optional(),
    date_of_birth: z.string().optional(),
    captchaToken: z.string().min(1, "Пожалуйста, подтвердите, что вы не робот"),
    terms: z.boolean().refine(val => val === true, {
        message: "Необходимо согласиться с условиями",
    }),
});

export default function LoginForm() {
    const { setUser } = useUser();
    const [isLogin, setIsLogin] = useState(true);
    // Поля для входа
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Дополнительные поля для регистрации
    const [username, setUsername] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [terms, setTerms] = useState(false);
    const [captchaToken, setCaptchaToken] = useState('');
    const [resetCaptcha, setResetCaptcha] = useState(0);
    
    
    const [error, setError] = useState(null);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            loginSchema.parse({ email, password });
            const response = await loginUser({
                email: email,
                password: password
            });
            
            if (!response) {
                setError("Ошибка входа. Проверьте логин и пароль.");
                toast.error("Ошибка входа. Проверьте логин и пароль.");
            } else {
                setUser(response);
            }
        } catch (err) {
            if (err instanceof z.ZodError) {
                setError(err.errors.map(e => e.message).join(", "));
                err.errors.map(e => toast.error(e.message));
            } else {
                setError("Ошибка сервера. Попробуйте позже.");
                toast.error("Ошибка сервера. Попробуйте позже.");
            }
            console.error("Ошибка при входе:", err);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            registerSchema.parse({ 
                username, 
                email, 
                password, 
                gender, 
                date_of_birth: dateOfBirth, 
                captchaToken,
                terms 
            });

            const userData = {
                username: username,
                email: email, 
                password: password,
                captchaToken: captchaToken
            };
            
            if (gender) {
                userData.gender = gender;
            }
            
            if (dateOfBirth) {
                userData.date_of_birth = new Date(dateOfBirth).toISOString();
            }

            console.log('Отправляемые данные:', userData);
            
            const response = await registerUser(userData);
            setUser(response);
        } catch (err) {
            if (err instanceof z.ZodError) {
                setError(err.errors.map(e => e.message).join(", "));
                err.errors.map(e => toast.error(e.message));
            } else {
                setError(err.message || "Ошибка регистрации. Пожалуйста, попробуйте снова.");
                toast.error(err.message || "Ошибка регистрации. Пожалуйста, попробуйте снова.");
            }
            console.error("Ошибка при регистрации:", err);
            resetCaptchaState();
        }
    };

    const resetCaptchaState = () => {
        setResetCaptcha(prev => prev + 1);
        setCaptchaToken('');
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError(null);
        resetCaptchaState();
    };

    const handleCaptchaSuccess = (token) => {
        setCaptchaToken(token);
    };

    const handleTokenExpired = () => {
        setCaptchaToken('');
    };

    return (
        <>
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="primary1 rounded ml-2">
                    {isLogin ? "Войти в аккаунт" : "Регистрация"}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
                <AlertDialogHeader>
                    <AlertDialogTitle>{isLogin ? "Вход" : "Регистрация"}</AlertDialogTitle>
                    {/* {error && <p className="text-red-500">{error}</p>} */}
                    <AlertDialogDescription>
                        Пожалуйста, заполните форму для {isLogin ? "входа" : "регистрации"}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex flex-col gap-3 my-2">
                    {isLogin ? (
                        <>
                            <Label htmlFor="email">Электронная почта:</Label>
                            <Input 
                                type="email" 
                                name="email" 
                                id="email" 
                                placeholder="welcome@lingofilms.ru" 
                                required 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="bg-black"
                            />
                            <Label htmlFor="password">Пароль:</Label>
                            <Input 
                                type="password" 
                                name="password" 
                                id="password" 
                                placeholder="lingo_secret" 
                                required 
                                onChange={(e) => setPassword(e.target.value)} 
                                className="bg-black" 
                            />
                            <div className="text-sm mt-2 text-gray-400">
                                Нет аккаунта? <button 
                                    type="button" 
                                    onClick={toggleForm}
                                    className="text-blue-500 hover:underline"
                                >
                                    Зарегистрироваться
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Label htmlFor="username">Имя пользователя:</Label>
                            <Input 
                                type="text" 
                                name="username" 
                                id="username" 
                                placeholder="Имя пользователя" 
                                required 
                                onChange={(e) => setUsername(e.target.value)} 
                                className="bg-black"
                            />
                            
                            <Label htmlFor="reg-email">Электронная почта:</Label>
                            <Input 
                                type="email" 
                                name="reg-email" 
                                id="reg-email" 
                                placeholder="welcome@lingofilms.ru" 
                                required 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="bg-black"
                            />
                            
                            <Label htmlFor="reg-password">Пароль:</Label>
                            <Input 
                                type="password" 
                                name="reg-password" 
                                id="reg-password" 
                                placeholder="Минимум 8 символов" 
                                required 
                                onChange={(e) => setPassword(e.target.value)} 
                                className="bg-black"
                            />
                            
                            <Label htmlFor="gender">Пол (необязательно):</Label>
                            <Select id="gender" onValueChange={setGender} className="bg-black">
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Выберите пол"></SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Мужской</SelectItem>
                                    <SelectItem value="female">Женский</SelectItem>
                                    <SelectItem value="other">Другой</SelectItem>
                                </SelectContent>
                            </Select>
                            
                            <Label htmlFor="date_of_birth">Дата рождения (необязательно):</Label>
                            <Input 
                                type="date" 
                                name="date_of_birth" 
                                id="date_of_birth" 
                                onChange={(e) => setDateOfBirth(e.target.value)} 
                                className="bg-black text-muted-foreground"
                            />
                            
                            <div className="mt-3 mb-2 relative contain-content rounded-lg border border-input">
                                <SmartCaptcha
                                    key={resetCaptcha}
                                    onSuccess={handleCaptchaSuccess}
                                    onTokenExpired={handleTokenExpired}
                                    sitekey="ysc1_Jii7swbxL38zqqugKvoULyLe998fDBBNBLkODc48b27818f5"
                                    hl="ru"
                                    invisible={false}
                                    webview={false}
                                    theme="dark"
                                />
                            </div>
                            
                            <div className="flex items-center space-x-2 mt-2">
                                <Checkbox 
                                    id="terms" 
                                    checked={terms}
                                    onCheckedChange={setTerms}
                                />
                                <label
                                    htmlFor="terms"
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Я согласен с условиями использования
                                </label>
                            </div>
                            
                            <div className="text-sm mt-4 text-gray-400">
                                Уже есть аккаунт? <button 
                                    type="button" 
                                    onClick={toggleForm}
                                    className="text-blue-500 hover:underline"
                                >
                                    Войти
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={isLogin ? handleLoginSubmit : handleRegisterSubmit}>
                        {isLogin ? "Войти" : "Зарегистрироваться"}
                    </AlertDialogAction>
                </AlertDialogFooter>    
            </AlertDialogContent>
        </AlertDialog>
        </>
    )
}