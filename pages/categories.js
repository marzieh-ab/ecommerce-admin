import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editedCategory, setEditedCategory] = useState(null);
  const [parentCategory, setParentCategory] = useState("");
  const [properties, setProperties] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = () => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  };

  const saveCategory = async (event) => {
  
    event.preventDefault();
    console.log("save")
    const data = { name, 
      parentCategory ,
      properties:properties.map((c)=>{
      return({
         name:c.name,
         values:c.values.split(",")


      }
       

      )

    })};
    if (editedCategory) {
      await axios.put("/api/categories", { ...data, _id: editedCategory._id });
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", { ...data });
    }

    setName("");
    setParentCategory("")
    setProperties([])
    fetchCategories();
  };

  const editCategory = (category) => {
    console.log(category?.parent?.name);
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category?.parent?._id);
    setProperties(
      category.properties.map((p)=>{
        return({
          name:p.name,
          values:p.values.join(",")

        }

        )

      })
      )
  };

  const deleteCategory = (category) => {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        // console.log(result)
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("/api/categories?_id=" + _id);
          fetchCategories();
        }
      });
  };

  const addProperty = () => {
    setProperties((prev) => {
      // console.log(prev, "prev");

      return [...prev, { name: "", values: "" }];
    });
  };

  const handelPropertyNameChange = (index, property, newName) => {
    // console.log(index,property,newName)

    setProperties((prev) => {
      const propertis = [...prev];

      properties[index].name = newName;
      return propertis;
    });
    // console.log(properties)
  };
  const handelPropertyValuesChange = (index, property, newValue) => {
    // console.log(index, property);

    setProperties((prev) => {
      const propertis = [...prev];

      propertis[index].values = newValue;
      return propertis;
    });
    // console.log(properties);
  };

  const removeProperty = (index) => {
    console.log("remove");

    const newProperties = [...properties].filter(
      (item, itemId) => itemId !== index
    );
    console.log(newProperties);
    setProperties(newProperties);
    console.log(properties, "proooo");
  };

  return (
    <Layout>
      <h1>Categores</h1>
      <label>
        {" "}
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : "New Catrgory Name"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            className="mb-0"
            placeholder="CategoryName"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <select
            className="mb-0"
            value={parentCategory}
            onChange={(event) => setParentCategory(event.target.value)}
          >
            <option value="">No Parent Category</option>
            {categories.length > 0 &&
              categories.map((category) => {
                return <option value={category._id}>{category.name}</option>;
              })}
          </select>
        </div>
        <div className="mb-2">
          <label className="block mt-1">Propertise</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-default text-sm mb-2"
          >
            Add new property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => {
              return (
                <div className="flex gap-1  mb-2">
                  <input
                    type="text"
                    className="mb-0"
                    value={property.name}
                    onChange={(event) =>
                      handelPropertyNameChange(
                        index,
                        property,
                        event.target.value
                      )
                    }
                    placeholder="property name(example:color )"
                  />
                  <input
                    type="text"
                    className="mb-0"
                    value={property.values}
                    onChange={(event) =>
                      handelPropertyValuesChange(
                        index,
                        property,
                        event.target.value
                      )
                    }
                    placeholder="values"
                  />
                  <button
                    type="button"
                    onClick={() => removeProperty(index)}
                    className="btn-red">
                 
                    Remove
                  </button>
                </div>
              );
            })}
        </div>

        <div className="flex gap-2">
          {editedCategory && 
          
          (<button className="btn-default"   onClick={()=>{
            setEditedCategory(null)
            setName("")
            setParentCategory("")
            setProperties([])
          }
          }
             type="button">Cancele</button>

          )}
          <button  className="btn-primary py-1" type="submit">Save</button>
        </div>
      </form>

      {!editedCategory && (
        <table className="basic mt-4 ">
          <thead>
            <tr>
              <td>Caregory Name</td>
              <td>Parent Category</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => {
                return (
                  <tr>
                    <td>{category.name}</td>
                    <td>{category?.parent?.name}</td>
                    <td>
                      <button
                       className="btn-default"
                        onClick={() => editCategory(category)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-red ml-1"
                        onClick={() => deleteCategory(category)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

// export default Categories

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
