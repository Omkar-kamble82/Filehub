import { CircleX, FileUp, Upload, File, Trash } from "lucide-react"
import { projectwithrole } from "../pages/Project";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/config";
import { useState } from "react";
import toast from "react-hot-toast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Loading from "./Loading";
import { getProject } from "../firebase/functions";
import { useNavigate } from "react-router-dom";

type Props = {
    project: projectwithrole
}

const Files = (props: Props) => {

    const [fileupload, setFileupload] = useState<FileList | null>(null)
    const [model, setModel] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const getImageUrl = async () => {
        setLoading(true)
        setModel(false)
        if(!fileupload) return 
        const Uploadedfile = fileupload[0];
        if (Uploadedfile === null) return;
        if (Uploadedfile && Uploadedfile.size > 3000000) {
            toast.error("File size exceeds: (Max size: 3MB)")
            setLoading(false)
            setModel(true)
            return
        }
        const imageRef = ref(storage, `Filehub/${Uploadedfile.name}`);
        await uploadBytes(imageRef, Uploadedfile).then((snapshot) => {
            getDownloadURL(snapshot.ref).then(async(url) => {
                ImageUpload(url, Uploadedfile.type.split("/")[0], Uploadedfile.name)
            })
        })
    }

    const ImageUpload = async (url:string, FT: string, name: string) => {
        try{
            const date = new Date();
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            const projectobject = {id: name, type: FT, dateadded: formattedDate, link: url}
            const docRef = doc(db, "projects", props.project.id);
            const docSnap = await getDoc(docRef);
             if(docSnap.exists()){
                const updatedprojects = docSnap.data().files
                updatedprojects.push(projectobject)
                console.log(projectobject)
                await updateDoc(docRef, { files: updatedprojects });
            }
            toast.success("File uploaded successfully")
            setFileupload(null)
            await getProject(props.project.id)
            navigate(0)
            setLoading(false)
        } catch {
            console.log("An error occurred")
        }
    };

  return (
    <div className="h-[68vh] overflow-x-auto mb-[10px] bg-[white] rounded-xl mt-[8px] p-2">
        {loading && <Loading Message="Uploading File"/>}
        {model && (
            <div className="h-full w-full flex items-center justify-center fixed inset-0 backdrop-filter backdrop-blur-lg z-50">
                <div className="bg-[white] relative rounded-xl shadow-xl flex flex-col justify-center px-5 w-72 sm:w-96 py-[40px]">
                    <button className="absolute top-2.5 right-2.5" onClick={() => {setModel(false); setFileupload(null)}}>
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
        )}
        <div className="flex justify-between mx-[10px] items-center">
            <p className="text-3xl text-primary font-bold mt-[20px]">Uplaoded Files</p>
            {props.project.Role !== "Member" && (
            <button
                onClick={() => {
                    setModel(true);
                }}
                className="rounded-md mt-4 flex gap-2 items-center justify-center text-[white] bg-[#1d9549] px-6 py-2.5 text-lg font-semibold hover:opacity-90 transition-all duration-700 disabled:opacity-50"
            >
              <FileUp /> 
              Upload File
            </button>)}
        </div>
        <div className="mt-[20px]">
            <div className="overflow-x-auto">
                <table className="min-w-full text-center divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Name</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Link</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Type</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Date added</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {props.project.files.map((file, idx) =>
                            <tr key={idx}>
                                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 truncate max-w-[100px]" title={file.id}>{file.id}</td>
                                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 truncate max-w-[240px] cursor-pointer" title={file.link}>{file.link}</td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                    {file.type === "video" && <span>Video</span>}
                                    {file.type === "application" && <span>Document</span>}
                                    {file.type === "audio" && <span>Audio</span>}
                                    {file.type === "image" && <span>Image</span>}
                                </td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{file.dateadded}</td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">Delete / Download</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default Files