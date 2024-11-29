"use client"
import { IUser } from "@/app/_types/IUser"
import { ChangeEvent, FormEvent, useState } from "react"
import { IAuthResponse } from "@/app/_types/IAuthResponse"
import { useRouter } from "next/navigation"

export default function SignIn() {
  const [user, setUser] = useState<IUser>({ username: "", password: "" })
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

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

    const timeout: number = 10_000
    const controller = new AbortController()
    const signal = controller.signal

    const timeoutId = setTimeout(() => {
      controller.abort()
    }, timeout)

    fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((response) => {
        clearTimeout(timeoutId)

        setLoading(false)

        if (response.ok) {
          console.log("Login successful")
          return response.json()

        } else {

          return response.json()
          .then((errorData) => {
            setError("Invalid username or password.")
            throw new Error(errorData.message)
          })
        }
      })
      .then((data: IAuthResponse) => {
        const token = data.token
        const role = data.role

        if(!token) {
          setError("No token exist")
          return
        }
        sessionStorage.setItem("jwtToken", token)
        sessionStorage.setItem("role", role)

        if(role.match("USER")) router.push("/user")
        

        if(role.match("ADMIN")) router.push("/admin")
      })
      .catch((error) => {
        if(error.name === "AbortError") {
          setError("Request timed out, please try again")
        } else {
          setError(error.message || "An error occured please try again")
        }
        setLoading(false)
      })
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <header className="text-2xl font-bold text-gray-800 text-center mb-6">
          Sign In
        </header>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600 mb-1"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 mb-1"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white rounded-lg shadow-md transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-500 hover:bg-purple-700"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}
