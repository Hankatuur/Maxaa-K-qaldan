import{Routes,Route} from "react-router-dom"
import './App.css'
import { Toaster } from "@/components/ui/toaster"
import { Home } from "./_root/pages"
import SigninForm from "./_auth/forms/signinForm"
import SignupForm from "./_auth/forms/signupForm"
import AuthLayout from "./_auth/authLayout"
import RootLayout from "./_root/RootLayout"



function App() {
 
 return (
    <>
     
     <main className="flex h-screen">
     <Routes>
      {/* public Routes =  are the ones people can see lik sign-up form */}
      <Route element = {<AuthLayout/>}>
      <Route path="sign-in" element = {<SigninForm/>} />
     <Route path="sign-up" element = {<SignupForm/>} />
      </Route>
       
      {/* private Routes  and the routes you will see when you are signed=in*/}
      <Route element = {<RootLayout/>}>
      <Route index element = {<Home/>} />
      </Route>
     </Routes>
     <Toaster/>
     </main>
    </>
  )
}

export default App
