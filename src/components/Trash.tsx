import toast from "react-hot-toast"
import { projectwithrole } from "../pages/Project"
import { useState } from "react"
import DeleteFile from "./DeleteFile"
import Loading from "./Loading"
import { resortFile } from "../firebase/functions"
import { useNavigate } from "react-router-dom"

type Props = {
  project: projectwithrole
}

const Trashfile = (props: Props) => {

  const [modeldelete, setDeleteModel] = useState(false)
  const [filename, setFilename] = useState("")
  const [deleteloading, setDeleteLoading] = useState(false)
  const [restoreloading, setRestoreLoading] = useState(false)

  const navigate = useNavigate()

  const copy = (data: string) => {
    navigator.clipboard.writeText(data)
    .then(() => {
      toast.success("Copy to clipboard");
    })
    .catch((err) => {
      console.error('Failed to copy: ', err);
    });
  }

  const restore = async (projectId: string, fileId: string) => {
    setRestoreLoading(true)
    try{
      await resortFile(projectId, fileId)
      navigate(0)
    setRestoreLoading(false)
    } catch {
      console.log("something went wrong")
    }
  }

  return (
    <div className="h-[63vh] sm:h-[65vh] bg-[white] rounded-xl mt-[8px] p-2">
        <p className="text-3xl text-primary text-center font-bold mt-[20px]">Trash file</p>
        { deleteloading && (<Loading Message="Deleting File"/> )}
        { restoreloading && (<Loading Message="Restoring File"/> )}
        { modeldelete && (<DeleteFile setDeleteLoading={setDeleteLoading} setDeleteModel={setDeleteModel} name={filename} setFilename={setFilename} projectId={props.project.id}/>)}
        { props.project.trash.length ? 
        (
          <div className="mt-[20px]">
            <p className="text-sm text-[#ff612c] mt-[10px] ml-[10px]">*Trash files will be retained for up to 30 days.</p>
              <div className="overflow-x-auto">
                  <table className="min-w-full text-center divide-y-2 divide-gray-200 bg-white text-sm">
                      <thead className="ltr:text-left rtl:text-right">
                          <tr>
                              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Name</th>
                              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Link  (tap to copy)</th>
                              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Type</th>
                              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Deleted Date</th>
                              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Size</th>
                              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                          {props.project.trash.map((file) =>
                              <tr key={file.file[0].id}>
                                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 truncate max-w-[100px]" title={file.file[0].id}>{file.file[0].id}</td>
                                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 truncate max-w-[240px] cursor-pointer" id="filelink" onClick={() => {copy(file.file[0].link)}} title={file.file[0].link}>{file.file[0].link}</td>
                                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                      {file.file[0].type === "video" && <span>Video</span>}
                                      {file.file[0].type === "application" && <span>Document</span>}
                                      {file.file[0].type === "audio" && <span>Audio</span>}
                                      {file.file[0].type === "image" && <span>Image</span>}
                                  </td>
                                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{file.deletedate}</td>
                                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{file.file[0].size.toFixed(2)} MB</td>
                                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                      <div className="flex items-center justify-center gap-1">
                                          <a href={file.file[0].link} target="_blank"><button className="px-2 rounded-xl text-[white] bg-[green]">Download</button></a>
                                          <button className="px-2 rounded-xl text-[white] bg-[orange]" onClick={() => restore(props.project.id, file.file[0].id)}>Restore</button>
                                          {props.project.Role !== "Member" && <button onClick={() => {setFilename(file.file[0].id);setDeleteModel(true)}} className="px-2 rounded-xl text-[white] bg-[red]" >Delete</button>}
                                      </div>
                                  </td>
                              </tr>
                          )}
                      </tbody>
                  </table>
              </div>
            </div>
            )
            :
            (<div className="flex justify-center items-center h-full">
              <div className="h-[240px] w-[300px] rounded-xl flex flex-col items-center">
                  <h1 className="text-4xl font-bold text-primary text-center">No files in Trash.</h1>
              </div>
              </div>
            )
          }
      </div>
  )
}

export default Trashfile