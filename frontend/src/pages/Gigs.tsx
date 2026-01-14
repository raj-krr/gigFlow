import { useEffect, useState } from "react";
import { getGigs } from "../api/gigs.api";
import { useNavigate } from "react-router-dom";

type Gig = {
  _id: string;
  title: string;
  description: string;
  budget: number;
  status: "open" | "assigned";
};

export default function Gigs() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchGigs = async () => {
    setLoading(true);
    try {
      const data = await getGigs(search);
      setGigs(data);
    } catch {
      console.error("Failed to fetch gigs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 py-10">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Open Gigs
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse available gigs and start bidding
          </p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search gigs by title..."
          className="w-full max-w-md border rounded-lg px-3 py-2 mb-6 text-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchGigs()}
        />

        {loading && (
          <p className="text-gray-500">Loading gigs...</p>
        )}

        {!loading && gigs.length === 0 && (
          <p className="text-gray-500">
            No gigs found
          </p>
        )}

        {/* Gig Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {gigs.map((gig) => (
            <div
              key={gig._id}
              onClick={() => navigate(`/gigs/${gig._id}`)}
              className="bg-white border rounded-xl p-5 cursor-pointer
                hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {gig.title}
                </h2>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    gig.status === "open"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {gig.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2">
                {gig.description}
              </p>

              <p className="mt-3 font-medium">
                Budget: ₹{gig.budget}
              </p>

              <p className="mt-2 text-xs text-indigo-600">
                Click to view details
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
