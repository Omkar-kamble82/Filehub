import { CircleX, Shield, ShieldPlus, Trash } from 'lucide-react'
import { useNavigate } from "react-router-dom";
import { deleteuser, demote, promote } from "../firebase/functions"
import React from 'react'

type Props = {
    action: string
    setRolechangemodel: React.Dispatch<React.SetStateAction<boolean>>;
    email: string
    projectId: string
}

const RolechangeModel = (props: Props) => {

    const navigate = useNavigate();

    const promoteUser = async() => {
        await promote(props.email, props.projectId); 
        navigate(0)
    }
    const demoteUser = async() => {
        await demote(props.email, props.projectId)
        navigate(0)
    } 
    const deleteUserfunction = async() => {
        await deleteuser(props.email, props.projectId)
        navigate(0)
    }

  return (
    <div className="h-full w-full flex items-center justify-center fixed inset-0 backdrop-filter backdrop-blur-lg z-50">
        <div className="bg-[white] relative rounded-xl shadow-xl flex flex-col justify-center items-center px-5 w-88 sm:w-96 h-40">
            <button className="absolute top-2.5 right-2.5" onClick={() => props.setRolechangemodel(false)}>
                <CircleX className={`${props.action === "Promote" && `text-[green]`} ${props.action === "Demote" && `text-[orange]`} ${props.action === "Delete" && `text-[red]`}`} />
            </button>
            <div className='flex justify-center items-center flex-col'>
                <h1 className="text-md text-center font-bold">Would you like to {props.action} <span className={`${props.action === "Promote" && `text-[green]`} ${props.action === "Demote" && `text-[orange]`} ${props.action === "Delete" && `text-[red]`} font bold`}>
                    {props.email}</span> ?
                </h1>
                {props.action === "Promote" && (<button
                    onClick={() => promoteUser()}
                    className="rounded-md mt-1 flex gap-2 items-center justify-center text-[white] bg-[green] px-6 py-2.5 text-lg font-semibold hover:opacity-90 transition-all duration-700 disabled:opacity-50"
                >
                    <ShieldPlus />
                    Promote User
                </button>)}
                {props.action === "Demote" && (<button
                    onClick={() => demoteUser()}
                    className="rounded-md mt-1 flex gap-2 items-center justify-center text-[white] bg-[orange] px-6 py-2.5 text-lg font-semibold hover:opacity-90 transition-all duration-700 disabled:opacity-50"
                >
                    <Shield />
                    Demote User
                </button>)}
                {props.action === "Delete" && (<button
                    onClick={() => deleteUserfunction()}
                    className="rounded-md mt-1 flex gap-2 items-center justify-center text-[white] bg-[red] px-6 py-2.5 text-lg font-semibold hover:opacity-90 transition-all duration-700 disabled:opacity-50"
                >
                    <Trash />
                    Delete User
                </button>)}
            </div>
        </div>
    </div>
  )
}

export default RolechangeModel