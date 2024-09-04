import Navbar from "../components/Navbar";
import { CirclePlus, Link } from 'lucide-react';
import { useState, useEffect } from "react";
import { getProjects } from "../firebase/functions";
import Loading from "../components/Loading";
import Invite from "../components/Invite";
import Createnewproject from "../components/Createnewproject";

export type ProjectType = {
  id: string,
  name: string,
  limit: number,
  creator: string,
  users: [],
}

const Createproject = () => {
  const [open, setOpen] = useState(false);
  const [invite, setInvite] = useState(false);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect( () => {
    setLoading(true);
    if (localStorage.getItem("projects") !== null) {
      const projects = JSON.parse(localStorage.getItem("projects") as string)
      setProjects(projects);
      console.log("fetch", projects)
      setLoading(false);
      return 
    }
    const Initailrender = async () => {
      const projectData = await getProjects();
      setLoading(false);
      if (!projectData) return
      setProjects(projectData)
    }
    Initailrender()
  }, []);
  
  return (
    <div className="bg-background min-h-screen max-h-screen">
      {open && ( <Createnewproject setOpen={setOpen} setProjects={setProjects} projects={projects} /> )}
      {invite && (<Invite setProjects={setProjects} projects={projects} setInvite={setInvite}/> )}
      {loading && <Loading Message="Loading User Info"/> }
      <Navbar />
      {projects.length === 0 ? (
        <div className="flex flex-col justify-center items-start h-screen w-screen">
          <div className="rounded-xl sm:px-2.5 bg-[white] shadow-lg w-72 sm:w-96 h-64 mx-auto flex text-center flex-col items-center justify-center">
            <h1 className="text-secondary font-semibold sm:text-xl">
              To start your journey with <span className="text-primary font-extrabold">FileHub</span> create a new project or join with invite link as it seems you don't have one.
            </h1>
            <button
              onClick={() => setOpen(true)}
              className="rounded-md mt-4 flex gap-1 w-[240px] items-center text-[white] bg-primary px-6 py-2.5 text-lg font-semibold hover:opacity-90 transition-all duration-700"
            >
              <CirclePlus />
              Create New Project
            </button>
            <button
              onClick={() => setInvite(true)}
              className="rounded-md mt-1 flex gap-1 w-[240px] items-center text-[white] bg-[#1d9549] px-6 py-2.5 text-lg font-semibold hover:opacity-90 transition-all duration-700"
            >
              <Link />
              Join via invite link
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-background w-screen">
          <div className="pt-[12vh] pb-[4vh] sm:pt-[13vh]">
            <div className="flex w-screen flex-wrap justify-center sm:justify-between items-center p-4">
              <span className="text-center font-semibold sm:text-left text-primary">
                <h1 className="text-4xl">
                  Your Projects
                </h1>
                <p className="pl-[10px]">Project limit: {projects.length} / 2</p>
              </span>
              <span className="flex gap-2 flex-col items-center sm:flex-row"><button
                onClick={() => setOpen(true)}
                className="rounded-md flex gap-1 items-center text-[white] bg-primary px-6 py-2.5 text-lg font-semibold hover:opacity-90 transition-all duration-700 disabled:opacity-50"
                disabled={projects.length === 2}
              >
                <CirclePlus />
                Create New Project
              </button>
              <button
                onClick={() => setInvite(true)}
                className="rounded-md mt-1 flex gap-1 items-center text-[white] bg-[#1d9549] px-6 py-2.5 text-lg font-semibold hover:opacity-90 transition-all duration-700  disabled:opacity-50"
                disabled={projects.length === 2}
              >
                <Link />
                Join via invite link
              </button></span>
            </div>
            
            <div className=" bg-background gap-4 flex px-5 flex-wrap items-center justify-center sm:items-start sm:justify-start">
              {projects.map((project, idx) => (
                <a key={idx} href={`/project/${project.id}`}>
                  <div className="rounded-xl w-[320px] cursor-pointer bg-[white] shadow-lg w-70 pb-2.5">
                    <div className="relative h-36 rounded-xl">
                      <img className="h-36 w-full rounded-t-xl object-cover" src={`/${idx}.jpg`} alt="project-banner" />
                      <div className="absolute bg-primary/70 inset-0 rounded-t-xl" />
                    </div>
                    <div className="p-2">
                      <h1 className="text-2xl font-bold text-primary hover:underline capitalize mb-2">
                        {project.name}
                      </h1>
                      <p>
                        <span className="font-bold text-primary">Created By:</span> {project.creator}
                      </p>
                      <p className="">
                        <span className="font-bold text-primary">Collaborators:</span> {project.users.length}
                      </p>
                      <h2 className="my-2.5">
                        <span className="text-xl font-extrabold text-primary">{project.limit.toFixed(2)}</span>/100MB ({(Number(project.limit.toFixed(2)) / 100) * 100}% used)
                      </h2>
                      <span className="p-2 bg-background rounded-xl font-semibold text-primary">{project.users.length > 1 ? "Shared" : "Personal"}</span>
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
