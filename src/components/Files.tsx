import { FileUp } from "lucide-react"
import { projectwithrole } from "../pages/Project";
import { useState } from "react";
import Loading from "./Loading";
import UploadImagemodel from "./UploadImagemodel";
import { copyToClipboard } from "../firebase/functions";
import DeleteFile from "./DeleteFile";

type Props = {
    project: projectwithrole
}

const Files = (props: Props) => {

    const [model, setModel] = useState(false)
    const [filename, setFilename] = useState("")
    const [modeldelete, setDeleteModel] = useState(false)
    const [loading, setLoading] = useState(false)
    const [deleteloading, setDeleteLoading] = useState(false)

  return (
    <div className="h-[63vh] sm:h-[65vh] shadow-xl overflow-x-auto mb-[10px] bg-[white] rounded-xl mt-[8px] p-2">
        { loading && (<Loading Message="Uploading File"/> )}
        { deleteloading && (<Loading Message="Deleting File"/> )}
        { model && (<UploadImagemodel setLoading={setLoading} setModel={setModel} project={props.project}/> )}
        { modeldelete && (<DeleteFile setDeleteLoading={setDeleteLoading} setDeleteModel={setDeleteModel} name={filename} setFilename={setFilename} projectId={props.project.id}/>)}
        {props.project.files.length ? 
        (
            <div>
                <div className="flex justify-between sm:mx-[10px] items-center">
                    <p className="text-xl sm:text-3xl text-primary font-bold mt-[20px]">Uplaoded Files</p>
                    {props.project.Role !== "Member" && (
                    <button
                        disabled={props.project.limit >= 50}
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
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Link  (tap to copy)</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Type</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Date added</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Size</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {props.project.files.map((file, idx) =>
                                    <tr key={idx}>
                                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 truncate max-w-[100px]" title={file.id}>{file.id}</td>
                                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 truncate max-w-[240px] cursor-pointer" id="filelink" onClick={() => {copyToClipboard("filelink")}} title={file.link}>{file.link}</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                            {file.type === "video" && <span>Video</span>}
                                            {file.type === "application" && <span>Document</span>}
                                            {file.type === "audio" && <span>Audio</span>}
                                            {file.type === "image" && <span>Image</span>}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{file.dateadded}</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{file.size.toFixed(2)} MB</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                            <div className="flex items-center justify-center gap-1">
                                                <a href={file.link} target="_blank"><button className="px-2 rounded-xl text-[white] bg-[green]">Download</button></a>
                                                {props.project.Role !== "Member" && <button onClick={() => {setFilename(file.id);setDeleteModel(true)}} className="px-2 rounded-xl text-[white] bg-[red]" >Delete</button>}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
        :
        (
            <div className="flex justify-center items-center h-full">
                <div className="h-[240px] w-[300px] rounded-xl flex justify-center flex-col items-center">
                    <h1 className="text-xl font-medium text-center">Start your project by uploading your project files.</h1>
                    {props.project.Role !== "Member" && (
                    <button
                        disabled={props.project.limit >= 50}
                        onClick={() => {
                            setModel(true);
                        }}
                        className="rounded-md mt-4 flex gap-2 items-center justify-center text-[white] bg-[#1d9549] px-6 py-2.5 text-lg font-semibold hover:opacity-90 transition-all duration-700 disabled:opacity-50"
                    >
                    <FileUp /> 
                    Upload File
                    </button>)}
                </div>
            </div>
        )}
    </div>
  )
}

export default Files