"use client";
import { useEffect, useState } from "react";

interface IFullUser {
  username: string;
  password: string;
}

export default function Home() {
  const [user, setUser] = useState<IFullUser | null>(null);
  const [error, setError] = useState<string | null>(""); 

  useEffect(() => {
    const fetchUserDetails = () => {
      fetch("http://localhost:8080/user/test", {
        method: "GET",
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBbGRpbmFhYWEiLCJpYXQiOjE3MzI0MDA4MjksImV4cCI6MTczMjQwMTA0NX0.mk_UUmB5GLLqMtfr6O0LzHsMFVzGDacNsz5njjLdkz8",
        },
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            // Process error response JSON if available
            return response.json().then((errData) => {
              setError(errData.message || "Invalid username or password");
              throw new Error(
                errData.message || "Invalid username or password"
              );
            });
          }
          return response.json();
        })
        .then((data: IFullUser) => {
          setUser(data);
          setError(null); 
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setError("An error occurred. Please try again."); 
        });
    };
    /*
      try {

        const response = await fetch("http://localhost:8080/user/test", {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBbGRpbmFhYWEiLCJpYXQiOjE3MzIzOTUwMDcsImV4cCI6MTczMjM5NTIyM30.V43RvTt4_BYK9e9uWeyyZeUNt-pKV95Kg2mpLz-9luI'
            //"Content-Type": "application/json"
          },
          credentials: "include",
        });
        
        if(!response.ok) {
          throw new Error("Failed to fetch user details")
        }

        const data: IFullUser = await response.json()
        setUser(data)
  
      } catch (e) {
        console.error(e)
        
      }
        */

    fetchUserDetails();
  }, []);

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
