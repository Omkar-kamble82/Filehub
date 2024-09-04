import { GoogleAuthProvider, signInWithPopup, signOut, getAuth } from "firebase/auth";
import { auth, db } from "./config";
import toast from "react-hot-toast";
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

type userProject = {
  id: string;
  Type: string;
}

type user = {
  username: string,
  Type: string;
}

export const Login = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
};

export const Logout = () => {
    const auth = getAuth();
    localStorage.removeItem("projects")
    signOut(auth).catch((error) => {
        console.error("Error signing out:", error);
        toast.error("Failed to log out");
    });
};

export const generateId = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

export const createProjectFunction = async (name: string): Promise<void> => {
    if (!name.trim()) {
        toast.error("Project name cannot be empty");
        return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        toast.error("User not authenticated");
        return;
    }

    try {
        const username = user.email as string;
        const docRef = doc(db, "users", username);
        const docSnap = await getDoc(docRef);
        const docId = `${generateId()}${name}`;

        if (docSnap.exists()) {
            const userData = docSnap.data();
            if (userData.projects?.length >= 2) {
                toast.error("Project limit exceeded!!");
                return;
            }

            const updatedProjects = [...userData.projects, { id: docId, Type: "Admin" }];
            await updateDoc(docRef, { projects: updatedProjects });
        } else {
            await setDoc(docRef, {
                username: user.displayName as string,
                email: username,
                photoURL: user.photoURL,
                projects: [{ id: docId, Type: "Admin" }],
            });
        }
        await setDoc(doc(db, "projects", docId), {
          id: docId,
          name,
          limit: 0.00,
          creator: user.displayName as string,
          users: [{ username: username, Type: "Admin" }],
      });

        toast.success(`${name} project was created!!🎉🎉`);
    } catch (error) {
        console.error("Error creating project:", error);
        toast.error("Something went wrong!!❌❌");
    }
};

export const getUser = async () => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return undefined;

        const username = user.email as string;
        const docRef = doc(db, "users", username);
        const docSnap = await getDoc(docRef);
        return docSnap;
    } catch (error) {
        console.error("Error fetching user document:", error);
        return undefined;
    }
};

export const getProjects = async () => {
  console.log("000")
  try {
    const docSnap = await getUser();
    if (docSnap?.exists()) {
      const projectList = docSnap.data().projects || [];
      const projectData = await Promise.all(
        projectList.map(async (project: { id: string }) => {
          const projectDocRef = doc(db, "projects", project.id);
          const projectDocSnap = await getDoc(projectDocRef);
          const data = projectDocSnap.data();
          return data ? { id: project.id, ...data } : null;
        })
      );
      
      const filteredProjectData = projectData.filter((data) => data !== null);
      localStorage.setItem("projects", JSON.stringify(filteredProjectData));
      return projectData;
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};

export const deleteProject = async (id: string) => {
  try {
      const docRef = doc(db, "projects", id);
      const docSnap = await getDoc(docRef);
      if(!docSnap.exists()) {
        toast.error("Project does not exist!!")
        return 
      }
      const users = docSnap.data().users as user[]
      users.forEach(async (user) => {
        const docRef = doc(db, "users", user.username);
        const docSnap = await getDoc(docRef);
        if (docSnap?.exists()) {
          const updatedProjects = docSnap?.data().projects.filter((project: userProject) => project.id!== id)
          await updateDoc(docRef, { projects: updatedProjects })
        }
      })
      await deleteDoc(docRef);
      toast.success("Project deleted successfully!!")
  } catch {
    console.log("Error occurred while deleting project")
  }
}

export const joinWithLink = async (link: string) => {
  const li = link.split("/")
  const projectId = li[li.length- 1]
  if (li[2] !== "file-hub-rho.vercel.app"){
    toast.error("Invalid link!!");
    return 
  }
  if (!projectId.trim()) {
    toast.error("Project name cannot be empty");
    return;
  }

  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
      toast.error("User not authenticated");
      return;
  }

  const docRefProject = doc(db, "projects", projectId);
  const docSnapProject = await getDoc(docRefProject);
  if (!docSnapProject.exists()) {
    toast.error("Invalid Link");
    return;
  }

  try{
    const username = user.email as string;
    const docRef = doc(db, "users", username);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      if (userData.projects?.length >= 2) {
          toast.error("Project limit exceeded!!");
          return;
      }
      const updatedProjects = [...userData.projects, { id: projectId, Type: "Member" }];
      await updateDoc(docRef, { projects: updatedProjects });
    } else {
        await setDoc(docRef, {
            username: user.displayName as string,
            email: username,
            photoURL: user.photoURL,
            projects: [{ id: projectId, Type: "Member" }],
        });

      }
      const userarr = docSnapProject.data().users
      userarr.push({username: username, Type: "Member"})

      await updateDoc(docRefProject, {
          users: userarr
      });
    
      toast.success("Project joined successfully🎉🎉")
  } catch {
    toast.error("Error occurred while joining a project!!")
  }
}

export const getProject = async (id: string) => {
  const docRef = doc(db, "projects", id);
  const docSnap = await getDoc(docRef);
  if(!docSnap.exists()) {
      toast.error("Project does not exist!!")
      return undefined
  }
  const project = docSnap.data()
  localStorage.setItem("project", JSON.stringify(project))
  return project;
}