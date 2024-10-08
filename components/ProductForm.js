import { useState ,useEffect} from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "./Spinners";
import { ReactSortable } from "react-sortablejs";
export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory, 
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(assignedCategory || "")
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setGoToProducts] = useState(false);
  const [images, setImages] = useState(existingImages || []);
  const [isUploading,setIsUploading]=useState(false)
  const [categories,setCategories]=useState([])
  const router = useRouter();
  useEffect(()=>{
  axios.get('/api/categories').then(result=>{
    setCategories(result.data)
  })
  },[])
  console.log({ _id });

  async function saveProduct(e) {
    e.preventDefault();
    const data = { title, description, price, images ,category};
    if (_id) {
      //update
      await axios.put("/api/products", { ...data, _id });
    } else {
      // create

      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push("/products");
  }

  async function uploadImages(e) {
    const files = e.target?.files;
    if (files?.length > 0) {
      setIsUploading(true)
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
        data.append("upload_preset", "my-uploads");
        // const res = await axios.post("/api/upload", data, {
        //   headers: { "Content-Type": "multipart/form-data" },
        // });
        // console.log(res.data);
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/olaonibata/image/upload",
          data  
        );
        const image = res.data.url;
        // setImages((oldImages) => {
        //   return [...oldImages, ...image];
        // });
        setImages([...images, image]);

        // console.log("data", ":", link);
        // return res.json({ links });
        setIsUploading(false)
      }
    }
  }

  function updateImagesOrder(images){
  setImages(images)
  }
  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input 
        type="text"
        placeholder="product name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>Category</label>
      <select value={category} onChange={ev=>setCategory(ev.target.value)}>
        <option value="">Uncategorized</option>
        {categories.length > 0 && categories.map(c=>(
          <option value={c._id}>{c.name}</option>
        ))}
      </select>
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable 
        list={images}
        className="flex flex-wrap gap-1"
         setList={updateImagesOrder}>
          {!!images?.length && images?.map(link => (
        <div key={link} className="h-24">
            <img src={link} className="rounded-lg"/>;
        </div>
          ))}
          </ReactSortable>
        {isUploading &&(
              
          <div className="h-24">
            <Spinner/>          
            </div>
        )}
      
        <label className="w-24 h-24 border text-center flex flex-col items-center justify-center text-sm gap-1 cursor-pointer text-gray-500 rounded-lg bg-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Upload</div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
        {!images?.length && <div>No photos in this products</div>}
      </div>
      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <label>Price (in Naira)</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button type="submit" className="btn-success">
        Save
      </button>
    </form>
  );
}
