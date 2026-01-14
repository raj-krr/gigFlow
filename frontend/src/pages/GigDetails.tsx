import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGigById } from "../api/gigs.api";
import { createBid, getBidsForGig, hireBid } from "../api/bids.api";
import { useAuth } from "../context/AuthContext";

type Gig = {
  _id: string;
  title: string;
  description: string;
  budget: number;
  status: "open" | "assigned";
  ownerId: string | { _id: string };
};

type Bid = {
  _id: string;
  message: string;
  price: number;
  status: "pending" | "hired" | "rejected";
  freelancerId: {
    _id: string;
    name: string;
    email: string;
  };
};

export default function GigDetails() {
  const { gigId } = useParams<{ gigId: string }>();
  const { user } = useAuth();

  const [gig, setGig] = useState<Gig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [message, setMessage] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [bidError, setBidError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [bids, setBids] = useState<Bid[]>([]);
  const [bidsLoading, setBidsLoading] = useState(false);

  // ✅ NEW UI STATES
  const [successMessage, setSuccessMessage] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  /* ---------- FETCH GIG ---------- */
  useEffect(() => {
    const fetchGig = async () => {
      try {
        if (!gigId) return;
        const data = await getGigById(gigId);
        setGig(data);
      } catch {
        setError("Failed to load gig details");
      } finally {
        setLoading(false);
      }
    };
    fetchGig();
  }, [gigId]);

  /* ---------- OWNER LOGIC ---------- */
  const ownerId =
    gig && typeof gig.ownerId === "object"
      ? gig.ownerId._id
      : gig?.ownerId;

  const userId = user?._id;
  const isOwner = !!(userId && ownerId && userId === ownerId);
  const canBid = !!(user && gig?.status === "open" && !isOwner);

  /* ---------- FETCH BIDS (OWNER) ---------- */
  useEffect(() => {
    if (!gig || !isOwner) return;

    const fetchBids = async () => {
      try {
        setBidsLoading(true);
        const data = await getBidsForGig(gig._id);
        setBids(data);
      } catch {
        console.error("Failed to fetch bids");
      } finally {
        setBidsLoading(false);
      }
    };

    fetchBids();
  }, [gig, isOwner]);

  /* ---------- SUBMIT BID ---------- */
  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBidError("");
    setSuccessMessage("");

    if (!message || !price) {
      setBidError("Message and price are required");
      return;
    }

    try {
      setSubmitting(true);
      await createBid(gig!._id, message, Number(price));
      setMessage("");
      setPrice("");
      setSuccessMessage("Bid submitted successfully 🚀");
    } catch (err: any) {
      setBidError(
        err.response?.data?.message || "Failed to submit bid"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- HIRE BID ---------- */
  const handleHire = async (bidId: string) => {
    try {
      setActionLoading(bidId);
      setSuccessMessage("");

      await hireBid(bidId);

      const updatedGig = await getGigById(gig!._id);
      const updatedBids = await getBidsForGig(gig!._id);

      setGig(updatedGig);
      setBids(updatedBids);
      setSuccessMessage("Freelancer hired successfully 🎉");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to hire freelancer"
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!gig) return <p className="p-6">Gig not found</p>;

return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 py-10">
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      {/* ===== GIG HEADER ===== */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-800">
            {gig.title}
          </h1>

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

        <p className="text-gray-600 leading-relaxed">
          {gig.description}
        </p>

        <div className="mt-4 flex items-center gap-6 text-sm">
          <p className="font-medium">
            Budget: <span className="text-gray-800">₹{gig.budget}</span>
          </p>

          {isOwner && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              You posted this gig
            </span>
          )}
        </div>
      </div>

      {/* ===== SUCCESS MESSAGE ===== */}
      {successMessage && (
        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {/* ===== BID FORM ===== */}
      {canBid && (
        <div className="border rounded-xl p-6 bg-gray-50 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            Place a Bid
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Describe how you will complete this work and your expected price.
          </p>

          {bidError && (
            <p className="text-red-500 text-sm mb-3">
              {bidError}
            </p>
          )}

          <form onSubmit={handleBidSubmit} className="space-y-4">
            <textarea
              placeholder="Explain your approach, timeline, and experience"
              className="w-full border rounded-lg px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <input
              type="number"
              placeholder="Your bid price (₹)"
              className="w-full border rounded-lg px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={price}
              onChange={(e) =>
                setPrice(e.target.valueAsNumber || "")
              }
            />

            <button
              disabled={submitting}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg
                font-medium hover:bg-indigo-700 transition
                disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Bid"}
            </button>
          </form>
        </div>
      )}

      {/* ===== OWNER BID LIST ===== */}
      {isOwner && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Received Bids
          </h2>

          {bidsLoading && (
            <p className="text-sm text-gray-500">
              Loading bids...
            </p>
          )}

          {!bidsLoading && bids.length === 0 && (
            <p className="text-sm text-gray-500">
              No bids received yet
            </p>
          )}

          <div className="space-y-4">
            {bids.map((bid) => (
              <div
                key={bid._id}
                className="border rounded-xl p-4 bg-gray-50"
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="font-medium">
                    {bid.freelancerId.name}
                  </p>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
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

                <p className="text-sm text-gray-600">
                  {bid.message}
                </p>

                <p className="font-medium mt-2">
                  ₹{bid.price}
                </p>

                {gig.status === "open" &&
                  bid.status === "pending" && (
                    <button
                      onClick={() => handleHire(bid._id)}
                      disabled={actionLoading === bid._id}
                      className="mt-3 px-4 py-1.5 bg-indigo-600 text-white
                        rounded-lg text-sm hover:bg-indigo-700
                        disabled:opacity-50"
                    >
                      {actionLoading === bid._id
                        ? "Hiring..."
                        : "Hire"}
                    </button>
                  )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

}
