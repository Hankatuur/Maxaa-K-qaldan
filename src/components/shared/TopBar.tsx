import { Link,useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { useSignOutAccount } from "@/lib/react-queires/queriesAndMutations"
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";

const TopBar = () => {
  const {mutate:signOut,isSuccess} = useSignOutAccount();
  const navigate = useNavigate();
  const {user} = useUserContext();
  useEffect(()=>{
    if(isSuccess) navigate(0);
  },[isSuccess]);
  return (
 <section className="topbar">
<div className="flex-between py-4 px-5">
<Link to="/">
<img 
src="/assets/imges/logo.png" alt="logo-image"
width={130} 
 height={325}/>
</Link>
<div className="flex gap-4">
<Button variant="ghost" className="shad-button" onClick={() =>signOut()}>
    <img src="/assets/imges/logout.png" alt="log-out-icon"/>
</Button>
<Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
<img src = {user.imageUrl || '/assets/imges/profile-placeholder.png'}
alt="profile" className="h-8 w-8 rounded-full"/>

</Link>
</div>
</div>
 </section>

  )
}

export default TopBar