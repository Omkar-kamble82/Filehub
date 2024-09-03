import Navbar from "../components/Navbar";
import { CirclePlus, CircleX } from 'lucide-react';
import { useState, useEffect } from "react";
import { createProjectFunction, getUserProjects } from "../firebase/functions";
import toast from "react-hot-toast";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../firebase/config";
// import { getAuth } from "firebase/auth";

export type Projecttype = {
  name: string,
  users: string[]
}

const Createproject = () => {

  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [projects, setProjects] = useState<Projecttype[]>([
    {name:"Chatwave", users: []},
    {name:"Fashstore", users: []},
  ])
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async () => {
    try {
      if (projects.length === 2) {
        toast.error("Max limit reached!!")
      }
      await createProjectFunction(name)
      getProjects()
    } finally {
      setName("");
      setOpen(false);
    }
  }

  const getProjects = async () => {
    setLoading(true);
    const fetchedProjects = await getUserProjects();
    if (fetchedProjects) {
      setProjects((prevProjects) => {
        // Create a map of project IDs from the existing state
        const existingProjectIds = new Set(prevProjects.map((project) => project.name));

        // Filter out projects that are already in the state
        const newProjects = fetchedProjects.filter(
          (project) => !existingProjectIds.has(project.name)
        );

        return [...prevProjects, ...newProjects];
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    // getProjects();  // Always fetch projects on component mount
  }, []);  // Empty dependency array ensures this runs once on mount
  
  
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
      {loading &&
        <div className="h-full w-full flex items-center justify-center fixed inset-0 backdrop-filter backdrop-blur-lg z-50">
          <div className="bg-[white] relative rounded-xl shadow-xl flex flex-col items-center justify-center w-[290px] sm:w-[480px] h-[250px]">
            <img className="h-[150px] w-[150px]" src="/loading.gif" alt="not-found-gif"/>
            <p className="text-2xl text-primary text-left font-bold">Loading User Info</p>
          </div>
      </div> 
      }
      <Navbar />
      {projects.length === 0 ? 
        (
        <div className="flex flex-col justify-center items-start h-screen w-screen">
          <div className="rounded-xl sm:px-[10px] bg-[white] shadow-lg w-[290px] sm:w-[480px] h-[250px] mx-auto flex text-center flex-col items-center justify-center">
            <h1 className="text-secondary font-semibold sm:text-xl">To start your journey with <span className="text-primary font-extrabold">FileHub</span> create a new project it seems you don't have one</h1>
            <button onClick={() => {setOpen(true)}} className="rounded-md mt-[2vh] flex gap-1 items-center text-[white] bg-primary px-6 py-2.5 text-lg font-semibold hover:opacity-90 transition-all hover:duration-700">
                <span><CirclePlus /></span>Create New Project
            </button>
          </div>
        </div>
      ) : 
      (
        <div className="min-h-screen w-screen">
          <div className="pt-[15vh]">
            <div className="flex w-screen mb-[20px] flex-col gap-2 sm:flex-row sm:justify-between items-center pr-[10px]">
              <span className="text-center sm:text-left sm:pl-[20px] font-semibold text-primary">
                <h1 className="text-4xl">Your Projects</h1>
                <p className="sm:pl-[10px] mt-[5px]">Project limit: 2 / 2</p>
              </span>
              <button disabled={projects.length === 2} onClick={() => {setOpen(true)}} className="rounded-md flex gap-1 items-center text-[white] bg-primary px-6 py-2.5 text-lg font-semibold hover:opacity-90 transition-all hover:duration-700 disabled:opacity-50">
                  <span><CirclePlus /></span>Create New Project
              </button>
            </div>
            <div className="gap-4 flex px-[20px] flex-wrap items-center justify-center my-[10px] sm:items-start sm:justify-start">
              {
                projects.map((project, idx) => (
                  <a key={idx} href={`/project/${idx}`}><div className="rounded-xl cursor-pointer bg-[white] shadow-lg w-[280px] pb-[10px]">
                    <div className="relative h-[150px] rounded-xl">
                      <img className=" h-[150px] w-full rounded-t-xl" src={`/${idx}.jpg`} alt="project-banner"/>
                      <div className="absolute bg-primary/70 inset-0 rounded-t-xl"/>
                    </div>
                    <div className="p-2">
                      <h1 className="text-2xl font-bold text-primary hover:underline capitalize mb-[8px]">{project.name}</h1>
                      <p><span className="font-bold text-primary">Created By:</span> Omkar kamble</p>
                      <p className="text-xs"><span className="font-bold text-primary">Collaborators:</span> Omkar kamble, nitish rajput, Omkar kamble, nitish rajput</p>

                      <h2 className="my-[10px]"><span className="text-xl font-extrabold text-primary">4.45MB</span> / 100MB (20% used)</h2>
                      <span className="p-2 bg-background rounded-xl font-semibold text-primary">Shared</span>

                    </div>
                  </div></a>
                ))
              }
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Createproject