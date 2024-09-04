import { filesData } from "./constants"

const Files = () => {
  return (
    <div className="h-[68vh] overflow-x-auto mb-[10px] bg-[white] rounded-xl mt-[8px] p-2">
        <p className="text-3xl text-primary text-center font-bold mt-[20px]">Uplaoded Files</p>
        <div className="mt-[20px]">
            <div className="overflow-x-auto">
                <table className="min-w-full text-center divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Link</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Type</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Date added</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filesData.map((file, idx) =>
                            <tr key={idx}>
                                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 truncate max-w-[240px]">{file.Link}</td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{file.Type}</td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{file.date_added}</td>
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