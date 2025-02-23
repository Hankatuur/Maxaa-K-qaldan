import {ID, Query} from 'appwrite';
import { INewUser } from "@/types";
import { account, appwriteConfig, avatars,  databases } from './config';

export async function createUseAccount (user:INewUser){
    try {
    const newAccount = await account.create(
     ID.unique(),
     user.email,
     user.password,
     user.name,
    );
    if(!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(user.name);
    const newUser = await saveUserToDB({
        accountId: newAccount.$id,
        name:newAccount.name,
        email:newAccount.email,
        username:user.username,
        imageUrl: avatarUrl,
    })

    return newUser;
        
    } catch (error) {
        console.log(error)
        return error;
    }
  
}
export async function saveUserToDB(user:{
    accountId:string;
    email:string;
    name:string;
    imageUrl:URL;
    username?:string;

}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user,
        )
        return newUser;
    } catch (error) {
        console.log(error)
    }
    
}

export async function  SigInAccount(user:{email:string;password:string;}){
 try {
    const session = await account.createEmailPasswordSession(user.email,user.password)
    return session;
 } catch (error) {
    console.error(" Log in error",error)
 }
}
// export async function SigInAccount(user: { email: string; password: string }) {
//     try {
//       // Check if a session already exists
//       const currentSession = await account.getSession("current");
  
//       if (currentSession) {
//         console.log("User is already logged in:", currentSession);
//         return currentSession; // Return the existing session
//       }
//     } catch (error) {
//       console.log("No active session found, proceeding to login...",error);
//     }
  
//     try {
//       // Create a new session only if no active session exists
//       const session = await account.createEmailPasswordSession(user.email, user.password);
//       return session;
//     } catch (error) {
//       console.error("Log in error:",error);
//   }
//   }

export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current");
        return session;
    } catch (error) {
        console.log(error);
    }
}




export async function getCurrentUser(){
    
    try {
        const currentAccount = await account.get();
        
        if(!currentAccount) throw Error;
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId',currentAccount.$id)]
        )
        if(!currentUser) throw Error;
        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}













// export async function  SigInAccount(user:{email:string;password:string;}){
//  try {
//     const session = await account.createEmailPasswordSession(user.email,user.password)
//     return session;
//  } catch (error) {
//     console.error(" Log in error",error)
//  }
// }
