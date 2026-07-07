import { useState } from "react";
import { useGetPosts } from "../../hooks/useGetPosts";
import PostCard from "../../components/PostCard";
import Sidebar from "../../components/Sidebar";
import Spinner from "../../components/Spinner";

const Home = () => {
    const [page, setPage] = useState(0)
    const { data, error, isPending } = useGetPosts(page)

    const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1

    return (
        <div className="max-w-6xl w-full mx-auto px-6 lg:px-10 py-10 flex flex-col gap-8">
            <div>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">Latest from the community</h1>
                <p className="text-ink-muted mt-2">Fresh writing from everyone on the platform, newest first.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex-1 min-w-0 flex flex-col gap-5">
                    {isPending && (
                        <div className="flex flex-col items-center justify-center gap-4 py-24 text-ink-muted">
                            <Spinner size={36} />
                            <p>Loading posts…</p>
                        </div>
                    )}

                    {error && (
                        <div className="card rounded-2xl p-8 text-center text-danger">{error.message}</div>
                    )}

                    {data && data.posts.length === 0 && (
                        <div className="card rounded-2xl p-10 text-center text-ink-muted">
                            No posts yet. Be the first to write something.
                        </div>
                    )}

                    {data?.posts.map((item) => (
                        <PostCard
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            content={item.content}
                            datePosted={item.date_posted}
                            author={item.author}
                        />
                    ))}

                    {data && totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="px-4 py-2 rounded-lg font-medium text-ink-muted hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            >
                                Back
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i).map((pageNumber) => (
                                <button
                                    key={pageNumber}
                                    type="button"
                                    onClick={() => setPage(pageNumber)}
                                    className={
                                        pageNumber === page
                                            ? "px-3.5 py-2 rounded-lg font-medium bg-accent-gradient text-white cursor-pointer"
                                            : "px-3.5 py-2 rounded-lg font-medium text-ink-muted hover:text-ink cursor-pointer transition-colors"
                                    }
                                >
                                    {pageNumber + 1}
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1}
                                className="px-4 py-2 rounded-lg font-medium text-ink-muted hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

                <Sidebar />
            </div>
        </div>
    )
}

export default Home
