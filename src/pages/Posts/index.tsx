import { Link, useParams } from "react-router";
import { formatDate } from "../../helpers/helpers";
import { useGetPost } from "../../hooks/useGetPost";
import DeleteModal from "../../components/DeleteModal";
import EditPostModal from "../../components/EditPostModal";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import Spinner from "../../components/Spinner";
import Avatar from "../../components/Avatar";
import { API } from "../../services/apiCalls";

const Posts = () => {

    const { id } = useParams()
    const { data, error, isPending, statusCode } = useGetPost(Number(id))
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const { user } = useAuth();

    return (
        <div className="max-w-6xl w-full mx-auto px-6 lg:px-10 py-10 flex flex-col gap-8 flex-1">
            {showDeleteModal && <DeleteModal cancelDelete={setShowDeleteModal} post_id={Number(id)} />}
            {showEditModal && data && (
                <EditPostModal
                    postId={data.id}
                    initialTitle={data.title}
                    initialContent={data.content}
                    toggleOffModal={() => setShowEditModal(false)}
                />
            )}

            {isPending && (
                <div className="flex flex-col items-center justify-center gap-4 flex-1 text-ink-muted">
                    <Spinner size={40} />
                    <p className="text-lg">Fetching post…</p>
                </div>
            )}

            {error && (
                <div className="flex items-center justify-center flex-1">
                    <h1 className="text-2xl text-ink-muted">{statusCode === 404 ? "This post doesn't exist" : error.message}</h1>
                </div>
            )}

            {data && (
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <article className="flex-1 min-w-0 card rounded-2xl p-6 sm:p-10">
                        <div className="flex items-center gap-3 mb-6">
                            <Avatar
                                username={data.author.username}
                                imageUrl={data.author.image_file ? `${API}${data.author.image_path}` : null}
                                size={44}
                            />
                            <div className="flex flex-col leading-tight">
                                <Link to={`/users/${data.user_id}/posts`} className="text-sm font-medium text-ink hover:text-accent-soft transition-colors">
                                    {data.author.username}
                                </Link>
                                <span className="text-xs text-ink-faint">{formatDate(data.date_posted)}</span>
                            </div>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">{data.title}</h1>
                        <p className="text-ink-muted text-lg mt-4 leading-relaxed whitespace-pre-wrap">{data.content}</p>

                        {user?.id === data.user_id && (
                            <div className="mt-8 pt-6 border-t border-border flex gap-3">
                                <button
                                    className="px-4 py-2 rounded-lg border border-border-strong text-sm text-ink hover:bg-surface-hover transition-colors cursor-pointer"
                                    onClick={() => setShowEditModal(true)}
                                >
                                    Edit Post
                                </button>
                                <button
                                    className="px-4 py-2 rounded-lg border border-danger-soft/40 text-sm text-danger hover:bg-danger-soft/10 transition-colors cursor-pointer"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    Delete Post
                                </button>
                            </div>
                        )}
                    </article>

                    <Sidebar />
                </div>
            )}
        </div>
    )

}
export default Posts;
