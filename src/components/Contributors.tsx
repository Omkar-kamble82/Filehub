import { ProjectType } from "../pages/Createproject"

type Props = {
    project: ProjectType
}

const Contibutors = (props: Props) => {
  return (
    <div className="h-[68vh] bg-[white] rounded-xl mt-[8px] p-2">
        <p className="text-3xl text-primary text-center font-bold mt-[20px]">Contributors</p>
        <div className="mt-[20px]">
            <div className="overflow-x-auto">
                <table className="min-w-full text-center divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Username</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Email Id</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Type</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Change Role</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {props.project.users.map((user, idx) =>
                        <tr key={idx}>
                            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 truncate max-w-[240px]">{user.username}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{user.Type}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{user.username}</td>
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

export default Contibutors