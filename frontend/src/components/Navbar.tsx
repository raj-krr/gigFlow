import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  const baseLink =
    "text-sm font-medium text-gray-700 hover:text-indigo-600";

  const activeLink =
    "text-sm font-semibold text-indigo-600";

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/gigs"
          className="text-xl font-bold text-indigo-600"
        >
          GigFlow
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <NavLink
                to="/gigs"
                className={({ isActive }) =>
                  isActive ? activeLink : baseLink
                }
              >
                Open Gigs
              </NavLink>

              <NavLink
                to="/my-gigs"
                className={({ isActive }) =>
                  isActive ? activeLink : baseLink
                }
              >
                My Gigs
              </NavLink>

              <NavLink
                to="/my-bids"
                className={({ isActive }) =>
                  isActive ? activeLink : baseLink
                }
              >
                My Bids
              </NavLink>

              <NavLink
                to="/create-gig"
                className="px-4 py-1.5 rounded-lg text-sm
                  bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Create Gig
              </NavLink>

              <button
                onClick={logout}
                className="px-4 py-1.5 rounded-lg text-sm
                  border border-gray-300 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? activeLink : baseLink
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="px-4 py-1.5 rounded-lg text-sm
                  bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
