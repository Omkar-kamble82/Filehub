import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { deleteProject, getProjects } from "../firebase/functions";
import Not_found from "./Not_found";
import { useState } from "react";

const Project = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);
    
    if (!id) {
        return <Not_found/>;
    }

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteProject(id);
            await getProjects()
            navigate("/projects")
            setLoading(false);
        } catch {
            console.log("Error occurred while deleting project")
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Navbar />
            {loading && (
                <div className="h-full w-full flex items-center justify-center fixed inset-0 backdrop-filter backdrop-blur-lg z-50">
                <div className="bg-[white] relative rounded-xl shadow-xl flex flex-col items-center justify-center w-72 sm:w-96 h-64">
                    <img className="h-36 w-36" src="/loading.gif" alt="Loading..." />
                    <p className="text-2xl text-primary font-bold">Deleting project</p>
                </div>
                </div>
            )}
            <div className="pt-[16vh]">Project {id}</div>
            <button
              onClick={handleDelete}
              className="rounded-md mt-4 flex gap-1 items-center text-[white] bg-[#ff4c28] px-6 py-2.5 text-lg font-semibold hover:opacity-90 transition-all duration-700"
            >
              Delete project
            </button>
            <p>invite link: http://localhost:5173/project/{id}</p>
        </div>
    )
}

export default Project