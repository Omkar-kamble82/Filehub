import { CircleArrowLeft } from 'lucide-react';

const Not_found = () => {
  return (
    <div className="bg-background">
        <header className="bg-[white] fixed w-screen shadow-md">
            <div className="mx-auto flex justify-center h-20 sm:h-22 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
                <a className="block text-teal-600" href="/projects">
                    <img src="/logo.png" alt="logo" className="h-10 sm:h-16"/>
                </a>
            </div>
        </header>
        <div className="h-screen w-screen flex justify-center items-center">
            <div className="flex justify-center flex-col items-center h-[400px] w-[400px]">
                <img src="/404.gif" alt="not-found-gif"/>
                <a href="/projects" className="rounded-md flex gap-1 items-center text-[white] bg-primary px-6 py-2.5 text-lg font-semibold hover:opacity-90 transition-all hover:duration-700">
                    <span><CircleArrowLeft /></span>Reture back to Homepage
                </a>
            </div>           
        </div>
    </div>
  )
}

export default Not_found