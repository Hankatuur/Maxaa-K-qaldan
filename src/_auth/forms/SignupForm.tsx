import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link,useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { SignupValidation } from "@/lib/Validations"
import { Loader } from "lucide-react"

import { useCreateUserAccount, useSigInAccount } from "@/lib/react-queires/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"




const SignupForm = () => {

  const { toast } = useToast()
  const {checkAuthUser,isLoading:isUserLoading} = useUserContext();
  const navigate = useNavigate();
  // Queries
  const { mutateAsync :createUseAccount, isPending: isCreatingAccount} = useCreateUserAccount();
  const {mutateAsync : SigInAccount,isPending:isSigningIn} = useSigInAccount();

    
    // 1. Define your form.
    const form = useForm<z.infer<typeof SignupValidation>>({
      resolver: zodResolver(SignupValidation),
      defaultValues: {
        name:'',
        username: '',
        email:'',
        password:'',
      },
    })
   
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof SignupValidation>) {
      // create new user
      const newUser = await createUseAccount(values);
      
     if(!newUser){
      toast({title:'Sign Up failed.!Please Try Again',});
        return;
     }
     const session = await SigInAccount ({
      email: values.email,
      password: values.password,

     })
     if(!session) {
       return toast({
        title: 'Sign Up Failed .Please Try Again!'});
     }
    
      const isLoggedIn = await checkAuthUser();
      if(!isLoggedIn){
        form.reset()
       navigate('/')
      }
      else{
         toast({title:'Sign Up failed.Please Try Again!'})
         
      } 
   
      return;

    }
  
  return (
    
      <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
       <img src="./assets/imges/logo.png" alt="logo-img" />
       <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create New Account </h2>
       <p className="text-light-3 small-medium md:base-regular mt-2">
        To Use,Snap-Gram,Please Enter your details!</p>
        
      <form onSubmit={form.handleSubmit(onSubmit)} 
      className="flex flex-col gap-5 w-full mt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
             <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UserName</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
             <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" className="shad-input" {...field} />
              </FormControl>
             <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" className="shad-input" {...field} />
              </FormControl>
             <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="shad-button_primary">
          {isCreatingAccount ? (
            <div className="flex-center gap-2">
               < Loader/>Loading...
            </div>
          ):"Sign up"}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
           Already Have Account?
           <Link to="/sign-in" 
           className="text-primary-500 text-small-semibold ml-1">Log In</Link>
          </p>
      </form>
      </div>
    </Form>
 
  )
}

export default SignupForm