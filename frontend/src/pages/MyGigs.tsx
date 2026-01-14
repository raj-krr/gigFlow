import { useEffect, useState } from "react";
import { getMyGigs } from "../api/gigs.api";
import { useNavigate } from "react-router-dom";

type Gig = {
  _id: string;
  title: string;
  description: string;
  budget: number;
  status: "open" | "assigned";
};

export default function MyGigs() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGigs = async () => {
      const data = await getMyGigs();
      setGigs(data);
      setLoading(false);
    };
    fetchGigs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Gigs
          </h1>
          <p className="text-gray-500 mt-1">
            Gigs you have created
          </p>
        </div>

        {loading && (
          <p className="text-gray-500">Loading gigs...</p>
        )}

        {!loading && gigs.length === 0 && (
          <p className="text-gray-500">
            You haven’t created any gigs yet.
          </p>
        )}

        {/* SAME GRID AS OPEN GIGS */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {gigs.map((gig) => (
            <div
              key={gig._id}
              onClick={() => navigate(`/gigs/${gig._id}`)}
              className="bg-white rounded-xl border p-6 cursor-pointer
                hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              {/* Top */}
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  {gig.title}
                </h2>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    gig.status === "open"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {gig.status}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2">
                {gig.description}
              </p>

              {/* Footer */}
              <div className="mt-6 flex justify-between items-center">
                <p className="font-semibold text-gray-900">
                  ₹{gig.budget}
                </p>
                <span className="text-sm text-indigo-600 font-medium">
                  View details →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
