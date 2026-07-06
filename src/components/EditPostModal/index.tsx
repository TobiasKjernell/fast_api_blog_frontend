import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useUpdatePost } from "../../hooks/useUpdatePost"

interface IEditPostModal {
    postId: number
    initialTitle: string
    initialContent: string
    toggleOffModal: () => void
}

interface EditForm {
    title: string
    content: string
}

const inputClass = "w-full px-3.5 py-2.5 rounded-lg bg-surface-2 border border-border text-ink placeholder:text-ink-faint outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 transition-colors"

const EditPostModal = ({ postId, initialTitle, initialContent, toggleOffModal }: IEditPostModal) => {
    const [visible, setVisible] = useState(false)
    const { register, handleSubmit } = useForm<EditForm>({
        defaultValues: { title: initialTitle, content: initialContent }
    })
    const { mutate, isPending, error } = useUpdatePost(postId)

    useEffect(() => {
        const id = requestAnimationFrame(() => setVisible(true))
        return () => cancelAnimationFrame(id)
    }, [])

    const onSubmit = (data: EditForm) => {
        mutate(data, { onSuccess: toggleOffModal })
    }

    return (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={`card w-full max-w-lg rounded-2xl flex flex-col text-ink shadow-2xl shadow-black/50 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
            >
                <div className="flex justify-between items-center w-full p-5 border-b border-border">
                    <h2 className="text-xl font-semibold tracking-tight">Edit Post</h2>
                    <button type="button" onClick={toggleOffModal} className="text-ink-faint hover:text-ink transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-5 flex flex-col gap-4">
                    {error && (
                        <p className="text-danger text-sm bg-danger-soft/10 border border-danger-soft/30 rounded-lg px-3 py-2">{error.message}</p>
                    )}
                    <input {...register("title", { required: true })} className={inputClass} placeholder="Post title" />
                    <textarea {...register("content", { required: true })} className={`${inputClass} h-40 resize-none`} />
                </div>

                <div className="flex gap-3 justify-end p-5 border-t border-border">
                    <button
                        type="button"
                        onClick={toggleOffModal}
                        className="px-4 py-2 rounded-lg border border-border-strong text-sm text-ink hover:bg-surface-hover transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={isPending}
                        className="px-4 py-2 rounded-lg bg-accent-gradient text-white text-sm font-medium hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                    >
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditPostModal
