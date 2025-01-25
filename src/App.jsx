import { useEffect, useState } from "react";
import api from "../src/api/Contacts";

function App() {
  const [contact, setContact] = useState([]);
  const [data, setData] = useState({ Name: "", Mail: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const AllContacts = async () => {
    try {
      const result = await api.get("/");
      setContact(result.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    AllContacts();
  }, []);

  const dataHandler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const addContact = async (e) => {
    e.preventDefault();
    if (!data.Name || !data.Mail) {
      alert("Please fill out all fields.");
      return;
    }
    try {
      await api.post("/", data);
      setData({ Name: "", Mail: "" });
      await AllContacts();
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  const editContact = (contact) => {
    setIsEditing(true);
    setEditId(contact.id);
    setData({ Name: contact.Name, Mail: contact.Mail });
  };

  const updateContact = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/${editId}`, data);
      setIsEditing(false);
      setData({ Name: "", Mail: "" });
      AllContacts();
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  const deletData = async (id) => {
    if (confirm("Are you sure to delete this contact?")) {
      try {
        await api.delete(`/${id}`);
        await AllContacts();
      } catch (error) {
        console.error("Error deleting contact:", error);
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <p className="bg-white text-center py-5 shadow-lg text-lg md:text-2xl font-bold">
        Contact Manager
      </p>

      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-4 bg-white shadow">
        <p className="font-semibold text-xl md:text-2xl mb-4 md:mb-0">
          Contact List
        </p>

        <form
          className="flex flex-col md:flex-row justify-between w-full md:w-auto"
          onSubmit={isEditing ? updateContact : addContact}
        >
          <div className="flex flex-col w-full md:w-auto gap-2 mb-4 md:mb-0">
            <input
              type="text"
              value={data.Name}
              name="Name"
              onChange={dataHandler}
              placeholder="Enter Name"
              className={`border border-2 w-full md:w-72 h-10 rounded-full border-zinc-300 text-center ${
                isEditing
                  ? "focus:ring-2 ring-green-500 outline-none"
                  : "focus:ring-2 ring-blue-500 outline-none"
              }`}
            />
            <input
              type="email"
              value={data.Mail}
              name="Mail"
              onChange={dataHandler}
              placeholder="Enter Email"
              className={`border border-2 w-full md:w-72 h-10 rounded-full border-zinc-300 text-center ${
                isEditing
                  ? "focus:ring-2 ring-green-500 outline-none"
                  : "focus:ring-2 ring-blue-500 outline-none"
              }`}
            />
          </div>
          <button
            type="submit"
            className={`w-full md:w-32 ${
              isEditing ? "bg-green-500" : "bg-blue-400"
            } text-white px-4 py-1 mx-4 rounded-lg cursor-pointer active:scale-95`}
          >
            {isEditing ? "Update" : "Add Contact"}
          </button>
        </form>
      </div>

      <hr className="w-full h-[2px] bg-zinc-300" />

      <div className="py-4 px-6">
        <ul>
          {contact.map((val, index) => (
            <div
              key={val.id || index}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 px-4 bg-white shadow-md rounded-lg mb-4"
            >
              <span className="border border-1 w-12 h-12 flex justify-center items-center rounded-full bg-zinc-500 text-white">
                <i className="fa-solid fa-user"></i>
              </span>
              <div className="flex-1 flex flex-col md:flex-row md:justify-between gap-4">
                <div className="flex flex-col leading-6">
                  <li className="text-lg font-medium">{val.Name}</li>
                  <li className="text-sm text-blue-600 italic ">{val.Mail}</li>
                </div>
                <div className="flex gap-4 py-2 mx-3">
                  <i
                    onClick={() => editContact(val)}
                    className="fa-regular fa-pen-to-square cursor-pointer bg-yellow-500 px-4 py-2 rounded-md text-white text-sm md:text-base active:scale-95"
                  ></i>
                  <i
                    onClick={() => deletData(val.id)}
                    className="fa-solid fa-trash-can cursor-pointer bg-blue-500 px-4 py-2 rounded-md text-white text-sm md:text-base active:scale-95"
                  ></i>
                </div>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
