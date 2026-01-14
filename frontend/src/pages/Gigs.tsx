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
      const data = await getGigs(search.trim());
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
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Open Gigs
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse available gigs and start bidding
          </p>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Search gigs by title..."
            className="w-full sm:max-w-md border rounded-lg px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchGigs()}
          />

          <button
            onClick={fetchGigs}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg
              text-sm font-medium hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-gray-500">
            Loading gigs...
          </p>
        )}

        {/* Empty */}
        {!loading && gigs.length === 0 && (
          <div className="text-center text-gray-500 mt-16">
            <p className="text-lg font-medium">
              No gigs found
            </p>
            <p className="text-sm mt-1">
              Try searching with a different keyword
            </p>
          </div>
        )}

        {/* Gig Grid */}
        {!loading && gigs.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gigs.map((gig) => (
              <div
                key={gig._id}
                onClick={() => navigate(`/gigs/${gig._id}`)}
                className="bg-white border rounded-xl p-5 cursor-pointer
                  hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {gig.title}
                  </h2>

                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
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

                <div className="mt-4 flex justify-between items-center">
                  <p className="font-medium">
                    ₹{gig.budget}
                  </p>

                  <p className="text-xs text-indigo-600 font-medium">
                    View details →
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
