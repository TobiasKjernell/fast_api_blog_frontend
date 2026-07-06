import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { getMe, login as apiLogin } from '../services/apiCalls'
import type { IUser } from '../services/apiCalls'

interface AuthContextType {
    user: IUser | null
    token: string | null
    login: (username: string, password: string) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
    updateUser: (user: IUser) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
    const [user, setUser] = useState<IUser | null>(null)

    useEffect(() => {
        if (token) {
            getMe().then(setUser).catch(() => {
                localStorage.removeItem('token')
                setToken(null)
                setUser(null)
            })
        }
    }, [token])

    const login = async (username: string, password: string) => {
        const { access_token } = await apiLogin(username, password)
        localStorage.setItem('token', access_token)
        setToken(access_token)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
    }

    const updateUser = (updatedUser: IUser) => setUser(updatedUser)

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
