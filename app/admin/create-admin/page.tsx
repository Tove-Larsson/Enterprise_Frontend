"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IUser } from "@/app/_types/IUser";

export default function DeleteUser() {
  const router = useRouter();
  const [user, setUser] = useState<IUser>({ username: "", password: "" })
  const [error, setError] = useState(""); 
  const [success, setSuccess] = useState(false); 
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      setError("You are not authorized to access this page.");
      setTimeout(() => {
        router.push("/sign-in");
      }, 3000); 
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value, 
    }));
  };

  const handleCreate = async () => {
    const token = sessionStorage.getItem("jwtToken");

    if (!user.username || !user.password) {
        setError("Please provide both username and password.");
        return;
      }

    setError(""); 
    setLoading(true); 
    setSuccess(false);

    try {
      const response = await fetch(
        `http://localhost:8080/admin/create-admin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(user),
        });

      if (response.ok) {
        setSuccess(true);
        setUser({ username: "", password: "" }); 
        setTimeout(() => {
          router.push("/admin"); 
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to create user. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while creating the user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Create Admin User
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-4">
            Admin user created successfully!
          </p>
        )}

        <input
          type="text"
          name="username"
          placeholder="Enter username"
          value={user.username}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={user.password}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          onClick={handleCreate}
          disabled={loading}
          className={`w-full px-4 py-2 rounded-lg shadow-md text-white ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          } transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
        >
          {loading ? "Creating..." : "Create Admin User"}
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
