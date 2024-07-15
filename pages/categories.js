import Layout from "@/components/Layout";
import axios from "axios";
import { useState } from "react";

export default function categories(){
  const [name,setName]=useState('');
  async function saveCategory(e){
    e.preventDefault();
   await  axios.post('/api/categories',{name})
   setName("");
  }
return(
  <Layout>
    <h1>
      Categories
    </h1>
    <label>New Category name</label>
    <form onSubmit={saveCategory} className="flex gap-1">
     
    <input className="mb-0" type="text" placeholder={'Category name'}
    onChange={ev=>setName(ev.target.value)}
    />
    <button className="btn-success">Save</button>
    </form>
  </Layout>
)
}