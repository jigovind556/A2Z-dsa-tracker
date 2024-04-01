import { createContext, useContext } from 'react'

export const LoadingContext = createContext({
    loading: true,
    setLoading: () => {},
})

export const LoadingProvider = LoadingContext.Provider

export default function useLoading() {
    return useContext(LoadingContext)
}
