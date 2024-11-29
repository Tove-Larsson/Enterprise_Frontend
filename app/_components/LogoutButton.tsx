"use client"

import { useRouter } from "next/navigation"

const LogoutButton = () => {
    const router = useRouter()

    const handleLogout = () => {
        sessionStorage.clear()
        router.push("/sign-in")
    }


  return (
    <div>
        <button
        onClick={handleLogout}
        className="w-full px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
            Log out
        </button>
      
    </div>
  )
}

export default LogoutButton
