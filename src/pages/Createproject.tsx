import { getAuth } from "firebase/auth";
import { Logout } from "../firebase/functions";


const Createproject = () => {

  const auth = getAuth();
  const user = auth.currentUser;
  console.log("Projects: ", user?.displayName, user?.email, user?.photoURL, user)
  

  return (
    <div>
      <h1>Create a new project</h1>
      <button onClick={Logout}>Logout</button>
      <a href="/project/9283483748749" className="underline">Take me to a project</a>
    </div>
  )
}

export default Createproject