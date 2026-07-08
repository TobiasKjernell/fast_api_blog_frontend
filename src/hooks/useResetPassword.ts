import { useMutation } from "@tanstack/react-query"
import { resetPassword } from "../services/apiCalls"

export const useResetPassword = () => {
    const { mutate, mutateAsync, isPending, isSuccess, error } = useMutation({
        mutationFn: ({ token, new_password }: { token: string, new_password: string }) => resetPassword(token, new_password)
    })
    return { mutate, mutateAsync, isPending, isSuccess, error }
}
