import { CircleX, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteFile } from "../firebase/functions";

type Props = {
    setDeleteModel: React.Dispatch<React.SetStateAction<boolean>>;
    setDeleteLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setFilename: React.Dispatch<React.SetStateAction<string>>;
    name: string
    projectId:string
}

const DeleteFile = (props: Props) => {

    const navigate = useNavigate()
    const deletefilefunction = async() => {
        props.setDeleteLoading(true)
        props.setDeleteModel(false)
        try{
            await deleteFile(props.name, props.projectId)
            navigate(0)
            props.setDeleteLoading(false)
        } catch {
            console.log("Something went wrong")
        } finally {
            props.setDeleteLoading(false)
        }
    }

  return (
    <div className="h-full w-full flex items-center justify-center fixed inset-0 backdrop-filter backdrop-blur-lg z-50">
        <div className="bg-[white] relative rounded-xl shadow-xl flex flex-col justify-center items-center px-5 w-88 sm:w-96 h-40">
            <button className="absolute top-2.5 right-2.5" onClick={() => props.setDeleteModel(false)}>
                <CircleX className="text-[red]" />
            </button>
            <div className='flex justify-center items-center flex-col'>
                <h1 className="text-md text-center font-bold">Would you like to delete <span className={`text-[red] font bold`}>
                    {props.name}</span> ?
                </h1>
                <button
                    onClick={deletefilefunction}
                    className="rounded-md mt-1 flex gap-2 items-center justify-center text-[white] bg-[red] px-6 py-2.5 text-lg font-semibold hover:opacity-90 transition-all duration-700 disabled:opacity-50"
                >
                    <Trash />
                    Delete File
                </button>
            </div>
        </div>
    </div>
  )
}

export default DeleteFile