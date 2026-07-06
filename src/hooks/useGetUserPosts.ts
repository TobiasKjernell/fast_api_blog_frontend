import { useQuery } from "@tanstack/react-query"
import { ApiError, getUserPosts } from "../services/apiCalls"

export const useGetUserPosts = (id: number) => {
    const { data, isPending, error } = useQuery(
        {
            queryFn: () => getUserPosts(id),
            queryKey: ['userPosts', id]
        }

    )
    const statusCode = error instanceof ApiError ? error.statusCode : null
    return { data, isPending, error, statusCode }
}