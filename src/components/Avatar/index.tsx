interface AvatarProps {
    username?: string | null
    imageUrl?: string | null
    size?: number
    className?: string
}

const Avatar = ({ username, imageUrl, size = 48, className = '' }: AvatarProps) => {
    const initial = username?.[0]?.toUpperCase() ?? '?'

    return (
        <div
            className={`shrink-0 rounded-full overflow-hidden flex items-center justify-center bg-accent-gradient ring-1 ring-white/10 ${className}`}
            style={{ width: size, height: size }}
        >
            {imageUrl
                ? <img src={imageUrl} alt={username ?? 'avatar'} className="w-full h-full object-cover" />
                : <span className="font-semibold text-white" style={{ fontSize: size * 0.4 }}>{initial}</span>
            }
        </div>
    )
}

export default Avatar
