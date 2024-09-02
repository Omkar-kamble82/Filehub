import { handleAuth } from "../firebase/functions"

const Homebanner = () => {

  return (
    <section className="bg-gray-50">
        <div className="mx-auto max-w-screen-xl px-4 py-32 flex flex-col h-screen items-center">
            <div className="mx-auto max-w-xl h-screen text-center flex flex-col justify-center items-center">
            <div className="lg:flex-shrink-0">
                <img className="h-[170px] sm:h-[350px] lg:h-[220px] object-cover" src="/homebanner.png" alt="FileHub logo" />
            </div>
            <h1 className="text-3xl font-extrabold sm:text-3xl">
                <span className="text-primary">FileHub:</span> Your Ultimate Collaborative File Storage Solution 
            </h1>

            <p className="mt-2 text-[12px] sm:text-xs font-semibold">
                FileHub is a collaborative file storage platform where you can create projects, store and retrieve files, and work together with others in real-time. Simplify your file management and keep your projects organized and accessible, all in one place.            
            </p>

            <div className="mt-2 flex flex-wrap justify-center gap-4">
                <button
                className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-[white] shadow hover:opacity-90 transition-all hover:duration-700 focus:outline-none focus:ring active:bg-primary-500 sm:w-auto"
                onClick={handleAuth}
                >
                Get Started
                </button>
            </div>
            </div>
        </div>
        </section>
  )
}

export default Homebanner