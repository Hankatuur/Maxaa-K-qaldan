import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"
const queryClient = new QueryClient();
 export const QueryProvider = ({childern}:{childern:ReactNode}) => {
  return (
    <QueryClientProvider client={queryClient}>
     {childern}
    </QueryClientProvider>
  )
}

