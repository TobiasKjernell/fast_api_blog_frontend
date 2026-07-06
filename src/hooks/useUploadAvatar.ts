import { useMutation } from "@tanstack/react-query"
import { uploadProfilePicture } from "../services/apiCalls"
import { useAuth } from "../context/AuthContext"

export const useUploadAvatar = () => {
    const { updateUser } = useAuth()
    const { mutate, isPending, error } = useMutation({
        mutationFn: ({ user_id, file }: { user_id: number, file: File }) => uploadProfilePicture(user_id, file),
        onSuccess: updateUser
    })
    return { mutate, isPending, error }
}
