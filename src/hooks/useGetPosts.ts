import { useQuery } from "@tanstack/react-query"
import { getPosts } from "../services/apiCalls"

export const useGetPosts = () => {
    const { data, isPending, error } = useQuery(
        {
            queryFn: getPosts,
            queryKey: ['posts']
        }

    )
    return { data, isPending, error }
}