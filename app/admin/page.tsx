"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IUser } from "@/app/_types/IUser";

export default function Admin() {
  const [user, setUser] = useState<IUser | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      setLoading(false)
      setError("You are not authorized to access this page.");
      router.push("/sign-in"); 
      return;
    }

    fetch("http://localhost:8080/admin", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data); 

        if (data.role !== "ADMIN") { 
            setError("You are not authorized to access this page.");
            return;
        }

        setUser(data); 
      })
      .catch((error) => {
        setError("Error fetching admin data");
        console.error("Error fetching admin data:", error);
      });
  }, []);

  const redirectDelete = () => {
    router.push(`/admin/delete`);
  };

  return (
    <>
  <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        ADMIN PAGE
      </h1>

      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}

      {user ? (
        <>
          <p className="text-xl font-medium text-gray-700 mb-4 text-center">
            Welcome, {user.username}
          </p>{" "}
          <p className="text-center text-gray-600 mb-6">
            Choose what to do:
          </p>
          <button
            onClick={redirectDelete}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300 mb-4" // Added mb-4 for spacing
          >
            Delete User
          </button>
          <button
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300"
          >
            Create Admin User
          </button>
        </>
      ) : (
        <p className="text-center text-gray-500">Loading admin data...</p>
      )}
    </div>
  </div>
</>
  );
}
