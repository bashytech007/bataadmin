import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [properties,setProperties]=useState([])
  useEffect(() => {
    fetChCategories();
  }, []);
  function fetChCategories() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }
  async function saveCategory(e) {
    e.preventDefault();
    const data = { name, parentCategory };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }

    setName("");
    setParentCategory("");
    fetChCategories();
  }
  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
  }
  function deleteCategory(category) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${category.name}`,
        showCancelButton:true,
        cancelButtonText:'Cancel',
        cancelButtonColor:'green',
        confirmButtonText:'Yes,Delete!',
        confirmButtonColor:'#d55',
        reversebuttons:true,
      }) 
      .then(async result => {
        if(result.isConfirmed){
          const{_id}=category
          await axios.delete('/api/categories?_id='+_id)
        }
      })
      
  }
  function addProperty(){
    setProperties(prev=>{
      return [...prev,{name:'',values:""}]
    })
  }
  function handlePropertyNameChange(index,property,newName){
 setProperties(prev=>{
  const properties=[...prev];
  properties[index].name=newName;
  return properties
 })
}
function handlePropertyValuesChange(index,property,newValues){
  setProperties(prev=>{
   const properties=[...prev];
   properties[index].values=newValues;
   return properties
  })
   }
 
  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit category ${editedCategory.name}`
          : "Create new category"}
      </label>
      <form onSubmit={saveCategory} >
        <div className="flex gap-1">      
            <input
          className=""
          type="text"
          placeholder={"Category name"}
          onChange={(ev) => setName(ev.target.value)}
          value={name}
        />
        <select
          className=""
          value={parentCategory}
          onChange={(ev) => setParentCategory(ev.target.value)}
        >
          <option value="">No parent category</option>
          {categories.length > 0 &&
            categories.map((category) => (
              <option value={category._id}>{category.name}</option>
            ))}
        </select>
        </div>
        <div className="mb-2">
          <label className="block">properties</label>
          <button onClick={addProperty} type="button" className="btn-default text-sm mb-2">Add new property</button>
        </div>
        {properties.length > 0 && properties.map((property,index) =>(
          <div className="flex gap-1">
            <input type="text" value={property.name} onChange={e=>handlePropertyNameChange(index,property,e.target.value)} placeholder="property name(example:color)"/>
            <input type="text" values={property.values} 
            onChange={e=>handlePropertyValuesChange(index,property,e.target.value)}
            placeholder="values,comma seperated"/>
          </div>
        ))}
        <button type="submit" className="btn-success py-1">
          Save
        </button>
        

      </form>
      
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>catergory name</td>
            <td>Parent Category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((category) => (
              <tr>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td>
                  <div className="flex">
                    <button
                      onClick={() => editCategory(category)}
                      className="btn-success mr-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(category)}
                      className="btn-success"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
