import type { ReactNode } from "react"
import { Link } from "react-router"
import Avatar from "../Avatar"
import { formatDate } from "../../helpers/helpers"
import { API } from "../../services/apiCalls"

interface Author {
    id: number
    username: string
    image_file: string
    image_path: string
}

interface PostCardProps {
    id: number
    title: string
    content: string
    datePosted: string
    author: Author
    linkAuthor?: boolean
    linkTitle?: boolean
    actions?: ReactNode
}

const PostCard = ({ id, title, content, datePosted, author, linkAuthor = true, linkTitle = true, actions }: PostCardProps) => {
    const avatarUrl = author.image_file ? `${API}${author.image_path}` : null

    return (
        <article className="card rounded-2xl p-5 sm:p-6 hover:border-border-strong transition-colors">
            <div className="flex items-center gap-3 mb-4">
                <Avatar username={author.username} imageUrl={avatarUrl} size={40} />
                <div className="flex flex-col leading-tight">
                    {linkAuthor ? (
                        <Link to={`/users/${author.id}/posts`} className="text-sm font-medium text-ink hover:text-accent-soft transition-colors">
                            {author.username}
                        </Link>
                    ) : (
                        <span className="text-sm font-medium text-ink">{author.username}</span>
                    )}
                    <span className="text-xs text-ink-faint">{formatDate(datePosted)}</span>
                </div>
            </div>

            {linkTitle ? (
                <Link to={`/posts/${id}`} className="block group">
                    <h2 className="text-2xl font-semibold text-ink tracking-tight group-hover:text-accent-soft transition-colors">{title}</h2>
                    <p className="text-ink-muted mt-2 leading-relaxed line-clamp-3">{content}</p>
                </Link>
            ) : (
                <div>
                    <h2 className="text-2xl font-semibold text-ink tracking-tight">{title}</h2>
                    <p className="text-ink-muted mt-2 leading-relaxed">{content}</p>
                </div>
            )}

            {actions && <div className="mt-5 pt-5 border-t border-border flex gap-3">{actions}</div>}
        </article>
    )
}

export default PostCard
