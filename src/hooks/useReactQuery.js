import { useMutation, useQueryClient } from 'react-query'

export const useMutationCustom = (url, KEY, onError, onSuccess) => {
    const queryClient = useQueryClient()

    return useMutation(url, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(KEY)
            if (onSuccess) {
                onSuccess(data)
            }
        },

        onError: onError
    })
}
