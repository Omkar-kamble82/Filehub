import { CircleX, Link } from "lucide-react"
import { getProjects, joinWithLink } from "../firebase/functions";
import { useState } from "react";
import { ProjectType } from "../pages/Createproject";

type Props = {
    setProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>;
    projects: ProjectType[];
    setInvite: React.Dispatch<React.SetStateAction<boolean>>;
}

const Invite = (props: Props) => {

    const [link, setLink] = useState("");

    const handleInvite = async () => {
        try {
          await joinWithLink(link);
          const projectData = await getProjects();
          if (!projectData) return
          props.setProjects(projectData)
        } finally {
          props.setInvite(false);
          setLink("");
        }
    };

  return (
    <div className="h-full w-full flex items-center justify-center fixed inset-0 backdrop-filter backdrop-blur-lg z-50">
          <div className="bg-[white] relative rounded-xl shadow-xl flex flex-col justify-center px-5 w-72 sm:w-96 h-64">
            <button className="absolute top-2.5 right-2.5" onClick={() => props.setInvite(false)}>
              <CircleX className="text-primary" />
            </button>
            <label className="text-xl text-primary text-left font-semibold" htmlFor="name">
              Paste Invite Link
            </label>
            <input
              onChange={(e) => setLink(e.target.value)}
              className="border-2 border-primary py-2 px-4 rounded-md outline-none"
              type="text"
              id="name"
              placeholder="http://localhost:5173/project/7837e88398978"
            />
            <button
              type="submit"
              disabled={link === "" || props.projects.length === 2}
              onClick={handleInvite}
              className="rounded-md mt-4 flex gap-2 items-center justify-center text-[white] bg-primary px-6 py-2.5 text-lg font-semibold hover:opacity-90 transition-all duration-700 disabled:opacity-50"
            >
              <Link />
              Join Project
            </button>
          </div>
        </div>
  )
}

export default Invite