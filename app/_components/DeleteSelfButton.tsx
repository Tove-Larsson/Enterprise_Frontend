"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; 

const DeleteAccountButton = () => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); 
  const router = useRouter(); 

  const handleDeleteUser = () => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      setError("No token exists");
      return;
    }

    setDeleting(true);

    fetch("http://localhost:8080/user/delete-user", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errData) => {
            setError(errData.message || "Failed to delete account");
            throw new Error(errData.message);
          });
        }

        setSuccess("Your account was successfully deleted.");

        sessionStorage.clear()

        setTimeout(() => {
          router.push("/sign-in"); 
        }, 3000); 
      })
      .catch((err) => {
        setError(err.message || "An error occurred while deleting your account");
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  return (
    <div>
      {error && <p className="text-red-500 text-center font-medium">{error}</p>}
      {success && (
        <p className="text-green-500 text-center font-medium">{success}</p>
      )}
      <button
        onClick={handleDeleteUser}
        disabled={deleting}
        className="px-6 py-3 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition mt-4"
      >
        {deleting ? "Deleting..." : "Delete Account"}
      </button>
    </div>
  );
};

export default DeleteAccountButton;
