
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import AuthProvider from './context/AuthContext.tsx'
// import { QueryProvider } from './lib/react-queires/QueryProvider.tsx'


createRoot(document.getElementById('root')!).render(
  
    <BrowserRouter>
     {/* <QueryProvider> */}
      <AuthProvider>
        <App />
      </AuthProvider>
      {/* </QueryProvider> */}
  </BrowserRouter>

)

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactNode } from "react";

// const queryClient = new QueryClient();

// interface QueryProviderProps {
//   children: ReactNode;
// }

// export const QueryProvider = ({ children }: QueryProviderProps) => {
//   return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
// };
