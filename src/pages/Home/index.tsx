import { useGetPosts } from "../../hooks/useGetPosts";
import PostCard from "../../components/PostCard";
import Sidebar from "../../components/Sidebar";
import Spinner from "../../components/Spinner";

const Home = () => {
    const { data, error, isPending } = useGetPosts()

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

                    {data && data.length === 0 && (
                        <div className="card rounded-2xl p-10 text-center text-ink-muted">
                            No posts yet. Be the first to write something.
                        </div>
                    )}

                    {data?.map((item) => (
                        <PostCard
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            content={item.content}
                            datePosted={item.date_posted}
                            author={item.author}
                        />
                    ))}
                </div>

                <Sidebar />
            </div>
        </div>
    )
}

export default Home
