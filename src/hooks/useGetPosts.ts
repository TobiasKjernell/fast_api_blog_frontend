import { useQuery } from "@tanstack/react-query"
import { getPosts } from "../services/apiCalls"

export const PAGE_SIZE = 10

export const useGetPosts = (page: number) => {
    const { data, error, isPending } = useQuery(
        {
            queryFn: () => getPosts(page * PAGE_SIZE, PAGE_SIZE),
            queryKey: ['posts', page],
            placeholderData: (previousData) => previousData
        }
    )

    return { data, error, isPending }
}
