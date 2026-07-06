import { useParams } from "react-router";
import { useGetUserPosts } from "../../hooks/useGetUserPosts";
import { useState } from "react";
import DeleteModal from "../../components/DeleteModal";
import EditPostModal from "../../components/EditPostModal";
import { useAuth } from "../../context/AuthContext";
import PostCard from "../../components/PostCard";
import Sidebar from "../../components/Sidebar";
import Spinner from "../../components/Spinner";
import Avatar from "../../components/Avatar";
import { API } from "../../services/apiCalls";

const UserPosts = () => {

    const { user_id } = useParams()
    const { data, error, isPending, statusCode } = useGetUserPosts(Number(user_id))
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [currentPostDel, setCurrentPostDel] = useState<number>()
    const [editingPost, setEditingPost] = useState<{ id: number, title: string, content: string } | null>(null)
    const { user } = useAuth()

    const author = data?.[0]?.author
    const isOwnProfile = user?.id === Number(user_id)

    return (
        <div className="max-w-6xl w-full mx-auto px-6 lg:px-10 py-10 flex flex-col gap-8">
            {showDeleteModal && <DeleteModal cancelDelete={setShowDeleteModal} post_id={Number(currentPostDel)} />}
            {editingPost && (
                <EditPostModal
                    postId={editingPost.id}
                    initialTitle={editingPost.title}
                    initialContent={editingPost.content}
                    toggleOffModal={() => setEditingPost(null)}
                />
            )}

            {isPending && (
                <div className="flex flex-col items-center justify-center gap-4 py-24 text-ink-muted flex-1">
                    <Spinner size={36} />
                    <p>Loading profile…</p>
                </div>
            )}

            {error && (
                <div className="flex items-center justify-center flex-1 py-24">
                    <h1 className="text-2xl text-ink-muted">{statusCode === 404 ? "This user doesn't exist" : error.message}</h1>
                </div>
            )}

            {data && (
                <>
                    <div className="card rounded-2xl p-6 sm:p-8 flex items-center gap-5">
                        <Avatar
                            username={author?.username}
                            imageUrl={author?.image_file ? `${API}${author.image_path}` : null}
                            size={72}
                        />
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
                                {author?.username ?? "This user"}{isOwnProfile ? "'s posts (you)" : "'s posts"}
                            </h1>
                            <p className="text-ink-muted mt-1">
                                {data.length} {data.length === 1 ? "post" : "posts"} published
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        <div className="flex-1 min-w-0 flex flex-col gap-5">
                            {data.length === 0 && (
                                <div className="card rounded-2xl p-10 text-center text-ink-muted">
                                    No posts published yet.
                                </div>
                            )}

                            {data.map((post) => (
                                <PostCard
                                    key={post.id}
                                    id={post.id}
                                    title={post.title}
                                    content={post.content}
                                    datePosted={post.date_posted}
                                    author={post.author}
                                    linkAuthor={false}
                                    actions={user?.id === post.user_id ? (
                                        <>
                                            <button
                                                className="px-3.5 py-1.5 rounded-lg border border-border-strong text-sm text-ink hover:bg-surface-hover transition-colors cursor-pointer"
                                                onClick={() => setEditingPost({ id: post.id, title: post.title, content: post.content })}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="px-3.5 py-1.5 rounded-lg border border-danger-soft/40 text-sm text-danger hover:bg-danger-soft/10 transition-colors cursor-pointer"
                                                onClick={() => { setCurrentPostDel(post.id); setShowDeleteModal(true) }}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    ) : undefined}
                                />
                            ))}
                        </div>

                        <Sidebar />
                    </div>
                </>
            )}
        </div>
    )

}
export default UserPosts;
