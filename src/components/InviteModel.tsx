import { CircleX, Copy } from "lucide-react"
import { copyToClipboard } from "../firebase/functions";

type Props = {
    setInvitemodel: React.Dispatch<React.SetStateAction<boolean>>;
    id: string
}

const InviteModel = (props: Props) => {

    
  return (
    <div className="h-full w-full flex items-center justify-center fixed inset-0 backdrop-filter backdrop-blur-lg z-50">
        <div className="bg-[white] relative rounded-xl shadow-xl flex flex-col justify-center items-center px-5 w-88 sm:w-96 h-40">
            <button className="absolute top-2.5 right-2.5" onClick={() => props.setInvitemodel(false)}>
                <CircleX className="text-primary" />
            </button>
            <div>
                <h1 className="text-2xl text-center font-bold text-primary">Invite Link</h1>
                <span className="min-w-[300px] h-[35px] flex items-center justify-center border-[2px] px-[1px] rounded-md border-primary">
                    <p id="inviteLinkText" className="truncate max-w-[270px]">https://file-hub-rho.vercel.app/invite/{props.id}</p>
                    <span onClick={() => copyToClipboard("inviteLinkText")} className=""><Copy size={20}/></span>
                </span>
            </div>
        </div>
    </div>
  )
}

export default InviteModel