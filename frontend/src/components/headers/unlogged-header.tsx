import { Link } from 'react-router-dom'

export default function UnLoggedHeader() {
  return (
    <>
      <div className="flex flex-row py-5 bg-neutral-200 max-h-[85px] text-center items-center w-full">
        <nav className="cursor-pointer flex items-center justify-between flex-row w-full px-5 sm:text-xl font-poppins font-semibold">
          <Link to="/">
            <div className="hover:underline hover:text-cyan-700">Sign In</div>
          </Link>
          <Link to="/register">
            <div className="hover:underline hover:text-cyan-700">Register</div>
          </Link>
        </nav>
      </div>
      <hr className="mb-5 border-2 border-cyan-700" />
    </>
  )
}
