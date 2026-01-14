import { useEffect, useState } from "react";
import { getMyBids } from "../api/bids.api";
import { useNavigate } from "react-router-dom";

type Bid = {
  _id: string;
  price: number;
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

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            My Bids
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gigs you have applied to
          </p>
        </div>

        {bids.length === 0 && (
          <p className="text-gray-500">
            You haven’t placed any bids yet.
          </p>
        )}

        <div className="space-y-4">
          {bids.map((bid) => {
            if (!bid.gigId) {
              return (
                <div
                  key={bid._id}
                  className="border rounded-lg p-4 bg-gray-50 text-gray-500"
                >
                  <p className="font-medium">
                    Gig no longer available
                  </p>
                  <p className="text-sm mt-1">
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
                className="border rounded-lg p-5 cursor-pointer
                  hover:shadow-md transition bg-white"
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold text-gray-800">
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

                <p className="text-sm text-gray-600 mt-2">
                  Your bid: <span className="font-medium">₹{bid.price}</span>
                </p>

                <p className="text-xs text-indigo-600 mt-3">
                  Click to view gig →
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
