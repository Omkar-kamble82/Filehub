import { useParams } from "react-router-dom";

const Project = () => {
    const { id } = useParams();

    return (
        <>
            <div>Project {id}</div>
            <a href="/projects">Back home</a>
        </>
    )
}

export default Project