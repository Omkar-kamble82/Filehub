import { GoogleAuthProvider, signInWithPopup, signOut, getAuth } from "firebase/auth";
import { auth, db } from "./config";
import toast from "react-hot-toast";
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";

type userProject = {
  id: string;
  Type: string;
}

type user = {
  username: string,
  email: string
  Type: string;
}

type file = {
  dateadded:string,
  id:string,
  link:string,
  type:string,
  size: number
}

export type Trashfile = {
  file: file[],
  deletedate: string
}

export const Login = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
};

export const Logout = () => {
    const auth = getAuth();
    localStorage.removeItem("projects")
    localStorage.removeItem("project")
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
          files: [],
          trash: [],
          limit: 0.00,
          creator: user.displayName as string,
          creatorEmail: user.email as string,
          users: [{ username: user.displayName, email: username, Type: "Admin" }],
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
      filteredProjectData.forEach(async(projectData) => {
        await getProject(projectData.id)
      })
      localStorage.setItem("projects", JSON.stringify(filteredProjectData));
      return JSON.parse(localStorage.getItem("projects") as string);
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
        const docRef = doc(db, "users", user.email);
        const docSnap = await getDoc(docRef);
        if (docSnap?.exists()) {
          const updatedProjects = docSnap?.data().projects.filter((project: userProject) => project.id!== id)
          await updateDoc(docRef, { projects: updatedProjects })
        }
      })
      if(docSnap.exists()){
        const filesarr: file[] = docSnap.data().files
        filesarr.forEach((file)=> {
          const storage = getStorage();
          const desertRef = ref(storage, `${id}/${file.id}`);
          deleteObject(desertRef).then(() => {}).catch(() => {console.log("something went wrong")})
        })
        const trash: Trashfile[] = docSnap.data().trash
        trash.forEach((f)=> {
          const storage = getStorage();
          const desertRef = ref(storage, `${id}/${f.file[0].id}`);
          deleteObject(desertRef).then(() => {}).catch(() => {console.log("something went wrong")})
        })
      }
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
      userarr.push({username: user.displayName, email: username, Type: "Member"})

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
  const auth = getAuth();
  const user = auth.currentUser;
  if(!docSnap.exists()) {
      toast.error("Project does not exist!!")
      return undefined
  }
  let project = docSnap.data()
  const trash: Trashfile[] = docSnap.data().trash
  trash.forEach(t => {
    if(been30days(t.deletedate)) {
      const storage = getStorage();
      const desertRef = ref(storage, `${id}/${t.file[0].id}`);
      deleteObject(desertRef).then(() => {
      }).catch(() => {
      });
    }
  })
  const updatedtrash = trash.filter(t => !been30days(t.deletedate))
  const deletedtrash = trash.filter(t => been30days(t.deletedate))

  let limit = docSnap.data().limit
  deletedtrash.map(tr => {
    limit -= tr.file[0].size
  })

  await updateDoc(docRef, { 
    trash: updatedtrash, 
    limit: limit
  });
  const docSnapnew = await getDoc(docRef);
  if (!docSnapnew.exists()) {
    toast.error("Project does not exist!!")
    return undefined
  }
  project = docSnapnew.data()
  let role: string = ""
  const users: user[] = project.users
  users.forEach((userInfo) => {
    if(user?.displayName === userInfo.username && user?.email === userInfo.email){
      role = userInfo.Type
    }
  })
  project = {...project, Role: role, username: user?.displayName, email: user?.email}
  localStorage.setItem("project", JSON.stringify(project))
  return project;
}

export const been30days = (dateadded: string) => {
  const [day, month, year] = dateadded.split('/').map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    throw new Error('Invalid date format');
  }
  const addedDate = new Date(year, month - 1, day); // Month is 0-indexed
  if (isNaN(addedDate.getTime())) {
    throw new Error('Invalid date object created');
  }
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - addedDate.getTime();
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  return daysDifference >= 15
}

export const promote = async(memberemail: string, projectId: string) => {
  try{
    const docRef = doc(db, "users", memberemail);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const project: userProject[] = docSnap.data().projects
      project.forEach((pro) => {
        if(pro.id === projectId){
          pro.Type = "Moderator";
        }
      })
      await updateDoc(docRef, { projects: project });
      const docRefproject = doc(db, "projects", projectId);
      const docSnapproject = await getDoc(docRefproject);
      if(docSnapproject.exists()){
        const usersarr: user[] = docSnapproject.data().users
        usersarr.forEach((userInfo) => {
          if(userInfo.email === memberemail){
            userInfo.Type = "Moderator";
          }
        })
        await updateDoc(docRefproject, {
            users: usersarr
        });
      }
    }
    toast.success("User promoted successfully!!")
    await getProject(projectId)
  } catch {
    toast.error("Something went wrong!!")
  }
}

