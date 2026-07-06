import { useMutation } from "@tanstack/react-query"
import { deletePosts } from "../services/apiCalls"
import { useNavigate } from "react-router"

export const useDeletePost = () => {
    const navigate = useNavigate();
    const {mutate, isPending, error } = useMutation(
        {
            mutationFn: deletePosts,
            onSuccess: () => navigate('/'),
        }

    )
    return { isPending, error, mutate }
}