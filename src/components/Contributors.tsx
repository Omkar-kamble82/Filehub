// import { useNavigate } from "react-router-dom";
// import { deleteuser, demote, promote } from "../firebase/functions"
import { projectwithrole } from "../pages/Project"
import { useState } from "react";
import RolechangeModel from "./RolechangeModel";
import { Shield, ShieldPlus, ShieldX } from "lucide-react";

type Props = {
    project: projectwithrole
    setPage: React.Dispatch<React.SetStateAction<string>>;
}

const Contibutors = (props: Props) => {
    // const navigate = useNavigate();
    const [model, setModel] = useState(false)
    const [action, setAction] = useState<"Promote" | "Demote" | "Delete" | "">("")
    const [email, setEmail] = useState("")

    // const promoteUser = async(email:string) => {
    //     await promote(email, props.project.id); 
    //     navigate(0)
    // }
    // const demoteUser = async(email:string) => {
    //     await demote(email, props.project.id)
    //     navigate(0)
    // }
    // const deleteUserfunction = async(email:string) => {
    //     await deleteuser(email, props.project.id)
    //     navigate(0)
    // }
    
  return (
    <div className="h-[68vh] bg-[white] rounded-xl mt-[8px] p-2">
        {model && <RolechangeModel setRolechangemodel={setModel} action={action} email={email} projectId={props.project.id}/>}
        
        <p className="text-3xl text-primary text-center font-bold mt-[20px]">Contributors</p>
        <div className="mt-[20px]">
            <div className="overflow-x-auto">
                <table className="min-w-full text-center divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Username</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Email Id</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Type</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Change Role / Delete User</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 ${}">
                        {props.project.users.map((user, idx) =>
                        <tr key={idx} className={`${props.project.email === user.email && `bg-background`}`}>
                            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 truncate max-w-[240px]">{user.username}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{user.email}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700 flex items-center gap-1 justify-center">
                                {user.Type}
                                {user.Type === "Member" && <Shield size={15}/>}
                                {user.Type === "Moderator" &&<ShieldPlus size={18} />}
                                {user.Type === "Admin" && <ShieldX size={24}/>}
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                {
                                    props.project.email === user.email || user.Type === "Admin" || props.project.Role === "Member" ? (" ") : (
                                        <div className="flex items-center justify-center gap-1">
                                            {user.Type === "Member" && <button className="px-2 rounded-xl text-[white] bg-[green]" onClick={() => {setModel(true); setAction("Promote"); setEmail(user.email)}}>Promote</button>}
                                            {user.Type === "Moderator" && <button className="px-2 rounded-xl text-[white] bg-[orange]" onClick={() => {setModel(true); setAction("Demote"); setEmail(user.email)}}>Demote</button>}
                                            {props.project.Role === "Admin" && <button className="px-2 rounded-xl text-[white] bg-[red]" onClick={() => {setModel(true); setAction("Delete"); setEmail(user.email)}}>Delete</button>}
                                        </div>
                                    )
                                }
                            </td>
                        </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default Contibutors