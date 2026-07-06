import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createPost } from "../../services/apiCalls";
import { useAuth } from "../../context/AuthContext";

interface IDeleteModal {
    toggleOffModal: () => void
}

const inputClass = "w-full px-3.5 py-2.5 rounded-lg bg-surface-2 border border-border text-ink placeholder:text-ink-faint outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 transition-colors"

const CreatePostModal = ({ toggleOffModal }: IDeleteModal) => {
    const [visible, setVisible] = useState(false)
    const { register, handleSubmit } = useForm()
    const { user } = useAuth()
    const client = useQueryClient()
    const { mutate, isPending } = useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            client.invalidateQueries({
                queryKey: ['posts']
            })
            client.invalidateQueries({
                queryKey: ['userPosts', user?.id]
            })
            toggleOffModal()
        }
    });

    useEffect(() => {
        const id = requestAnimationFrame(() => setVisible(true))
        return () => cancelAnimationFrame(id)
    }, [])

    return (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
            <form
                onSubmit={handleSubmit((data) => mutate({
                    title: data.title,
                    content: data.content,
                    user_id: user!.id
                }))}
                className={`card w-full max-w-lg rounded-2xl flex flex-col text-ink shadow-2xl shadow-black/50 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
            >
                <div className="flex justify-between items-center w-full p-5 border-b border-border">
                    <h2 className="text-xl font-semibold tracking-tight">Create Post</h2>
                    <button type="button" onClick={toggleOffModal} className="text-ink-faint hover:text-ink transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-5 flex flex-col gap-4">
                    <input {...register("title")} className={inputClass} placeholder="Post title" />
                    <textarea {...register("content")} className={`${inputClass} h-40 resize-none`} defaultValue={'Content here'} />
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
                        {isPending ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreatePostModal
