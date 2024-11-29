"use client";

import { useRouter } from "next/navigation";
import LogoutButton from "@/app/_components/LogoutButton";

export default function Admin() {
  const router = useRouter();
  const role = sessionStorage.getItem("role");

  const redirectDelete = () => {
    router.push(`/admin/delete-user`);
  };

  return (
    <>
      {role?.match("ADMIN") ? (
        <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              ADMIN PAGE
            </h1>
            <p className="text-xl font-medium text-gray-700 mb-4 text-center">
              Welcome!
            </p>
            <p className="text-center text-gray-600 mb-6">Choose what to do:</p>
            <button
              onClick={redirectDelete}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300 mb-4" // Added mb-4 for spacing
            >
              Delete User
            </button>
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300">
              Create Admin User
            </button>
          </div>
          <div className="mt-8">
              <LogoutButton />
            </div>
        </div>
      ) : (
        <p className="min-h-screen flex flex-col items-center justify-center font-bold">
          No Permission
        </p>
      )}
    </>
  );
}
