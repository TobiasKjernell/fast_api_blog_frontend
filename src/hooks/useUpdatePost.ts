import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updatePost, type IUpdatePost } from "../services/apiCalls"

export const useUpdatePost = (post_id: number) => {
    const client = useQueryClient()
    const { mutate, isPending, error } = useMutation({
        mutationFn: (data: IUpdatePost) => updatePost(post_id, data),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['post', post_id] })
            client.invalidateQueries({ queryKey: ['posts'] })
            client.invalidateQueries({ queryKey: ['userPosts'] })
        }
    })
    return { mutate, isPending, error }
}
