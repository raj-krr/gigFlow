import { useEffect, useState } from "react";
import { getMyBids } from "../api/bids.api";
import { useNavigate } from "react-router-dom";

type Bid = {
  _id: string;
  price: number;
  message: string;
  status: "pending" | "hired" | "rejected";
  gigId: {
    _id: string;
    title: string;
  } | null;
};

export default function MyBids() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBids = async () => {
      const data = await getMyBids();
      setBids(data);
      setLoading(false);
    };
    fetchBids();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Bids
          </h1>
          <p className="text-gray-500 mt-1">
            Gigs you have applied to
          </p>
        </div>

        {loading && <p className="text-gray-500">Loading bids...</p>}

        {!loading && bids.length === 0 && (
          <p className="text-gray-500">
            You haven’t placed any bids yet.
          </p>
        )}

        {/* SAME GRID AS GIGS */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bids.map((bid) => {
            if (!bid.gigId) {
              return (
                <div
                  key={bid._id}
                  className="bg-white rounded-xl border p-6 text-gray-500"
                >
                  <h2 className="font-semibold">
                    Gig no longer available
                  </h2>
                  <p className="mt-3 font-medium">
                    Your bid: ₹{bid.price}
                  </p>
                </div>
              );
            }

            const gig = bid.gigId;

            return (
              <div
                key={bid._id}
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
                      bid.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : bid.status === "hired"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {bid.status}
                  </span>
                </div>

                {/* YOUR PROPOSAL (replaces description) */}
                <p className="text-sm text-gray-600 line-clamp-3">
                  {bid.message}
                </p>

                {/* Footer */}
                <div className="mt-6 flex justify-between items-center">
                  <p className="font-semibold text-gray-900">
                    Your bid: ₹{bid.price}
                  </p>
                  <span className="text-sm text-indigo-600 font-medium">
                    View gig →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
