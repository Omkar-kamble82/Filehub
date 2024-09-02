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
    </div>
  )
}

export default Createproject