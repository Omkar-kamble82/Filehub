import { Logout } from "../firebase/functions"

const Navbar = () => {
  return (
    <header className="bg-[white] absolute w-screen shadow-md z-[48]">
        <div className="mx-auto flex h-20 sm:h-22 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
            <a className="block text-teal-600" href="/projects">
                <img src="/logo.png" alt="logo" className="h-10 sm:h-16"/>
            </a>

            <div className="flex flex-1 items-center justify-end md:justify-between">
            <nav aria-label="Global" className="hidden md:block">
                <ul className="flex items-center gap-6 text-sm">
                
                </ul>
            </nav>

            <div className="flex items-center gap-4">
                <div className="flex gap-4">
                <button
                    className="block rounded-md  text-[white] bg-primary px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-all hover:duration-700"
                    onClick={Logout}
                >
                    Logout
                </button>
                </div>

            </div>
            </div>
        </div>
        </header>
  )
}

export default Navbar