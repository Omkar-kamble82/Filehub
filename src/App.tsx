import Createproject from "./pages/Createproject";
import Homepage from "./pages/Homepage";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Project from "./pages/Project";


function App() {

  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
      } else if (location.pathname === "/") {
        navigate("/projects");
      }
    });
  
    return () => unsubscribe(); // Clean up the listener when the component unmounts
  }, [auth, navigate]);

  return (
    <div className=" min-h-screen">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/projects" element={<Createproject />} />
          <Route path="/project/:id" element={<Project />} />
        </Routes>
    </div>
  )
}

export default App
