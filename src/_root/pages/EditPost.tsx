
import Postform from "@/components/Forms/POSTFORM"
import Loader from "@/components/shared/loader";
import { useGetPostById } from "@/lib/react-queires/queriesAndMutations";
import { useParams } from "react-router-dom"
const EditPost = () => {
  const {id} = useParams();
   const {data:post, isPending} = useGetPostById(id|| '');
   if(isPending) return <Loader/>
  return (
    <div className="flex flex-1">
      <div className="common-container">
       <div className="max-w-5xl flex-start gap-3 justify-start w-full">
        <img src="/assets/imges/add-post.png" 
        width={36}
        height={36}
        alt="add-post"/>
        <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
       </div>
      <Postform action = "Update" post={post}/>
      </div>
    </div>
  )
}

export default EditPost

// const EditPost = () => {
//   return (
//     <div>EditPost</div>
//   )
// }

// export default EditPost