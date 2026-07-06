import { useMutation } from "@tanstack/react-query"
import { deleteProfilePicture } from "../services/apiCalls"
import { useAuth } from "../context/AuthContext"

export const useDeleteAvatar = () => {
    const { updateUser } = useAuth()
    const { mutate, isPending, error } = useMutation({
        mutationFn: (user_id: number) => deleteProfilePicture(user_id),
        onSuccess: updateUser
    })
    return { mutate, isPending, error }
}
