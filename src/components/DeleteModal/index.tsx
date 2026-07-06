import { useEffect, useState } from "react"
import { useDeletePost } from "../../hooks/useDeletePost";

interface IDeleteModal {
    cancelDelete: React.Dispatch<React.SetStateAction<boolean>>
    post_id: number
}

const DeleteModal = ({ cancelDelete, post_id }: IDeleteModal) => {
    const [visible, setVisible] = useState(false)
    const { mutate, isPending, error } = useDeletePost();

    useEffect(() => {
        const id = requestAnimationFrame(() => setVisible(true))
        return () => cancelAnimationFrame(id)
    }, [])

    return (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
            <div
                className={`card w-full max-w-md rounded-2xl flex flex-col text-ink shadow-2xl shadow-black/50 transition-all duration-300 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            >
                <div className="flex justify-between items-center gap-4 w-full p-5 border-b border-border">
                    <div className="flex items-center gap-3">
                        <span className="size-9 rounded-full bg-danger-soft/15 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-danger">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                        </span>
                        <h2 className="text-lg font-semibold tracking-tight">Delete Post?</h2>
                    </div>
                    <button onClick={() => cancelDelete(false)} className="text-ink-faint hover:text-ink transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-5 border-b border-border">
                    <p className="text-ink-muted">Are you sure you want to delete this post? This action cannot be undone.</p>
                    {error && <p className="text-danger text-sm mt-3">{error.message}</p>}
                </div>

                <div className="flex gap-3 justify-end p-5">
                    <button
                        onClick={() => cancelDelete(false)}
                        className="px-4 py-2 rounded-lg border border-border-strong text-sm text-ink hover:bg-surface-hover transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={isPending}
                        className="px-4 py-2 rounded-lg bg-danger-soft text-white text-sm font-medium hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                        onClick={() => mutate(post_id)}
                    >
                        {isPending ? 'Deleting...' : 'Delete Post'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteModal
