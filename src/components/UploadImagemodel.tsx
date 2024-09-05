import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { CircleX, Trash, Upload, File } from "lucide-react";
import { storage } from "../firebase/config";
import toast from "react-hot-toast";
import { addImage } from "../firebase/functions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectwithrole } from "../pages/Project";

type Props = {
    setModel: React.Dispatch<React.SetStateAction<boolean>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    project: projectwithrole
}

const UploadImagemodel = (props: Props) => {
    const [fileupload, setFileupload] = useState<FileList | null>(null)
    const navigate = useNavigate()

    const getImageUrl = async () => {
        props.setLoading(true)
        props.setModel(false)
        if(!fileupload) return 
        const Uploadedfile = fileupload[0];
        if (Uploadedfile === null) return;
        if (Uploadedfile && Uploadedfile.size > 3000000) {
            toast.error("File size exceeds: (Max size: 3MB)")
            props.setLoading(false)
            props.setModel(true)
            return
        }
        const limit = (Number(((Uploadedfile.size/1024)/1024).toFixed(4)) + props.project.limit)
        if (Uploadedfile && limit > 50) {
            toast.error("Peoject size exceeds: (Max size: 50MB)")
            props.setLoading(false)
            props.setModel(true)
            return
        }
        const imageRef = ref(storage, `Filehub/${Uploadedfile.name}`);
        await uploadBytes(imageRef, Uploadedfile).then((snapshot) => {
            getDownloadURL(snapshot.ref).then(async(url) => {
                ImageUpload(url, Uploadedfile.type.split("/")[0], Uploadedfile.name, limit)
            })
        })
    }

    const ImageUpload = async (url:string, FT: string, name: string, limit: number) => {
        try{
            await addImage(props.project.id, url, FT, name, limit)
            setFileupload(null)
            navigate(0)
            props.setLoading(false)
        } catch {
            toast.error("An error occurred")
        }
    };

  return (
    <div className="h-full w-full flex items-center justify-center fixed inset-0 backdrop-filter backdrop-blur-lg z-50">
        <div className="bg-[white] relative rounded-xl shadow-xl flex flex-col justify-center px-5 w-72 sm:w-96 py-[40px]">
            <button className="absolute top-2.5 right-2.5" onClick={() => {props.setModel(false); setFileupload(null)}}>
                <CircleX className="text-[#1d9549]" />
            </button>
            {!fileupload && 
            (<div className="relative h-[140px] border-[2px] rounded-xl border-[#1d9549] flex justify-center items-center">
                <input name="file" className="absolute z-[20] w-[320px] h-[140px] opacity-0" type="file" onChange={(e) => {setFileupload(e.target.files)}}/>
                <div className="absolute z-[18] font-bold text-2xl text-[#1d9549] flex justify-center items-center flex-col">
                    <Upload size={40}/>
                    <h1>Upload File</h1>
                    <span className="text-sm font-normal">(Max size: 3MB)</span>
                </div>
                
            </div>)}
            {fileupload !== null && 
                (
                    <div className="h-[50px] my-2 border-[2px] border-[#1d9549] rounded-lg flex justify-between p-2 items-center">
                        <span className="text-[#1d9549] flex items-center gap-2 text-lg">
                            <File />
                            {fileupload[0].name}
                        </span>
                        <span onClick={() => setFileupload(null)} className="text-[red] cursor-pointer">
                            <Trash />
                        </span>
                    </div>    
                )
            }
            <button
                disabled={fileupload === null} 
                onClick={getImageUrl}
                className="rounded-md mt-2 flex gap-2 items-center justify-center text-[white] bg-[#1d9549] px-6 py-2.5 text-lg font-semibold hover:opacity-90 transition-all duration-700 disabled:opacity-50"
            >
                Confirm Upload
            </button>
        </div>
    </div>
  )
}

export default UploadImagemodel