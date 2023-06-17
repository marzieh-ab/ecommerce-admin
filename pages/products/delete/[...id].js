import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProductPage(){
    const [productInfo,setProductInfo]=useState()
    const router=useRouter()
    const {id}=router.query

    useEffect(()=>{
        // console.log(id,"did")
        if(!id) return
        axios.get('/api/products?id='+id).then(res=>{
           
            setProductInfo(res.data)
        })

    },[])

    const goBack=()=>{
        router.push("/products")

    }

    const deleteProduct=async()=>{
        console.log("ok")
        await axios.delete('/api/products?id='+id);
        console.log("delete")
        goBack();
      
       

    }

    return(

        <Layout>
           <h1 className="text-center" >Do you really delete "{productInfo?.title}"</h1>
           <div  className="flex gap-2 justify-center">
            <button  className="btn-red"  onClick={deleteProduct}>
                Yes
            </button>
            <button  className="btn-default "  onClick={goBack}>
                No
            </button>
            


           </div>
        </Layout>

    )

}