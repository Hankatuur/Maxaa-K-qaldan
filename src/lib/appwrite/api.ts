import {ID, Query} from 'appwrite';
import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appwriteConfig, avatars,  databases, storage } from './config';

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

export async function SigInAccount(user: { email: string; password: string }) {
    try {
      const session = await account.createEmailPasswordSession(user.email, user.password);
  
      return session;
    } catch (error) {
      console.log(error);
    }
  }

  export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      console.log(error);
    }
  }
  

  export async function getCurrentUser(){
    
    try {
        const currentAccount = await account.get();
        
        if(!currentAccount) throw Error ("no account");
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


export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current");
        return session;
    } catch (error) {
        console.log(error);
    }
}



export async function createPost(post: INewPost) {
    try {
        // Upload the image to storage
        const UploadedFile = await uploadFile(post.file[0]);
        
        if (!UploadedFile) throw new Error("File upload failed");

        // Get file URL
        const fileUrl = await getFilePreview(UploadedFile.$id);
        console.log({fileUrl});
        if (!fileUrl) {
            await deleteFile(UploadedFile.$id);
            throw new Error("Failed to generate file preview");
        }

        // Convert tags into an array
        const tags = post.tags?.replace(/ /g, '').split(",") || [];

        // Save post to database
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: UploadedFile.$id,
                location: post.location,
                tags: tags
            }
        );

        if (!newPost) {
            await deleteFile(UploadedFile.$id);
            throw new Error("Post creation failed");
        }

        return newPost;
    } catch (error) {
        console.error("CreatePost Error:",error);
}
}

 // This function had error
// export async function CreatePost(post:INewPost){
//     try {
//         // upload the image to the storage
//         const UploadedFile = await uploadFile(post.file[0]);
//         if(! UploadedFile) throw Error;
//         // get file url
//         const fileUrl  = getFilePreview(UploadedFile.$id);
//         if(!fileUrl) {
//             deleteFile(UploadedFile.$id);
//             throw Error;
//             // convert tags into array
//             const tags = post.tags?.replace(/ /g,'').split(",")||[];

//             // save post to database
//             const newPost = await databases.createDocument(
//                 appwriteConfig.databaseId,
//                 appwriteConfig.postCollectionId,
//                 ID.unique(),
//                 {
//                     creator: post.userId,
//                     caption: post.caption,
//                     imageUrl: fileUrl,
//                     imageId: UploadedFile.$id,
//                     location: post.location,
//                     tags:tags
//                 }
//               )
//               if(!newPost) {
//                 await deleteFile(UploadedFile.$id);
//                 throw Error;
//               }
//               return newPost;

//         }
//     } catch (error) {
//         console.log(error)
//     }
//      }
    
     export async function uploadFile(file:File){
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
           ID.unique(),
           file
        );
        return uploadedFile;
    } catch (error) {
        console.log(error)
    }
     }
    
     export async function getFilePreview(fileId:string){
    try {
        const fileUrl = await storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
             "top",
            100
    
        );
        return fileUrl;
    } catch (error) {
        console.log(error)
    }
     }
    
     export async function  deleteFile(fileId:string){
    try {
        await storage.deleteFile(appwriteConfig.storageId,fileId);
        return {status:"success"}
    } catch (error) {
        console.log(error);
    }
     }

     export async function getRecentPosts(){
        const posts  = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.orderDesc('$createdAt'), Query.limit(20)]
        )
        if(!posts) throw Error;
        return posts;
     }

     export async function LikePost( postId:string,likesArray:string[]){
       try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                likes:likesArray
            }

        )
      if(!updatedPost) throw Error;
       return updatedPost;

       } catch (error) {
        console.log (error)
       }
     }


     export async function SavePost( postId:string,userId:string){
       try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.saveCollectionId,
            ID.unique(),
            {
                user:userId,
                post:postId,
            }

        )
      if(!updatedPost) throw Error;
       return updatedPost;

       } catch (error) {
        console.log (error)
       }
     }


     export async function DeleteSavedPost(savedRecordId:string){
       try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.saveCollectionId,
            savedRecordId,

        )
      if(!statusCode) throw Error;
       return{status:'ok'};

       } catch (error) {
        console.log (error)
       }
     }

    export async function getPostById(postId:string){
   try {
      const post = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        postId
      )
      return post;
    
   } catch (error) {
     console.log(error);
   }
    }
     



    export async function UpdatePost(post: IUpdatePost) {
        const hasFileToUpdate = post.file.length > 0;

        try {
            let image = {
                imageUrl: post.imageUrl,
                imageId: post.imageId,
            }
            if(hasFileToUpdate) {
                // Upload the image to storage
                const UploadedFile = await uploadFile(post.file[0]);
                if (!UploadedFile) throw new Error("File upload failed");
                 // Get file URL
            const fileUrl = await getFilePreview(UploadedFile.$id);
            if (!fileUrl) {
                await deleteFile(UploadedFile.$id);
                throw new Error("Failed to generate file preview");
            }
            image = {...image, imageUrl:fileUrl,imageId:UploadedFile.$id}
            
            }
    
            // Convert tags into an array
            const tags = post.tags?.replace(/ /g, '').split(",") || [];
    
            // Save post to database
            const UpdatedPost = await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.postCollectionId,
                post.postId,
                {
                   
                    caption: post.caption,
                    imageUrl: image.imageUrl,
                    imageId: image.imageId,
                    location: post.location,
                    tags: tags
                }
            );
    
            if (!UpdatedPost) {
                await deleteFile(post.imageId);
                throw new Error("Post creation failed");
            }
    
            return UpdatedPost;
        } catch (error) {
            console.error("CreatePost Error:",error);
    }
    }
    export async function deletePost(postId:string,imageId:string){
        if(!postId || imageId) throw Error;
        try {
            await databases.deleteDocument(
                appwriteConfig.databaseId,
                appwriteConfig.postCollectionId,
                postId
            )
            return {status:'ok'}
        } catch (error) {
        console.log(error)
        }
    }









