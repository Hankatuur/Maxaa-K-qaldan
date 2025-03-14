import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"
import { Input } from "../ui/input"
import { PostValidation } from "@/lib/Validations"
import { Models } from "appwrite"
import { useUserContext } from "@/context/AuthContext"
import { useCreatePost, useUpdatePost } from "@/lib/react-queires/queriesAndMutations"
import {  useToast } from "@/hooks/use-toast"

type PostFormProps = {
    post ?: Models.Document;
    action : 'Create' | 'Update';
}

const Postform = ({post,action}:PostFormProps) => {
  const {mutateAsync: CREATEPOSTS ,isPending:isLoadingCreate} = useCreatePost();
// const {mutateAsync : createPost,isPending:isLoadingCreate} = useCreatePost();
const {mutateAsync : UpdatePost,isPending:isLoadingUpdate} = useUpdatePost ();

const {user} = useUserContext();
const {toast} = useToast();
const navigate = useNavigate();

     // 1. Define your form.
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption: "",
      file :[],
      location: post ? post?.location: "",
      tags: post ? post?.tags.join(','): '',

    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {
    if(post && action === 'Update'){
       const updatedPost = await UpdatePost({
          ...values,
          postId: post.$id,
          imageId: post?.imageId,
           imageUrl: post?.imageUrl,
       })
       if(!updatedPost) {
         toast({
          title : "please try again"
         })
       }
       navigate(`/post/${post.$id}`);
    }
    const newPost = await CREATEPOSTS({
      ...values,
      userId: user.id,
    })
    if(!newPost) {
      toast({
        title:'Please try Again'
      })
    }
    navigate('/');
    
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-9 w-full max-w-5xl ">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea custom-scrollbar" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
             <FileUploader 
             fieldChange={field.onChange} 
             mediaUrl={post?.imageUrl} 
             />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
             <Input type="text" className="shad-input" {...field}  />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Tags 
                (separated by comma ",")</FormLabel>
              <FormControl>
             <Input type="text"
              className="shad-input" 
              placeholder="Art Expression,Learn,"
              {...field}  />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end"> 
        <Button type="button" className="shad-button_dark_4">Cancel</Button>
        <Button type="submit" 
        className="shad-button_primary 
        whitespace-nowrap" disabled ={isLoadingCreate || isLoadingUpdate}>
           {isLoadingCreate || isLoadingUpdate && 'Loading...'}
           {action} post
          </Button>
        </div>
        
      </form>
    </Form>
  )
}

export default Postform