"use client";
import { useRouter } from "next/navigation"


export default function Home() {

  const router = useRouter()

  const handleLoginClick = () => {
    router.push("/sign-in"); 
  };


  return (
    <main>
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Welcome to Homepage
          </h1>
          <p className="text-xl text-white">
            To see what's on the site, please log in
          </p>
          <button
            onClick={handleLoginClick} 
            className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-md shadow-md hover:bg-purple-700 transition"
          >
            Log In
          </button> 
        </div>
      </div>
    </main>
  );
}
