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

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            My Gigs
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gigs you have created
          </p>
        </div>

        {gigs.length === 0 && (
          <p className="text-gray-500">
            You haven’t created any gigs yet.
          </p>
        )}

        <div className="space-y-4">
          {gigs.map((gig) => (
            <div
              key={gig._id}
              onClick={() => navigate(`/gigs/${gig._id}`)}
              className="border rounded-lg p-5 cursor-pointer
                hover:shadow-md transition bg-white"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-gray-800">
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

              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {gig.description}
              </p>

              <p className="text-sm font-medium mt-3">
                Budget: ₹{gig.budget}
              </p>

              <p className="text-xs text-indigo-600 mt-3">
                Click to view details →
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
