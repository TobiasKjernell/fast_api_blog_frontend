import { useMutation } from "@tanstack/react-query"
import { changePassword } from "../services/apiCalls"

export const useChangePassword = () => {
    const { mutate, mutateAsync, isPending, isSuccess, error, reset } = useMutation({
        mutationFn: ({ current_password, new_password }: { current_password: string, new_password: string }) =>
            changePassword(current_password, new_password)
    })
    return { mutate, mutateAsync, isPending, isSuccess, error, reset }
}
