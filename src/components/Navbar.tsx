const Navbar = () => {
  return (
    <header className="bg-background fixed w-screen shadow-md">
        <div className="mx-auto flex h-20 sm:h-22 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
            <a className="block text-teal-600" href="#">
            <span className="sr-only">Home</span>
            <img src="/logo.png" alt="logo" className="h-14 sm:h-16"/>
            </a>

            <div className="flex flex-1 items-center justify-end md:justify-between">
            <nav aria-label="Global" className="hidden md:block">
                <ul className="flex items-center gap-6 text-sm">
                
                </ul>
            </nav>

            <div className="flex items-center gap-4">
                <div className="flex gap-4">
                <a
                    className="block rounded-md  text-[white] bg-primary px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-all hover:duration-700"
                    href="#"
                >
                    Get Started
                </a>
                </div>

            </div>
            </div>
        </div>
        </header>
  )
}

export default Navbar