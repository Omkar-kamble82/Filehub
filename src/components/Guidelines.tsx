import { Shield, ShieldPlus, ShieldX } from "lucide-react"

const Guidelines = () => {
  return (
    <div className="h-[63vh] sm:h-[65vh] overflow-x-auto mb-[10px] bg-[white] rounded-xl mt-[8px] p-2">
        <p className="text-3xl text-primary text-center font-bold mt-[20px]">Guidelines</p>
        <div className="mt-[5px] sm:mt-[20px] text-md sm:text-xl">
            <div className=""><span className="font-bold text-primary text-lg sm:text-2xl">1.  </span> There are three roles for collaborators: 
              <div className="font-bold text-primary ml-[30px] text-lg sm:text-2xl flex items-center gap-1 flex-wrap">
                Admin <ShieldX size={24}/>, Moderator <ShieldPlus size={18} />, and Member <Shield size={15}/>.
              </div>
            </div>
            <p className="mt-[8px]"><span className="font-bold text-primary text-lg sm:text-2xl">2.   Admin:</span> The Admin is the project creator and has the highest level of control. Admins can:</p>
            <div className="ml-[20px]">
                <p><span className="font-bold text-primary text-lg sm:text-2xl">2.a:</span> Delete the project.</p>
                <p><span className="font-bold text-primary text-lg sm:text-2xl">2.b:</span> Promote, demote and delete Moderators and Members.</p>
                <p><span className="font-bold text-primary text-lg sm:text-2xl">2.c:</span> Upload, delete, and download any documents.</p>
            </div>
            <p className="mt-[8px]"><span className="font-bold text-primary text-lg sm:text-2xl">3.   Moderator:</span> Moderators have significant control but cannot delete the project. Moderators can:</p>
            <div className="ml-[20px]">
                <p><span className="font-bold text-primary text-lg sm:text-2xl">3.a:</span> Promote or demote Moderators and Members.</p>
                <p><span className="font-bold text-primary text-lg sm:text-2xl">3.b:</span> Upload, delete, and download any documents.</p>
            </div>
            <p className="mt-[8px]"><span className="font-bold text-primary text-lg sm:text-2xl">4.   Member:</span> Members have limited access and can only download documents.</p>
        </div>
    </div>
  )
}

export default Guidelines