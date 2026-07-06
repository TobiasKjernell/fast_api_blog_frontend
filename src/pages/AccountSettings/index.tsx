import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { useUploadAvatar } from '../../hooks/useUploadAvatar'
import { useDeleteAvatar } from '../../hooks/useDeleteAvatar'
import { API } from '../../services/apiCalls'
import Sidebar from '../../components/Sidebar'

interface InfoForm {
    username: string
    email: string
}

interface PasswordForm {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

const inputClass = "p-2.5 rounded-lg bg-surface-2 border border-border text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 transition-colors"
const labelClass = "text-ink-muted text-sm font-medium"

const AccountSettings = () => {
    const { user } = useAuth()
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const uploadAvatar = useUploadAvatar()
    const deleteAvatar = useDeleteAvatar()

    const infoForm = useForm<InfoForm>({
        defaultValues: { username: user?.username ?? '', email: user?.email ?? '' }
    })

    const passwordForm = useForm<PasswordForm>()

    const onUpdateInfo = (data: InfoForm) => {
        // TODO: wire up to backend
        console.log('update info', data)
    }

    const onChangePassword = (data: PasswordForm) => {
        // TODO: wire up to backend
        console.log('change password', data)
    }

    const clearAvatarSelection = () => {
        setAvatarPreview(null)
        setSelectedFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setSelectedFile(file)
        setAvatarPreview(URL.createObjectURL(file))
    }

    const onUploadAvatar = () => {
        if (!user || !selectedFile) return
        uploadAvatar.mutate(
            { user_id: user.id, file: selectedFile },
            { onSuccess: clearAvatarSelection }
        )
    }

    const onRemoveAvatar = () => {
        if (selectedFile) {
            clearAvatarSelection()
            return
        }
        if (user?.image_file) {
            deleteAvatar.mutate(user.id)
        }
    }

    const currentAvatarUrl = user?.image_file ? `${API}${user.image_path}` : null
    const avatarSrc = avatarPreview ?? currentAvatarUrl

    return (
        <div className="max-w-6xl w-full mx-auto px-6 lg:px-10 py-10 flex flex-col gap-8">
            <div>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">Account Settings</h1>
                <p className="text-ink-muted mt-2">Manage your profile, avatar, and security preferences.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex-1 min-w-0 flex flex-col gap-6">

                    {/* Profile picture */}
                    <div className="card rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <div
                            className="size-24 rounded-full flex items-center justify-center overflow-hidden cursor-pointer bg-accent-gradient ring-2 ring-white/10 shrink-0 hover:ring-accent transition-all"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {avatarSrc
                                ? <img src={avatarSrc} alt="avatar preview" className="w-full h-full object-cover" />
                                : <p className="text-3xl font-semibold text-white">{user?.username?.[0]?.toUpperCase() ?? '?'}</p>
                            }
                        </div>

                        <div className="flex flex-col gap-3 items-center sm:items-start text-center sm:text-left">
                            <div>
                                <h2 className="text-ink text-lg font-semibold">Profile Picture</h2>
                                <p className="text-ink-muted text-sm mt-0.5">JPG or PNG, works best square.</p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={onAvatarChange}
                            />
                            <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border border-border-strong text-ink text-sm px-3.5 py-2 rounded-lg cursor-pointer hover:bg-surface-hover transition-colors"
                                >
                                    Choose image
                                </button>
                                <button
                                    type="button"
                                    onClick={onUploadAvatar}
                                    disabled={!selectedFile || uploadAvatar.isPending}
                                    className="bg-accent-gradient text-white text-sm px-3.5 py-2 rounded-lg cursor-pointer hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    {uploadAvatar.isPending ? 'Uploading...' : 'Upload'}
                                </button>
                                <button
                                    type="button"
                                    onClick={onRemoveAvatar}
                                    disabled={(!selectedFile && !user?.image_file) || deleteAvatar.isPending}
                                    className="border border-danger-soft/40 text-danger text-sm px-3.5 py-2 rounded-lg cursor-pointer hover:bg-danger-soft/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    {deleteAvatar.isPending ? 'Removing...' : 'Remove'}
                                </button>
                            </div>
                            {uploadAvatar.error && <p className="text-danger text-sm">{uploadAvatar.error.message}</p>}
                            {deleteAvatar.error && <p className="text-danger text-sm">{deleteAvatar.error.message}</p>}
                        </div>
                    </div>

                    {/* Account info */}
                    <div className="card rounded-2xl p-6 sm:p-8">
                        <h2 className="text-ink text-lg font-semibold mb-5">Account Info</h2>
                        <form onSubmit={infoForm.handleSubmit(onUpdateInfo)} className="flex flex-col gap-4">
                            {infoForm.formState.errors.root && (
                                <p className="text-danger text-sm bg-danger-soft/10 border border-danger-soft/30 rounded-lg px-3 py-2">{infoForm.formState.errors.root.message}</p>
                            )}
                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>Username</label>
                                <input {...infoForm.register('username', { required: 'Required' })} className={inputClass} />
                                {infoForm.formState.errors.username && <p className="text-danger text-sm">{infoForm.formState.errors.username.message}</p>}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>Email</label>
                                <input type="email" {...infoForm.register('email', { required: 'Required' })} className={inputClass} />
                                {infoForm.formState.errors.email && <p className="text-danger text-sm">{infoForm.formState.errors.email.message}</p>}
                            </div>
                            <button
                                type="submit"
                                disabled={infoForm.formState.isSubmitting}
                                className="self-start mt-1 bg-accent-gradient text-white text-sm font-medium px-4 py-2.5 rounded-lg cursor-pointer hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>

                    {/* Change password */}
                    <div className="card rounded-2xl p-6 sm:p-8">
                        <h2 className="text-ink text-lg font-semibold mb-5">Change Password</h2>
                        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="flex flex-col gap-4">
                            {passwordForm.formState.errors.root && (
                                <p className="text-danger text-sm bg-danger-soft/10 border border-danger-soft/30 rounded-lg px-3 py-2">{passwordForm.formState.errors.root.message}</p>
                            )}
                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>Current Password</label>
                                <input
                                    type="password"
                                    {...passwordForm.register('currentPassword', { required: 'Required' })}
                                    className={inputClass}
                                    autoComplete="current-password"
                                />
                                {passwordForm.formState.errors.currentPassword && <p className="text-danger text-sm">{passwordForm.formState.errors.currentPassword.message}</p>}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>New Password</label>
                                <input
                                    type="password"
                                    {...passwordForm.register('newPassword', { required: 'Required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                                    className={inputClass}
                                    autoComplete="new-password"
                                />
                                {passwordForm.formState.errors.newPassword && <p className="text-danger text-sm">{passwordForm.formState.errors.newPassword.message}</p>}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>Confirm New Password</label>
                                <input
                                    type="password"
                                    {...passwordForm.register('confirmPassword', {
                                        required: 'Required',
                                        validate: (val) => val === passwordForm.watch('newPassword') || 'Passwords do not match'
                                    })}
                                    className={inputClass}
                                    autoComplete="new-password"
                                />
                                {passwordForm.formState.errors.confirmPassword && <p className="text-danger text-sm">{passwordForm.formState.errors.confirmPassword.message}</p>}
                            </div>
                            <button
                                type="submit"
                                disabled={passwordForm.formState.isSubmitting}
                                className="self-start mt-1 bg-accent-gradient text-white text-sm font-medium px-4 py-2.5 rounded-lg cursor-pointer hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Update Password
                            </button>
                        </form>
                    </div>

                </div>

                <Sidebar />
            </div>
        </div>
    )
}

export default AccountSettings
