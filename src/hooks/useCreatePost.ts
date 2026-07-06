import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPost } from "../services/apiCalls"

export const useCreatePost = () => {
    const client = useQueryClient();
    const {mutate, isPending, error } = useMutation(
        {
            mutationFn: createPost,
            onSuccess: () => client.invalidateQueries({
                queryKey: ['posts']
            })
        }

    )
    return { isPending, error, mutate }
}