import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGig } from "../api/gigs.api";

export default function CreateGig() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState<number | "">("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title || !description || !budget) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await createGig(title, description, Number(budget));
      navigate("/gigs");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to create gig"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100">
      <div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Create a Gig
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Post a new job and hire freelancers
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="e.g. Build a React dashboard"
              className="w-full border rounded-lg px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Describe the work requirements"
              className="w-full border rounded-lg px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget (₹)
            </label>
            <input
              type="number"
              placeholder="5000"
              className="w-full border rounded-lg px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={budget}
              onChange={(e) =>
                setBudget(e.target.valueAsNumber || "")
              }
            />
          </div>

          {/* Button */}
          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg
              font-medium hover:bg-indigo-700 transition
              disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Gig"}
          </button>
        </form>
      </div>
    </div>
  );
}
