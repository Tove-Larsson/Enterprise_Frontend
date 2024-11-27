"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function DeleteUser() {
  const router = useRouter();
  const { username } = router.query; // Extract the username from the URL
  const [error, setError] = useState(""); // State to handle errors
  const [loading, setLoading] = useState(true); // State to show loading

  useEffect(() => {
    if (username) {
      // Start the deletion process when the username is available
      fetch(`http://localhost:8080/admin/delete-user?username=${username}`, {
        method: "DELETE", // Use DELETE HTTP method
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            // If deletion is successful, redirect to the admin homepage
            router.push("/admin");
          } else {
            // Handle error response
            setError("Failed to delete user. Please try again.");
          }
        })
        .catch((error) => {
          // Handle network errors
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
