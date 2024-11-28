"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteUser() {
  const router = useRouter();
  const [username, setUsername] = useState(""); // Controlled input state
  const [error, setError] = useState(""); // To display errors
  const [success, setSuccess] = useState(false); // To display success message
  const [loading, setLoading] = useState(false); // To manage button loading state

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      setError("You are not authorized to access this page.");
      setTimeout(() => {
        router.push("/sign-in");
      }, 3000); // Redirect after showing the error
    }
  }, [router]);

  const handleDelete = async () => {
    const token = sessionStorage.getItem("jwtToken");
    if (!username) {
      setError("Please provide a username.");
      return;
    }

    setError(""); // Clear previous errors
    setLoading(true); // Show loading state
    setSuccess(false); // Clear success state

    try {
      const response = await fetch(
        `http://localhost:8080/admin/delete-user?username=${encodeURIComponent(username)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSuccess(true);
        setUsername(""); // Clear username input
        setTimeout(() => {
          router.push("/admin"); // Redirect back to Admin page
        }, 2000); // Allow user to see success message before redirect
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to delete user. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while deleting the user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Delete User
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">User deleted successfully!</p>}

        <input
          type="text"
          placeholder="Enter username to delete"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        
        <button
          onClick={handleDelete}
          disabled={loading}
          className={`w-full px-4 py-2 rounded-lg shadow-md text-white ${
            loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
          } transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50`}
        >
          {loading ? "Deleting..." : "Delete User"}
        </button>

        <button
          onClick={() => router.push("/admin")}
          className="w-full mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300"
        >
          Back to Admin
        </button>
      </div>
    </div>
  );
}
