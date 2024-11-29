"use client"
import { IUser } from "@/app/_types/IUser"
import { ChangeEvent, FormEvent, useState } from "react"

export default function SignUp() {
  const [user, setUser] = useState<IUser>({ username: "", password: "" })
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  function handleUserChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setUser((prevData) => ({ ...prevData, [name]: value }))
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()

    if (!user.username || !user.password) {
      setError("Both username and password are required.")
      return
    }

    setLoading(true)
    setError("")

    fetch("http://localhost:8080/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((response) => {
        setLoading(false)
        if (response.ok) {
          console.log("Sign up successful")
        } else {
          setError("Invalid username or password.")
        }
      })
      .catch(() => {
        setLoading(false)
        setError("An error occurred. Please try again.")
      })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
  <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-lg">
    <header className="text-2xl font-bold text-gray-800 mb-4 text-center">
      Sign Up
    </header>
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Username */}
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Username
        </label>
        <input
          type="text"
          name="username"
          value={user.username}
          onChange={handleUserChange}
          placeholder="Enter your username"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={handleUserChange}
          placeholder="Enter your password"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500 mt-2">
          {error}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 text-white font-medium rounded-lg ${
          loading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        } transition-colors`}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  </div>
</div>


  )
}
