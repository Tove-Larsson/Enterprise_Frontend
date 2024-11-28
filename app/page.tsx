"use client";
import { useEffect, useState } from "react";
import { IUser } from "./_types/IUser";

export default function Home() {
  const [user, setUser] = useState<IUser | null>(null);
  const [error, setError] = useState<string | null>(""); 
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {

    const token = sessionStorage.getItem("jwtToken")
    console.log(`Token ${token}`)
    if(!token) {
      setError("No token exists")
    }

    const timeout: number = 10_000
    const controller = new AbortController()
    const signal = controller.signal

    const timeoutId = setTimeout(() => {
      controller.abort()
    }, timeout)

    
      fetch("http://localhost:8080/user/test", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal, 
      })
        .then((response) => {
          clearTimeout(timeoutId)

          if (!response.ok) {
            return response.json().then((errData) => {
              setError(errData.message || "Unable to fetch user details");
              throw new Error(errData.message || error);
            });
          }
          return response.json();
        })
        .then((data: IUser) => {
          setUser(data);
          setError(null); 
        })
        .catch((err) => {
          if(err.message === "AbortError") {
            setError("Request timed out, please try again")
          } else {
            setError(err.message)
          }
        })
        .finally(() => {
          setLoading(false)
        })

  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <header className="text-2xl font-semibold text-gray-800 text-center mb-6">
          User Credentials
        </header>
        {error ? (
          <p className="text-red-500 text-center font-medium">
            {error}
          </p>
        ) : (
          <div>
            <p className="text-gray-600">
              <span className="font-semibold text-gray-800">Username:</span> {user?.username}
            </p>
            <p className="text-gray-600 mt-2 break-words">
              <span className="font-semibold text-gray-800">Password:</span> {user?.password}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
