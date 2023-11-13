import { useMutation, useQueryClient } from 'react-query'

export const useMutationCustom = (url, KEY, onError) => {
    const queryClient = useQueryClient()

    return useMutation(() => url, {
        onSuccess: () => {
            queryClient.invalidateQueries(KEY)
        },
        onError: onError
    })
}
