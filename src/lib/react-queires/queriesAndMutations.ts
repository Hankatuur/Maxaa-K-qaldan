import { useQuery,useMutation,useQueryClient,useInfiniteQuery} from '@tanstack/react-query'
import { createUseAccount, SigInAccount, signOutAccount } from '../appwrite/api'
import { INewUser } from '@/types'
// this is for creating user for my app
 export const useCreateUserAccount = () => {
     return useMutation({
        mutationFn: (user:INewUser) => createUseAccount(user)
     })
 }
// this is for signing into my  Account in app 
 export const  useSigInAccount = () => {
     return useMutation({
        mutationFn: (user:{email:string; password:string;}) => SigInAccount(user)
     })
 }
 export const  useSignOutAccount = () => {
     return useMutation({
        mutationFn:signOutAccount
     })
 }
 
