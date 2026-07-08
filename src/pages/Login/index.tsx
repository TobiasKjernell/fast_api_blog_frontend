import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { ApiError } from '../../services/apiCalls'
import ForgotPasswordModal from '../../components/ForgotPasswordModal'

interface LoginForm {
    username: string
    password: string
}

const inputClass = "w-full px-3.5 py-2.5 rounded-lg bg-surface-2 border border-border text-ink placeholder:text-ink-faint outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 transition-colors"

const Login = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginForm>()
    const [showForgotPassword, setShowForgotPassword] = useState(false)

    const onSubmit = async (data: LoginForm) => {
        try {
            await login(data.username, data.password)
            navigate('/')
        } catch (e) {
            if (e instanceof ApiError && e.statusCode === 401) {
                setError('root', { message: 'Invalid username or password' })
            } else {
                setError('root', { message: 'Something went wrong, please try again' })
            }
        }
    }

    return (
        <div className="flex-1 flex justify-center items-center px-6 py-12">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <span className="size-12 rounded-2xl bg-accent-gradient flex items-center justify-center shadow-lg shadow-accent/20 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                        </svg>
                    </span>
                    <h1 className="text-2xl font-semibold tracking-tight text-ink">Welcome back</h1>
                    <p className="text-ink-muted text-sm mt-1.5">Log in to keep writing and reading.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="card rounded-2xl p-8 flex flex-col gap-5 shadow-2xl shadow-black/40">
                    {errors.root && (
                        <p className="text-danger text-sm bg-danger-soft/10 border border-danger-soft/30 rounded-lg px-3 py-2">{errors.root.message}</p>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-ink-muted text-sm font-medium">Username</label>
                        <input
                            {...register('username', { required: 'Username is required' })}
                            className={inputClass}
                            autoComplete="username"
                        />
                        {errors.username && <p className="text-danger text-sm">{errors.username.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-ink-muted text-sm font-medium">Password</label>
                            <button
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                                className="text-accent-soft text-sm hover:underline cursor-pointer"
                            >
                                Forgot password?
                            </button>
                        </div>
                        <input
                            type="password"
                            {...register('password', { required: 'Password is required' })}
                            className={inputClass}
                            autoComplete="current-password"
                        />
                        {errors.password && <p className="text-danger text-sm">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-1 bg-accent-gradient text-white font-medium p-2.5 rounded-lg cursor-pointer hover:brightness-110 active:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>

                    <p className="text-ink-muted text-sm text-center">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-accent-soft hover:underline">Register</Link>
                    </p>
                </form>
            </div>

            {showForgotPassword && (
                <ForgotPasswordModal toggleOffModal={() => setShowForgotPassword(false)} />
            )}
        </div>
    )
}

export default Login
