import { useMutation } from "@tanstack/react-query"
import { forgotPassword } from "../services/apiCalls"

export const useForgotPassword = () => {
    const { mutate, mutateAsync, isPending, isSuccess, error } = useMutation({
        mutationFn: (email: string) => forgotPassword(email)
    })
    return { mutate, mutateAsync, isPending, isSuccess, error }
}
