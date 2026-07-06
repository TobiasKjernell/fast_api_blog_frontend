import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router'
import { register as apiRegister, ApiError } from '../../services/apiCalls'

interface RegisterForm {
    username: string
    email: string
    password: string
    confirmPassword: string
}

const inputClass = "w-full px-3.5 py-2.5 rounded-lg bg-surface-2 border border-border text-ink placeholder:text-ink-faint outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 transition-colors"

const Register = () => {
    const navigate = useNavigate()
    const { register, handleSubmit, watch, formState: { errors, isSubmitting }, setError } = useForm<RegisterForm>()

    const onSubmit = async (data: RegisterForm) => {
        const formData = new FormData()
        formData.append('username', data.username)
        formData.append('email', data.email)
        formData.append('password', data.password)

        try {
            await apiRegister(formData)
            navigate('/login')
        } catch (e) {
            if (e instanceof ApiError && e.statusCode === 400) {
                setError('root', { message: 'Username or email already taken' })
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
                    <h1 className="text-2xl font-semibold tracking-tight text-ink">Create your account</h1>
                    <p className="text-ink-muted text-sm mt-1.5">Join the community and start publishing.</p>
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
                        <label className="text-ink-muted text-sm font-medium">Email</label>
                        <input
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            className={inputClass}
                            autoComplete="email"
                        />
                        {errors.email && <p className="text-danger text-sm">{errors.email.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-ink-muted text-sm font-medium">Password</label>
                        <input
                            type="password"
                            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                            className={inputClass}
                            autoComplete="new-password"
                        />
                        {errors.password && <p className="text-danger text-sm">{errors.password.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-ink-muted text-sm font-medium">Confirm Password</label>
                        <input
                            type="password"
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: (val) => val === watch('password') || 'Passwords do not match'
                            })}
                            className={inputClass}
                            autoComplete="new-password"
                        />
                        {errors.confirmPassword && <p className="text-danger text-sm">{errors.confirmPassword.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-1 bg-accent-gradient text-white font-medium p-2.5 rounded-lg cursor-pointer hover:brightness-110 active:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isSubmitting ? 'Registering...' : 'Register'}
                    </button>

                    <p className="text-ink-muted text-sm text-center">
                        Already have an account?{' '}
                        <Link to="/login" className="text-accent-soft hover:underline">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Register
