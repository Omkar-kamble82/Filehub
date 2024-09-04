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

const Project = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);
    const [deleteloading,setDeleteLoading] = useState(false);
    const [project, setProject] = useState<ProjectType | null>(null);
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
            {inviteModel && ( <InviteModel setInvitemodel={setInvitemodel}/>)}
            {project ? (
                <div className="pt-[16vh] w-[96vw] mx-auto">
                    <span className="flex justify-between items-center">
                        <h1 className="text-primary text-5xl font-bold">{project.name}</h1>
                        <div className="flex item-center gap-2">
                            <button onClick={() => setDeletemodel(true)} className="h-[40px] w-[35px] border-[1px] rounded-lg border-[#ff4d00fe] text-[#ff4d00fe] flex justify-center items-center">
                                <Trash />
                            </button>
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
                    { page === "contributors" && (<Contributors project={project}/>)}
                    { page === "rules" && (
                        <div className="h-[68vh] overflow-x-auto mb-[10px] bg-[white] rounded-xl mt-[8px] p-2">
                            <p className="text-3xl text-primary text-center font-bold mt-[20px]">Guidelines</p>
                            <div className="mt-[20px]">
                                <p className="text-xl"><span className="font-bold text-primary text-2xl">1.  </span> There are three roles for collaborators: <span className="font-bold text-primary text-2xl">Admin</span>, <span className="font-bold text-primary text-2xl">Moderator</span>, and <span className="font-bold text-primary text-2xl">Member</span>.</p>
                                <p className="text-xl mt-[8px]"><span className="font-bold text-primary text-2xl">2.   Admin:</span> The Admin is the project creator and has the highest level of control. Admins can:</p>
                                <div className="text-xl ml-[20px]">
                                    <p><span className="font-bold text-primary text-2xl">2.a:</span> Delete the project.</p>
                                    <p><span className="font-bold text-primary text-2xl">2.b:</span> Promote or demote Moderators and Members.</p>
                                    <p><span className="font-bold text-primary text-2xl">2.c:</span> Upload, delete, and download any documents.</p>
                                </div>
                                <p className="text-xl mt-[8px]"><span className="font-bold text-primary text-2xl">3.   Moderator:</span> Moderators have significant control but cannot delete the project. Moderators can:</p>
                                <div className="text-xl ml-[20px]">
                                    <p><span className="font-bold text-primary text-2xl">3.a:</span> Promote or demote Moderators and Members.</p>
                                    <p><span className="font-bold text-primary text-2xl">3.b:</span> Upload, delete, and download any documents.</p>
                                </div>
                                <p className="text-xl mt-[8px]"><span className="font-bold text-primary text-2xl">4.   Member:</span> Members have limited access and can only download documents.</p>
                            </div>
                        </div>
                    )}
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