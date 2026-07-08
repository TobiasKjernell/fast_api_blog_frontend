import { useState } from "react"
import { Link, useNavigate } from "react-router"
import CreatePostModal from "../CreatePostModal"
import { useAuth } from "../../context/AuthContext"
import Avatar from "../Avatar"
import { API } from "../../services/apiCalls"

const Header = () => {
    const [createPostVisible, setCreatePostVisible] = useState<boolean>(false)
    const { isAuthenticated, user, logout } = useAuth()
    const navigate = useNavigate()

    return (
        <header className="sticky top-0 z-20 glass border-b border-border">
            {createPostVisible && <CreatePostModal toggleOffModal={() => setCreatePostVisible(false)} />}

            <div className="max-w-6xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <span className="size-8 rounded-lg bg-accent-gradient flex items-center justify-center shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="size-4.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                            </svg>
                        </span>
                        <span className="text-lg font-semibold tracking-tight text-ink">
                            FastAPI <span className="text-accent-gradient">Blog</span>
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-ink-muted">
                        <Link to="/" className="hover:text-ink transition-colors">Home</Link>
                        {isAuthenticated && (
                            <Link to={`/users/${user?.id}/posts`} className="hover:text-ink transition-colors">My Posts</Link>
                        )}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            <button
                                onClick={() => setCreatePostVisible(true)}
                                className="hidden sm:inline-flex items-center gap-1.5 bg-accent-gradient text-white text-sm font-medium px-3.5 py-2 rounded-lg cursor-pointer hover:brightness-110 active:brightness-95 transition-all shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset]"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                New Post
                            </button>

                            <div className="w-px h-6 bg-border mx-1 hidden sm:block" />

                            <Link to="/account" className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full hover:bg-surface-hover transition-colors">
                                <Avatar
                                    username={user?.username}
                                    imageUrl={user?.image_file ? `${API}${user.image_path}` : null}
                                    size={30}
                                />
                                <span className="text-sm font-medium text-ink hidden sm:inline">{user?.username}</span>
                            </Link>

                            <button
                                onClick={() => { logout(); navigate('/login', { replace: true }) }}
                                className="text-sm font-medium text-ink-muted hover:text-ink px-3 py-2 rounded-lg cursor-pointer transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm font-medium text-ink-muted hover:text-ink px-3 py-2 rounded-lg transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="text-sm font-medium bg-accent-gradient text-white px-4 py-2 rounded-lg hover:brightness-110 active:brightness-95 transition-all"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
