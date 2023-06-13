import Layout from "@/components/Layout";
import  {axios} from "axios";
import { useState } from "react";
export default function NewProduct(){
    const [title,setTitle]=useState('');
    const [description,setDescription]=useState('');
    const [price,setPrice]=useState('');
    async function createProduct(e){
        e.preventDefault();
        const data={title,description,price};
       
        await axios.post('api/products', data)
    }
    return(
        <Layout>
            <form onSubmit={createProduct}>
            <h1 className="text-green-900 mb-2 text-xl">New Product</h1>
            <label>Product name</label>
           <input type="text"  placeholder="product name" value={title} onChange={e=>setTitle(e.target.value)}/>
           <label>Description</label>
           <textarea placeholder="description" value={description} onChange={e=>setDescription(e.target.value)}></textarea>
           <label>Price (in Naira)</label>
           <input type="number" placeholder="price" value={price} onChange={e=>setPrice(e.target.value)}/>
           <button type="submit" className="btn-success">Save</button>
           </form>
        </Layout>
    )
}