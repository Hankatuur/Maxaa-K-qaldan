// Issues in Your Code
// checkAuthUser() is async, but you're not handling it properly

// Since checkAuthUser() is an async function, it should be awaited or handled with .then(), otherwise, it might not complete before rendering.
// You're checking cookieFallback from localStorage

// This is an Appwrite fallback, but it might not always be reliable.
// You should first call checkAuthUser(), then decide whether to redirect.

import { getCurrentUser } from '@/lib/appwrite/api';
import { IContextType, IUser } from '@/types'
import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const INITIAL_USER: IUser = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: '',
};
 
const INITIAL_STATE: IContextType = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false,
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
  
    const checkAuthUser = async () => {
        setIsLoading(true);
        try {
            const currentAccount = await getCurrentUser();
            console.log("Current Account:", currentAccount); // Debug log
           
            if (currentAccount) {
                setUser({
                    id: currentAccount.$id,
                    name: currentAccount.name,
                    username: currentAccount.username,
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl,
                    bio: currentAccount.bio,
                });
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error checking user:", error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(()=>{
        if(
            localStorage.getItem('cookieFallback') === null ||
            localStorage.getItem('cookieFallback') === '[]'
        ) navigate('/sign-in');
        checkAuthUser();
    },[])

    const value: IContextType = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser,
    };

    return( <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    )
};

export default AuthProvider;
export const useUserContext = () => useContext(AuthContext);







































// import { getCurrentUser } from '@/lib/appwrite/api';
// import { IContextType, IUser } from '@/types';
// import { createContext, useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// export const INITIAL_USER: IUser = {
//     id: '',
//     name: '',
//     username: '',
//     email: '',
//     imageUrl: '',
//     bio: '',
// };

// const INITIAL_STATE: IContextType = {
//     user: INITIAL_USER,
//     isLoading: false,
//     isAuthenticated: false,
//     setUser: () => {},
//     setIsAuthenticated: () => {},
//     checkAuthUser: async () => false,
// };

// const AuthContext = createContext<IContextType>(INITIAL_STATE);

// const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//     const [user, setUser] = useState<IUser>(INITIAL_USER);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const navigate = useNavigate();

//     const checkAuthUser = async () => {
//         try {
//             const currentAccount = await getCurrentUser();
//             console.log("✅ Current Account:", currentAccount);

//             if (currentAccount) {
//                 setUser({
//                     id: currentAccount.$id,
//                     name: currentAccount.name,
//                     username: currentAccount.username,
//                     email: currentAccount.email,
//                     imageUrl: currentAccount.imageUrl, // Keep imageUrl as requested
//                     bio: currentAccount.bio,
//                 });
//                 setIsAuthenticated(true);
//                 return true;
//             }
//         } catch (error) {
//             console.error("❌ Error fetching user:", error);
//         } finally {
//             setIsLoading(false);
//         }
//         return false;
//     };

//     useEffect(() => {
//         const fetchUser = async () => {
//             const isAuth = await checkAuthUser();
//             if (!isAuth) navigate('/sign-in');
//         };

//         fetchUser();
//     }, [navigate]);

//     const value: IContextType = {
//         user,
//         setUser,
//         isLoading,
//         isAuthenticated,
//         setIsAuthenticated,
//         checkAuthUser,
//     };

//     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export default AuthProvider;
// export const useUserContext = () => useContext(AuthContext);


















// import { getCurrentUser } from '@/lib/appwrite/api';
// import { IContextType, IUser } from '@/types'
// import {createContext,useContext,useEffect,useState} from 'react'
// import { useNavigate } from 'react-router-dom';

// export const INITIAL_USER = {
//     id:'',
//     name:'',
//     username:'',
//     email:'',
//     imageUrl:'',
//     bio:'',

// }
// const INITIAL_STATE = {
//     user: INITIAL_USER,
//     isLoading: false,
//     isAuthenticated:false,
//     setUser: () => {},
//     setIsAuthenticated: () => {},
//     checkAuthUser: async () => false as boolean,

// }
// const AuthContext = createContext<IContextType>(INITIAL_STATE);


// const AuthProvider = ({childern}:{childern:React.ReactNode}) => {
//     const [user,setUser] = useState<IUser>(INITIAL_USER);
//     const [isLoading, setIsLoading] = useState(false);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const navigate = useNavigate();
// const checkAuthUser = async () => {
//     try {
//         const currentAccount  = await getCurrentUser();
//         if(currentAccount) {
//             setUser({
//                 id: currentAccount.$id,
//                 name: currentAccount.name,
//                 username:currentAccount.username,
//                 email:currentAccount.email,
//                 imageUrl:currentAccount.imageUrl,
//                 bio:currentAccount.bio
//             })
//             setIsAuthenticated(true);
//             return true;
//         }
//         return false;
//     } catch (error) {
//         console.log(error);
//         return false;
//     } finally{
//         setIsLoading(false);
//     }
// };
// useEffect(()=> {
//     // localStorage.getItem('cookieFallback') === null
// if(localStorage.getItem('cookieFallback') === '[]' 
    
// ) navigate('/sign-in')
// checkAuthUser();
// },[]);

// const value = {
//     user,
//     setUser,
//     isLoading,
//     isAuthenticated,
//     setIsAuthenticated,
//     checkAuthUser,

// }
//   return (
//   <AuthContext.Provider value={value}>
//       {childern}
//   </AuthContext.Provider>
//   )
// }

// export default AuthProvider

// export const  useUserContext = () => useContext(AuthContext)