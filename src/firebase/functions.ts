import { GoogleAuthProvider, signInWithPopup, signOut, getAuth } from "firebase/auth"
import { auth, db } from "./config"
import toast from "react-hot-toast"
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore"

export const Login = () => {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
}

export const Logout = () => {
    const auth = getAuth();
    signOut(auth)
}

export const generateId = () => {
    const charaters='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result='';
    for (let i=0;i<8;i++) {
        result+=charaters.charAt(Math.floor(Math.random()*charaters.length));
    }
    return result;
}

export const createProjectFunction = async (name: string) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (name === ""){
      return
    }
    try {
      if (!user) {
        return 
      }
      const username = user.displayName as string
      const docRef = doc(db, "users", username);
      const docSnap = await getDoc(docRef);
      const docId = generateId().toString() + name;

      if (docSnap.exists()) {
        await setDoc(doc(db, "projects", docId), {
          name: name,
          users: [username]
        });
        const projects = docSnap.data().projects
        projects.push(docId)
        await updateDoc(docRef, {
          projects: projects
        })
      } else {
        await setDoc(docRef, {
          username: user?.displayName,
          email: user?.email,
          photoURL: user?.photoURL,
          projects: []
        });
        await setDoc(doc(db, "projects", docId), {
          name: name,
          users: [username]
        });
        const docSnapnew = await getDoc(docRef);
        if (docSnapnew.exists()) {
          const projects = docSnapnew.data().projects as string[]
          projects.push(docId)
          await updateDoc(docRef, {
            projects: projects
          })
        }
      }
      toast.success(`${name} project was created!!🎉🎉`)
    } catch {
      toast.error("Something went wrong!!❌❌")
    }
}