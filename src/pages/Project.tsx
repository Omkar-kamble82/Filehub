import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getProject } from "../firebase/functions";
import Not_found from "./Not_found";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import { ProjectType } from "./Createproject";
import { Trash, Link } from "lucide-react";
import DeleteModel from "../components/DeleteModel";
import InviteModel from "../components/InviteModel";
import Contributors from "../components/Contributors";
import Files from "../components/Files";
import Guidelines from "../components/Guidelines";

export type projectwithrole = ProjectType & {
    Role: string
    username: string
    email: string
}

const Project = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);
    const [deleteloading,setDeleteLoading] = useState(false);
    const [project, setProject] = useState<projectwithrole | null>(null);
    const [deletemodel, setDeletemodel] = useState(false)
    const [inviteModel, setInvitemodel] = useState(false)
    const [page,setPage] = useState("files")


    useEffect(() => {
        setProject(null)
        setLoading(true)
        const pro = JSON.parse(localStorage.getItem("project") as string) 
        if(pro !== "" && localStorage.getItem("project") && id === pro.id) {
            setProject(pro)
            setLoading(false)
            return
        }
        get()
    }, [])

    if (!id) {
        return <Not_found/>;
    }
    const get = async() => {
        setLoading(true)
        const projectfected = await getProject(id)
        if (projectfected === undefined){
            toast.error("Project not found")
            navigate("/projects")
            return
        }
        if(typeof localStorage.getItem("project") === "string"){
            setProject(JSON.parse(localStorage.getItem("project") as string))
        }
        setLoading(false)
    }
    return (
        <div className="min-h-screen w-screen overflow-y-hidden bg-background">
            <Navbar />
            { deleteloading && (<Loading Message="Deleting project"/>) }
            { loading && (<Loading Message="Loading Project Info"/>) }
            { project && deletemodel && ( <DeleteModel setDeleteLoading={setDeleteLoading} id={id} setDeletemodel={setDeletemodel} project={project}/> )}
            { inviteModel && ( <InviteModel setInvitemodel={setInvitemodel} id={id}/>)}
            { project ? (
                <div className="pt-[16vh] w-[96vw] mx-auto">
                    <span className="flex justify-between items-center">
                        <h1 className="text-primary text-5xl font-bold">{project.name}</h1>
                        <div className="flex item-center gap-2">
                            {project.Role === "Admin" && (<button onClick={() => setDeletemodel(true)} className="h-[40px] w-[35px] border-[1px] rounded-lg border-[#ff4d00fe] text-[#ff4d00fe] flex justify-center items-center">
                                <Trash />
                            </button>)}
                            <button onClick={() => setInvitemodel(true)} className="h-[40px] w-[35px] border-[1px] rounded-lg border-[#1d9549] text-[#1d9549] flex justify-center items-center">
                                <Link />
                            </button>
                        </div>
                    </span>
                    <div className="mt-[2vh] text-xl flex items-center gap-3">
                        <p onClick={() => setPage("files")} className={`cursor-pointer ${page === "files" ? `font-bold text-primary underline` : ``}`}>Files</p>
                        <p onClick={() => setPage("contributors")} className={`cursor-pointer ${page === "contributors" ? `font-bold text-primary underline` : ``}`}>Contributor</p>
                        <p onClick={() => setPage("rules")} className={`cursor-pointer ${page === "rules" ? `font-bold text-primary underline` : ``}`}>Guidelines</p>
                    </div>
                    { page === "files" && (<Files />)}
                    { page === "contributors" && (<Contributors project={project} setPage={setPage}/>)}
                    { page === "rules" && (<Guidelines />)}
                </div>
            ) : 
            <div className="pt-[16vh] flex justify-center items-center">
                <p className="text-primary text-5xl font-bold">Loading......</p>
            </div>
            }
        </div>
    )
}

export default Project