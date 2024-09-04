import { CirclePlus, CircleX } from "lucide-react"
import { useState } from "react";
import { createProjectFunction, getProjects } from "../firebase/functions";
import { ProjectType } from "../pages/Createproject";

type Props = {
    setProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>;
    projects: ProjectType[];
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Createnewproject = (props: Props) => {
    
    const [name, setName] = useState("");
    const handleSubmit = async () => {
        try {
          await createProjectFunction(name);
          const projectData = await getProjects();
          if (!projectData) return
          props.setProjects(projectData)
        } finally {
          setName("");
          props.setOpen(false);
        }
      };

  return (
    <div className="h-full w-full flex items-center justify-center fixed inset-0 backdrop-filter backdrop-blur-lg z-50">
          <div className="bg-[white] relative rounded-xl shadow-xl flex flex-col justify-center px-5 w-72 sm:w-96 h-64">
            <button className="absolute top-2.5 right-2.5" onClick={() => {props.setOpen(false); setName("")}}>
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
              disabled={name === "" || props.projects.length === 2}
              onClick={handleSubmit}
              className="rounded-md mt-4 flex gap-2 items-center justify-center text-[white] bg-primary px-6 py-2.5 text-lg font-semibold hover:opacity-90 transition-all duration-700 disabled:opacity-50"
            >
              <CirclePlus />
              Create New Project
            </button>
          </div>
        </div>
  )
}

export default Createnewproject