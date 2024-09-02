import Navbar from "../components/Navbar";
import { CirclePlus, CircleX } from 'lucide-react';
import { useState } from "react";
import { createProjectFunction } from "../firebase/functions";

const Createproject = () => {

  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  
  const handleSubmit = async () => {
    try {
      await createProjectFunction(name)
    } finally {
      setName("");
      setOpen(false);
    }
  }
  
  return (
    <div className="bg-background">
      {open && 
          <div className="h-full w-full flex items-center justify-center fixed inset-0 backdrop-filter backdrop-blur-lg z-50">
            <div className="bg-[white] relative rounded-xl shadow-xl flex flex-col justify-center px-[20px] w-[290px] sm:w-[480px] h-[250px]">
              <button className="absolute top-[10px] right-[10px]" onClick={() => setOpen(false)}><CircleX className="text-primary"/></button>
              <label className="text-xl text-primary text-left font-semibold" htmlFor="name">Project Name </label>
              <input onChange={(e) => {setName(e.target.value)}} className="border-[2px] border-primary py-2 px-4 rounded-md outline-none" type="text" id="name" placeholder="Enter project name....." />
              <button type="submit" disabled={name === ""} onClick={handleSubmit} className="rounded-md mt-[2vh] flex gap-2 items-center justify-center text-[white] bg-primary px-6 py-2.5 text-lg font-semibold hover:opacity-90 transition-all hover:duration-700 disabled:opacity-50">
                <span><CirclePlus /></span>Create New Project
              </button>
            </div>
          </div>
      }
      <Navbar />
      <div className="flex flex-col justify-center items-start h-screen w-screen mx-[10px]">
        <div className="rounded-xl px-[10px] bg-[white] shadow-lg w-[290px] sm:w-[480px] h-[250px] mx-auto flex text-center flex-col items-center justify-center">
          <h1 className="text-secondary font-semibold sm:text-xl">To start your journey with <span className="text-primary font-extrabold">FileHub</span> create a new project it seems you don't have one</h1>
          <button onClick={() => {setOpen(true)}} className="rounded-md mt-[2vh] flex gap-1 items-center text-[white] bg-primary px-6 py-2.5 text-lg font-semibold hover:opacity-90 transition-all hover:duration-700">
              <span><CirclePlus /></span>Create New Project
          </button>
        </div>
      </div>
    </div>
  )
}

export default Createproject