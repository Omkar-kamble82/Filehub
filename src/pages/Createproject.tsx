import Navbar from "../components/Navbar";
import { CirclePlus, CircleX } from 'lucide-react';
import { useState, useEffect } from "react";
import { createProjectFunction, getProjects } from "../firebase/functions";
// import { db } from "../firebase/config";
// import { doc, getDoc } from "firebase/firestore";

export type ProjectType = {
  id: string,
  name: string,
  limit: number,
  creator: string,
  users: [],
}

const Createproject = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      await createProjectFunction(name);
      const projectData = await getProjects();
      if (!projectData) return
      setProjects(projectData)
    } finally {
      setName("");
      setOpen(false);
    }
  };

  useEffect( () => {
    setLoading(true);
    if (localStorage.getItem("projects") !== null) {
      const projects = JSON.parse(localStorage.getItem("projects") as string)
      setProjects(projects);
      setLoading(false);
      return 
    }
    const Initailrender = async () => {
      const projectData = await getProjects();
      if (!projectData) return
      setProjects(projectData)
      setLoading(false);
    }
    Initailrender()
  }, []);
  
  return (
    <div className="bg-background">
      {open && (
        <div className="h-full w-full flex items-center justify-center fixed inset-0 backdrop-filter backdrop-blur-lg z-50">
          <div className="bg-[white] relative rounded-xl shadow-xl flex flex-col justify-center px-5 w-72 sm:w-96 h-64">
            <button className="absolute top-2.5 right-2.5" onClick={() => setOpen(false)}>
              <CircleX className="text-primary" />
            </button>
            <label className="text-xl text-primary text-left font-semibold" htmlFor="name">
              Project Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              className="border-2 border-primary py-2 px-4 rounded-md outline-none"
              type="text"
              id="name"
              placeholder="Enter project name..."
            />
            <button
              type="submit"
              disabled={name === "" || projects.length === 2}
              onClick={handleSubmit}
              className="rounded-md mt-4 flex gap-2 items-center justify-center text-[white] bg-primary px-6 py-2.5 text-lg font-semibold hover:opacity-90 transition-all duration-700 disabled:opacity-50"
            >
              <CirclePlus />
              Create New Project
            </button>
          </div>
        </div>
      )}
      {loading && (
        <div className="h-full w-full flex items-center justify-center fixed inset-0 backdrop-filter backdrop-blur-lg z-50">
          <div className="bg-[white] relative rounded-xl shadow-xl flex flex-col items-center justify-center w-72 sm:w-96 h-64">
            <img className="h-36 w-36" src="/loading.gif" alt="Loading..." />
            <p className="text-2xl text-primary font-bold">Loading User Info</p>
          </div>
        </div>
      )}
      <Navbar />
      {projects.length === 0 ? (
        <div className="flex flex-col justify-center items-start h-screen w-screen">
          <div className="rounded-xl sm:px-2.5 bg-[white] shadow-lg w-72 sm:w-96 h-64 mx-auto flex text-center flex-col items-center justify-center">
            <h1 className="text-secondary font-semibold sm:text-xl">
              To start your journey with <span className="text-primary font-extrabold">FileHub</span> create a new project as it seems you don't have one.
            </h1>
            <button
              onClick={() => setOpen(true)}
              className="rounded-md mt-4 flex gap-1 items-center text-[white] bg-primary px-6 py-2.5 text-lg font-semibold hover:opacity-90 transition-all duration-700"
            >
              <CirclePlus />
              Create New Project
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen w-screen">
          <div className="pt-[13vh]">
            <div className="flex w-screen flex-wrap justify-center sm:justify-between items-center p-4">
              <span className="text-center font-semibold sm:text-left text-primary">
                <h1 className="text-4xl">
                  Your Projects
                </h1>
                <p className="pl-[10px]">Project limit: {projects.length} / 2</p>
              </span>
              <button
                onClick={() => setOpen(true)}
                className="rounded-md flex gap-1 items-center text-[white] bg-primary px-6 py-2.5 text-lg font-semibold hover:opacity-90 transition-all duration-700 disabled:opacity-50"
                disabled={projects.length === 2}
              >
                <CirclePlus />
                Create New Project
              </button>
            </div>
            
            <div className="gap-4 flex px-5 flex-wrap items-center justify-center sm:items-start sm:justify-start">
              {projects.map((project, idx) => (
                <a key={project.id} href={`/project/${project.id}`}>
                  <div className="rounded-xl cursor-pointer bg-[white] shadow-lg w-70 pb-2.5">
                    <div className="relative h-36 rounded-xl">
                      <img className="h-36 w-full rounded-t-xl" src={`/${idx}.jpg`} alt="project-banner" />
                      <div className="absolute bg-primary/70 inset-0 rounded-t-xl" />
                    </div>
                    <div className="p-2">
                      <h1 className="text-2xl font-bold text-primary hover:underline capitalize mb-2">
                        {project.name}
                      </h1>
                      <p>
                        <span className="font-bold text-primary">Created By:</span> Omkar Kamble
                      </p>
                      <p className="text-xs">
                        <span className="font-bold text-primary">Collaborators:</span> Omkar Kamble, Nitish Rajput
                      </p>
                      <h2 className="my-2.5">
                        <span className="text-xl font-extrabold text-primary">4.45MB</span> / 100MB (20% used)
                      </h2>
                      <span className="p-2 bg-background rounded-xl font-semibold text-primary">Shared</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Createproject;
