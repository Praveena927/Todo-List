import { React, useEffect, useState } from "react";
import axios from "axios";
import { TiEdit } from "react-icons/ti";
import { MdDelete } from "react-icons/md";
import "./Grocery.css";

const GroceryListComp = () => {
  const [groceryList, setGroceryList] = useState([]);
  const [input, setinput] = useState("");

  const handlefetch = async () => {
    const response = await axios.get("http://localhost:3000/todoList");
    setGroceryList(response.data);
  };

  useEffect(() => {
    handlefetch();
  }, []);

  const handlechange = (e) => {
    setinput(e.target.value);
  };

  const handlepost = async () => {
    if (input === "") {
      alert("Enter the Product");
    } else if (
      groceryList.some(
        (item) =>
          item.task.toLowerCase().trim() === input.toLocaleLowerCase().trim()
      )
    ) {
      alert("Product already exists");
      setinput("");
    } else {
      let body = {
        task: input,
      };
      await axios.post("http://localhost:3000/todoList", body);
      alert("Product Added");
      handlefetch();
      setinput("");
    }
  };

  const handledelete = async (id) => {
    await axios.delete(`http://localhost:3000/todoList/${id}`);
    alert("Product Deleted");
    handlefetch();
  };

  const handleedit = async (a) => {
    let edit = prompt("Enter the product", groceryList[a].task);

    if (edit === null || edit.trim() === "") {
      alert("Product name cannot be empty");
      return;
    }

    let body = {
      id: groceryList[a].id,
      task: edit.trim(),
    };

    try {
      await axios.put(
        `http://localhost:3000/todoList/${groceryList[a].id}`,
        body
      );
      alert("Product updated successfully");
      handlefetch();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update the product. Please try again.");
    }
  };

  return (
    <div className="groceryList">
      <div className="groceryList-header">
        {/* http://localhost:3000/todoList */}
        <h1>Grocery List</h1>
        <input
          value={input}
          onChange={handlechange}
          type="text"
          placeholder="Enter the Product"
        />
        <button onClick={handlepost}>Add+</button>

        {groceryList.map((item, i) => (
          <div key={i} className="groceryList-item">
            <div className="groceryList-item-text">
              <h2>
                {i + 1}.{item.task}
              </h2>
            </div>
            <div className="groceryList-item-icon">
              <span onClick={() => handleedit(i)}>
                <TiEdit />
              </span>
              <span onClick={() => handledelete(item.id)}>
                <MdDelete />
              </span>
            </div>
          </div>
        ))}
      </div>{" "}
    </div>
  );
};

export default GroceryListComp;
