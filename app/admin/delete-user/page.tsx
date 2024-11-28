"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function DeleteUser() {
  const router = useRouter();
  const { username } = router.query; 
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      setError("You are not authorized to access this page.");
      router.push("/sign-in"); 
      return;
    }

    if (username) {
      setLoading(true);
      fetch(`http://localhost:8080/admin/delete-user?username=${username}`, {
        method: "DELETE", 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            router.push("/admin");
          } else {
            setError("Failed to delete user. Please try again.");
          }
        })
        .catch((error) => {
          setError("An error occurred while deleting the user.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [username, router]);

  return (
    <div>
      <h1>Deleting User: {username}</h1>
      {loading ? (
        <p>Loading...</p> 
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p> 
      ) : (
        <p>User deleted successfully!</p> 
      )}
    </div>
  );
}
