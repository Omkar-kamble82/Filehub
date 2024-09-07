import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useEffect, useState } from 'react';
import { projectwithrole } from '../pages/Project';
import { Link } from 'lucide-react';
import toast from 'react-hot-toast';
  
type Props = {
    project: projectwithrole

}

type file = {
    name:string,
    link:string,
}

const Codefiles = (props: Props) => {

    const [data, setData] = useState<file[]>([])

    const handleChange = (value: string) => {
        if(value === "all") {
            const f =  props.project.files.map(({ id, link }) => ({
                name: id,  
                link: link
            }));
            setData(f)
            return
        }
        if(value === "doc") {
            const f =  props.project.files.filter((file) => (file.type === "application"));
            const changedarr =  f.map(({ id, link }) => ({
                name: id,  
                link: link
            }));
            setData(changedarr)
            return
        }
        if(value === "img") {
            const f =  props.project.files.filter((file) => (file.type === "image"));
            const changedarr =  f.map(({ id, link }) => ({
                name: id,  
                link: link
            }));
            setData(changedarr)
            return
        }
        if(value === "vid") {
            const f =  props.project.files.filter((file) => (file.type === "video"));
            const changedarr =  f.map(({ id, link }) => ({
                name: id,  
                link: link
            }));
            setData(changedarr)
            return
        }
        if(value === "aud") {
            const f =  props.project.files.filter((file) => (file.type === "audio"));
            const changedarr =  f.map(({ id, link }) => ({
                name: id,  
                link: link
            }));
            setData(changedarr)
            return
        }
    }
    const handleClick = () => {
        navigator.clipboard.writeText(JSON.stringify(data))
        .then(() => {
          toast.success("Copy to clipboard");
        })
        .catch((err) => {
          console.error('Failed to copy: ', err);
        });
    }

    useEffect(() => {
        const f =  props.project.files.map(({ id, link }) => ({
            name: id,  
            link: link
        }));
        setData(f)
    }, [])
    

  return (
    <div className="h-[63vh] sm:h-[65vh] bg-[white] rounded-xl my-[8px] p-2">
        <p className="text-3xl text-primary text-center font-bold mt-[20px]">Code</p>
        {props.project.files ?
            (
                <>
                    <div className='flex justify-between item-center'>
                        <select onChange={(e) => handleChange(e.target.value)} className="flex items-center gap-2 flex-wrap border-primary border-[2px] text-[15px] sm:text-lg outline-none rounded-lg px-2">
                            <option value="all">All</option>
                            <option value="doc">Document Files</option>
                            <option value="img">Image Files</option>
                            <option value="vid">Video Files</option>
                            <option value="aud">Audio Files</option>
                        </select>
                        {
                        data.length ? (
                            <button onClick={handleClick} className='text-[15px] sm:text-lg flex items-center p-2  sm:gap-1 bg-[green] text-[white] font-bold rounded-lg'> <Link size={20}/>copy json</button>
                            ) : (
                            <></>
                            )
                        }
                    </div>
                    {data.length ? 
                    (<div className='h-[45vh] sm:h-[48vh] xl:h-[42vh] rounded-xl mt-[10px] overflow-scroll'>
                        <SyntaxHighlighter language="json" style={docco}>
                            {JSON.stringify(data, null, 2)}
                        </SyntaxHighlighter>
                    </div>)
                    :
                    (<></>)
                    }
                </>
            ) : (
                <div className='flex justify-center mt-[15px] rounded-xl items-center h-[48vh] bg-[#eee]'>
                    <h1 className='text-2xl font-bold text-primary'>No files avaliable</h1>
                </div>
            )
        }
    </div>
  )
}

export default Codefiles
