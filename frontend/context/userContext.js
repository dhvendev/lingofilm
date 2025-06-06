'use client';
import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ initialUser, children }) {
    const [user, setUser] = useState(initialUser);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}