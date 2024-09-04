import { CircleX, Trash } from 'lucide-react';
import React, { useState } from 'react'
import { ProjectType } from '../pages/Createproject';
import { useNavigate } from 'react-router-dom';
import { deleteProject, getProjects } from '../firebase/functions';

type Props = {
    setDeletemodel: React.Dispatch<React.SetStateAction<boolean>>;
    setDeleteLoading: React.Dispatch<React.SetStateAction<boolean>>;
    project: ProjectType
    id: string;
}

const DeleteModel = (props: Props) => {

    const [projectname, setProjectName] = useState("")
    const navigate = useNavigate();

    const handleDelete = async () => {
        props.setDeleteLoading(true);
        try {
            await deleteProject(props.id);
            await getProjects()
            props.setDeleteLoading(false);
            navigate("/projects")
        } catch {
            console.log("Error occurred while deleting project")
        } finally {
            props.setDeleteLoading(false);
        }
    }

  return (
    <div className="h-full w-full flex items-center justify-center fixed inset-0 backdrop-filter backdrop-blur-lg z-50">
        <div className="bg-[white] relative rounded-xl shadow-xl flex flex-col justify-center px-5 w-72 sm:w-96 h-64">
            <button className="absolute top-2.5 right-2.5" onClick={() => {props.setDeletemodel(false); setProjectName("")}}>
                <CircleX className="text-[#ff4d00fe]" />
            </button>
            <span>If you want delete this project type <span className="font-bold text-[#ff4d00fe]">"{props.project?.name}"</span> in the input to confirm deletion.</span>
            <input
                onChange={(e) => setProjectName(e.target.value)}
                className="border-2 border-[#ff4d00fe] py-2 px-4 mt-4 rounded-md outline-none"
                type="text"
                id="name"
                placeholder="Enter project name..."
            />
            <button
                disabled={projectname !== props.project?.name}
                onClick={handleDelete}
                className="rounded-md flex gap-1 mt-2 items-center justify-center text-[white] bg-[#ff4d00fe] px-6 py-2.5 text-lg font-semibold hover:opacity-90 transition-all duration-700 disabled:opacity-50"
                >
                <Trash />
                Delete project
            </button>
            <p className="text-xs mt-1 text-[#ff4d00fe]">*The deletion of the project would affect all contributors if any.</p>
        </div>
    </div>
  )
}

export default DeleteModel