import { useQuery } from "@tanstack/react-query"
import { ApiError, getPost } from "../services/apiCalls"

export const useGetPost = (id: number) => {
    const { data, isPending, error } = useQuery(
        {
            queryFn: () => getPost(id),
            queryKey: ['post', id]
        }

    )
    const statusCode = error instanceof ApiError ? error.statusCode : null
    return { data, isPending, error, statusCode }
}