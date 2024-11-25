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

  if(loading) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <main>
        <p>Credentials</p>
        {user?.username}
        {user?.password}
      </main>
    </div>
  );
}
