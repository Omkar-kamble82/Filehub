import { GoogleAuthProvider, signInWithPopup, signOut, getAuth } from "firebase/auth"
import { auth } from "./config"


export const handleAuth = async () => {
    const provider = await new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
}

export const Logout = () => {
    const auth = getAuth();
    signOut(auth)
  }