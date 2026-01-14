import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Gigs from "../pages/Gigs";
import CreateGig from "../pages/CreateGig";
import GigDetails from "../pages/GigDetails";
import ProtectedRoute from "../components/ProtectedRoutes";
import MyGigs from "../pages/MyGigs";
import MyBids from "../pages/MyBids";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/gigs" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/gigs" element={<Gigs />} />
          <Route path="/gigs/:gigId" element={<GigDetails />} />
          
     <Route path="/my-gigs" element={<MyGigs />} />
        <Route path="/my-bids" element={<MyBids />} />
      <Route
        path="/create-gig"
        element={
          <ProtectedRoute>
            <CreateGig />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