export const demote = async(memberemail: string, projectId: string) => {
  try{
    const docRef = doc(db, "users", memberemail);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const project: userProject[] = docSnap.data().projects
      project.forEach((pro) => {
        if(pro.id === projectId){
          pro.Type = "Member";
        }
      })
      await updateDoc(docRef, { projects: project });
      const docRefproject = doc(db, "projects", projectId);
      const docSnapproject = await getDoc(docRefproject);
      if(docSnapproject.exists()){
        const usersarr: user[] = docSnapproject.data().users
        usersarr.forEach((userInfo) => {
          if(userInfo.email === memberemail){
            userInfo.Type = "Member";
          }
        })
        await updateDoc(docRefproject, {
            users: usersarr
        });
      }
    }
    toast.success("User demoted successfully!!")
    await getProject(projectId)
  } catch {
    toast.error("Something went wrong!!")
  }
}

export const deleteuser = async(memberemail: string, projectId: string) => {
  try{
    const docRef = doc(db, "users", memberemail);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const project: userProject[] = docSnap.data().projects
      const filteredproject = project.filter((pro) => pro.id !== projectId)
      await updateDoc(docRef, { projects: filteredproject });
      const docRefproject = doc(db, "projects", projectId);
      const docSnapproject = await getDoc(docRefproject);
      if(docSnapproject.exists()){
        const usersarr: user[] = docSnapproject.data().users
        const filtereduser = usersarr.filter((user) => user.email !== memberemail)
        await updateDoc(docRefproject, {
            users: filtereduser
        });
      }
    }
    toast.success("User deleted successfully!!")
    await getProject(projectId)
  } catch {
    toast.error("Something went wrong!!")
  }
}

export const addImage = async(projectId:string, url:string, FT:string, name:string, limit: number, size: number) => {
  try{
    const date = new Date();
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const projectobject = {id: name, type: FT, dateadded: formattedDate, link: url, size}
    const docRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(docRef);
     if(docSnap.exists()){
        const updatedprojects = docSnap.data().files
        updatedprojects.push(projectobject)
        await updateDoc(docRef, { 
          files: updatedprojects,
          limit: limit 
        });
    }
    toast.success("File uploaded successfully")
    await getProject(projectId)
  } catch {
    toast.error("Something went wrong!!")
  }
}

export const copyToClipboard = (id: string) => {
    const textElement = document.getElementById(id);
    if (textElement) { // Check if the element exists
      const textToCopy = textElement.innerText;
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          toast.success("Copy to clipboard");
        })
        .catch((err) => {
          console.error('Failed to copy: ', err);
        });
    } else {
      console.error('Element not found');
    }
};

export const deleteFile = async(fileId: string, projectId: string) => {
  try{
    console.log(fileId, projectId);
    const docRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
      const trash: Trashfile[] = docSnap.data().trash 
      const trashfile: Trashfile[] = trash.filter(trash => trash.file[0].id === fileId)
      const filteredtrash: Trashfile[] = trash.filter(trash => trash.file[0].id !== fileId)
      const limit = docSnap.data().limit - trashfile[0].file[0].size
      await updateDoc(docRef, { 
        trash: filteredtrash, 
        limit: limit
      });
      const storage = getStorage();
      const desertRef = ref(storage, `${projectId}/${fileId}`);
      deleteObject(desertRef).then(() => {
      }).catch(() => {
      });
    }
    toast.success("File deleted successfully")
    await getProject(projectId)
  } catch {
    toast.error("Something went wrong!!")
  }
}

export const moveToTrash = async(projectId: string, fileId: string) => {
  
  try{
    const docRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
      const filelist: file[] = docSnap.data().files
      const trashlist: Trashfile[] = docSnap.data().trash
      const file: file[] = filelist.filter((file) => file.id === fileId)
      const date = new Date();
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      const trash = {file: file, deletedate: formattedDate}
      trashlist.push(trash)
      const updatedfile: file[] = filelist.filter((file) => file.id !== fileId)
      await updateDoc(docRef, { 
          files: updatedfile, 
          trash: trashlist
      });
    }
    toast.success("File moved to trash successfully")
    await getProject(projectId)
  } catch {
    console.log("Something went wrong")
  }
}

export const resortFile = async(projectId: string, fileId: string) => {
  try {
    const docRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
      const trash: Trashfile[] = docSnap.data().trash 
      const trashfile: Trashfile[] = trash.filter(trash => trash.file[0].id === fileId)
      const filteredtrash: Trashfile[] = trash.filter(trash => trash.file[0].id !== fileId)
      const filelist = docSnap.data().files 
      const updatedfile = [...filelist, ...trashfile[0].file]
      await updateDoc(docRef, { 
          files: updatedfile, 
          trash: filteredtrash
      });
      await getProject(projectId)
      toast.success("File resorted successfully")
    }
  } catch {
    toast.error("Something went wrong")
  }
}

export const clearTrash = async (projectId: string) => {
  try {
    const docRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
      const trash: Trashfile[] = docSnap.data().trash 
      let limit: number = docSnap.data().limit
      trash.forEach(trashFile => {
        const storage = getStorage();
        const desertRef = ref(storage, `${projectId}/${trashFile.file[0].id}`);
        console.log(``)
        deleteObject(desertRef).then(() => {
        }).catch(() => {
          console.log("something went wrong")
        });
        limit -= trashFile.file[0].size
      })
      await updateDoc(docRef, { 
          trash: [], 
          limit: limit
      });
    }
    await getProject(projectId)
  } catch {
    toast.error("Something went wrong")
  }
}