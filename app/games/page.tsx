"use client";

import { useState } from "react";
import { IGame } from "../_types/IGame";

export default function Games() {
  const [games, setGames] = useState<IGame[]>([]);
  const [error, setError] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState("");
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  const handleSearch = () => {
    setError(null);
    setLoading(true);

    const token = sessionStorage.getItem("jwtToken");

    if (!token) {
      setError("No token exists. Please log in to access this feature.");
      setLoading(false);
      return;
    }

    const queryParams = new URLSearchParams({
      ...(minDate && { minDate }),
      ...(maxDate && { maxDate }),
    });

    fetch(
      `http://localhost:8080/api/games/${encodeURIComponent(title)}?${
        queryParams.toString() || ""
      }`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || "Failed to fetch games.");
          });
        }
        return response.json();
      })
      .then((data: IGame[]) => {
        setGames(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Search Games</h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Game Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded px-4 py-2 w-full focus:outline-none focus:ring focus:ring-purple-400"
        />
        <input
          type="date"
          placeholder="Min Date"
          value={minDate}
          onChange={(e) => setMinDate(e.target.value)}
          className="border rounded px-4 py-2 w-full focus:outline-none focus:ring focus:ring-purple-400"
        />
        <input
          type="date"
          placeholder="Max Date"
          value={maxDate}
          onChange={(e) => setMaxDate(e.target.value)}
          className="border rounded px-4 py-2 w-full focus:outline-none focus:ring focus:ring-purple-400"
        />
      </div>

      <div className="text-center">
        <button
          onClick={handleSearch}
          className={`bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 disabled:bg-gray-400`}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="mt-8">
        {loading && (
          <p className="text-center text-gray-500">Loading games...</p>
        )}

        {!loading && games.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Results:</h2>
            <ul className="space-y-4">
              {games.map((game) => (
                <li key={game.id} className="border rounded p-4 shadow">
                  <h3 className="text-center font-bold text-lg">{game.name}</h3>
                  <p className="text-sm text-white">
                    {game.storyline ? game.storyline : "No storyline exists"}
                  </p>
                  <p className="text-sm text-gray-500">Rating: {game.rating}</p>
                  {game.first_release_date && (
                    <p className="text-sm text-gray-500">
                      Release Date:{" "}
                      {new Date(game.first_release_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!loading && games.length === 0 && !error && (
          <p className="text-center text-gray-500">No games found.</p>
        )}
      </div>
    </main>
  );
}
