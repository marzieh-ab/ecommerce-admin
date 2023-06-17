import { useState,useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spiner from "../components/Spiner";
import {ReactSortable} from "react-sortablejs";



function ProductForm({
  _id,
  title: existtitle,
  description: existDescription,
  price: existPrice,
  images: existImage,
  category:existCategoy,
  properties:assignedProperties,
}) {
  const [title, setTitle] = useState(existtitle || "");
  const [description, setDescription] = useState(existDescription || "");
  const [productProperties,setProductProperties] = useState(assignedProperties || {});
  const [price, setPrice] = useState(existPrice || "");
  const [images, setImages] = useState(existImage || []);
  const[categories,setCategories]=useState([])
  const[category,setCategory]=useState(existCategoy||"")
  const [goToProduct, setGoToProduct] = useState(false);
  const[isUploading,setIsuploading]=useState(false)
  const router = useRouter();

  useEffect(()=>{
    axios.get('/api/categories').then(result=>{
      console.log(result,"rescat")
      setCategories(result.data)
    })

  },[])
  
  console.log(category,"category")

  const saveProduct = async (event) => {
    event.preventDefault();
    const data = { title, description, price ,images,category,productProperties};

    if (_id) {
      // update
      await axios.put("/api/products", { _id, ...data });
    } else {
      await axios.post("/api/products", data);
    }
    setGoToProduct(true);
  };

  if (goToProduct) {
    router.push("/products");
  }

  const uploadImages = async (event) => {
    const files = event.target?.files;

    if (files?.length > 0) {
      setIsuploading(true)
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
        console.log(data);
      }

      // await axios.post("/api/uploade",data)
      const res = await fetch("/api/uploade", {
        method: "POST",
        body: data,
      });

      console.log(res, "res");

      const result = await res.json();
      console.log(result, "result");
      setImages((prevImages) => {
        return [...prevImages, ...result.links];
      });

      setIsuploading(false)
    }


    
  };

  const updateImagesOrder=(images)=>{
    setImages(images);
  }


  const propertiseToFill=[]
  if(categories.length>0 && category){
    let catInfo=categories.find(c=>c._id==category)
    console.log(catInfo,"catInfo")
    propertiseToFill.push(...catInfo.properties)
    while(catInfo?.parent?.id){
      const parentCat=categories.find(c=>c._id==catInfo?.parent?.id)
      propertiseToFill.push(...parentCat.properties)
      catInfo=parentCat

    }

    
  }

  function setProductProp(propName,value) {
    console.log(propName,value,"propname,value")
    setProductProperties(prev => {
      const newProductProps = {...prev};
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  
  console.log(propertiseToFill,"propertiseToFill")

  return (
    <form onSubmit={saveProduct}>
      <label>Product Name</label>
      <input
        type="text"
        placeholder="product Name"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <label >Category</label>
      <select   value={category} onChange={(event)=>setCategory(event.target.value)} >
        <option value="">Uncategoried</option>
        {categories?.length>0 &&   categories.map((c)=>{
           console.log(c)
          return(
           
            <option value={c._id}>{c.name}</option>
          )

        })}
      </select>

      { propertiseToFill.length>0 && propertiseToFill.map((p)=>{
        console.log(p,"ppppp")
        return(
          <div  className="">
            <label>{p.name}</label>
            <div>

            <select   value={productProperties[p.name]}
                      onChange={ev =>
                        setProductProp(p.name,ev.target.value)
                      }>
              {
                p.values.map((v)=>{
                  return(
                     <option value={v}>{v}</option>
                  )
                 

                })
              }
            </select>


            </div>
         
            
            </div>
        )

      }) 
      
      }


      
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-2">
      <ReactSortable
            list={images}
            className="flex flex-wrap gap-1"
            setList={updateImagesOrder}>
            {!!images?.length && images.map(link => (
              <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                <img src={link} alt="" className="rounded-lg"/>
              </div>
            ))}
          </ReactSortable>
        
          {isUploading &&  (
            <div  className="h-24 flex items-center ">
              <Spiner/>
            </div>


          )}


      
        <label className="flex flex-col items-center   cursor-pointer justify-center w-24 h-24 bg-white  shadow-md border border-gray-200 text-center text-sm gap-1 text-primary rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Add image</div>
          <input type="file" className="hidden" onChange={uploadImages} />
        </label>
      
      </div>
      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      ></textarea>
      <label>Price</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(event) => setPrice(event.target.value)}
      />
      <button className="btn-primary" type="submit">
        Save
      </button>
    </form>
  );
}

export default ProductForm;
