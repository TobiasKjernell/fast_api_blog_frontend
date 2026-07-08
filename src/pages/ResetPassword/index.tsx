import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams, Link } from 'react-router'
import { useResetPassword } from '../../hooks/useResetPassword'
import { ApiError } from '../../services/apiCalls'

interface ResetPasswordForm {
    newPassword: string
    confirmPassword: string
}

const inputClass = "w-full px-3.5 py-2.5 rounded-lg bg-surface-2 border border-border text-ink placeholder:text-ink-faint outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 transition-colors"

const ResetPassword = () => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token') ?? ''
    const navigate = useNavigate()
    const { register, handleSubmit, watch, formState: { errors, isSubmitting }, setError } = useForm<ResetPasswordForm>()
    const { mutateAsync, isSuccess } = useResetPassword()

    const onSubmit = async (data: ResetPasswordForm) => {
        try {
            await mutateAsync({ token, new_password: data.newPassword })
        } catch (e) {
            if (e instanceof ApiError && e.statusCode === 400) {
                setError('root', { message: 'This reset link is invalid or has expired' })
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
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                        </svg>
                    </span>
                    <h1 className="text-2xl font-semibold tracking-tight text-ink">Set a new password</h1>
                    <p className="text-ink-muted text-sm mt-1.5">Choose a new password for your account.</p>
                </div>

                {!token ? (
                    <div className="card rounded-2xl p-8 flex flex-col gap-4 shadow-2xl shadow-black/40">
                        <p className="text-danger text-sm bg-danger-soft/10 border border-danger-soft/30 rounded-lg px-3 py-2">
                            This reset link is missing its token. Please request a new one from the login page.
                        </p>
                        <Link to="/login" className="text-accent-soft text-sm hover:underline text-center">Back to login</Link>
                    </div>
                ) : isSuccess ? (
                    <div className="card rounded-2xl p-8 flex flex-col gap-4 shadow-2xl shadow-black/40">
                        <p className="text-ink-muted text-sm">Your password has been reset successfully.</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-accent-gradient text-white font-medium p-2.5 rounded-lg cursor-pointer hover:brightness-110 active:brightness-95 transition-all"
                        >
                            Go to login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="card rounded-2xl p-8 flex flex-col gap-5 shadow-2xl shadow-black/40">
                        {errors.root && (
                            <p className="text-danger text-sm bg-danger-soft/10 border border-danger-soft/30 rounded-lg px-3 py-2">{errors.root.message}</p>
                        )}

                        <div className="flex flex-col gap-1.5">
                            <label className="text-ink-muted text-sm font-medium">New Password</label>
                            <input
                                type="password"
                                {...register('newPassword', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })}
                                className={inputClass}
                                autoComplete="new-password"
                            />
                            {errors.newPassword && <p className="text-danger text-sm">{errors.newPassword.message}</p>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-ink-muted text-sm font-medium">Confirm New Password</label>
                            <input
                                type="password"
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: (val) => val === watch('newPassword') || 'Passwords do not match'
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
                            {isSubmitting ? 'Resetting...' : 'Reset password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default ResetPassword
