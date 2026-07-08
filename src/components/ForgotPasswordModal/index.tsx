import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useForgotPassword } from "../../hooks/useForgotPassword"

interface IForgotPasswordModal {
    toggleOffModal: () => void
}

interface ForgotPasswordForm {
    email: string
}

const inputClass = "w-full px-3.5 py-2.5 rounded-lg bg-surface-2 border border-border text-ink placeholder:text-ink-faint outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 transition-colors"

const ForgotPasswordModal = ({ toggleOffModal }: IForgotPasswordModal) => {
    const [visible, setVisible] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>()
    const { mutate, isPending, isSuccess, error } = useForgotPassword()

    useEffect(() => {
        const id = requestAnimationFrame(() => setVisible(true))
        return () => cancelAnimationFrame(id)
    }, [])

    const onSubmit = (data: ForgotPasswordForm) => mutate(data.email)

    return (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={`card w-full max-w-md rounded-2xl flex flex-col text-ink shadow-2xl shadow-black/50 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
            >
                <div className="flex justify-between items-center w-full p-5 border-b border-border">
                    <h2 className="text-xl font-semibold tracking-tight">Reset your password</h2>
                    <button type="button" onClick={toggleOffModal} className="text-ink-faint hover:text-ink transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-5 flex flex-col gap-4">
                    {isSuccess ? (
                        <p className="text-ink-muted text-sm">If an account exists for that email, a password reset link has been sent.</p>
                    ) : (
                        <>
                            <p className="text-ink-muted text-sm">Enter your email and we'll send you a link to reset your password.</p>
                            {error && <p className="text-danger text-sm bg-danger-soft/10 border border-danger-soft/30 rounded-lg px-3 py-2">{error.message}</p>}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-ink-muted text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    {...register('email', { required: 'Email is required' })}
                                    className={inputClass}
                                    autoComplete="email"
                                    autoFocus
                                />
                                {errors.email && <p className="text-danger text-sm">{errors.email.message}</p>}
                            </div>
                        </>
                    )}
                </div>

                <div className="flex gap-3 justify-end p-5 border-t border-border">
                    <button
                        type="button"
                        onClick={toggleOffModal}
                        className="px-4 py-2 rounded-lg border border-border-strong text-sm text-ink hover:bg-surface-hover transition-colors cursor-pointer"
                    >
                        {isSuccess ? 'Close' : 'Cancel'}
                    </button>
                    {!isSuccess && (
                        <button
                            disabled={isPending}
                            className="px-4 py-2 rounded-lg bg-accent-gradient text-white text-sm font-medium hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                        >
                            {isPending ? 'Sending...' : 'Send reset link'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}

export default ForgotPasswordModal
