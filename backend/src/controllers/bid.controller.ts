import { Response } from "express";
import { AuthRequest } from "../types/AuthRequest";
import Bid from "../models/Bid.model";
import Gig from "../models/Gig.model";
import mongoose from "mongoose";

export const createBid = async (req: AuthRequest, res: Response) => {
  try {
    const { gigId, message, price } = req.body;

    if (!gigId || !message || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // 🚫 Can't bid on own gig
    if (gig.ownerId.toString() === req.user.id.toString()) {
      return res.status(403).json({
        message: "You cannot bid on your own gig"
      });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user.id,
      message,
      price
    });

    return res.status(201).json({
      message: "Bid submitted successfully",
      bid
    });
  } catch (error) {
    console.error("Create bid error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const hireBid = async (req: AuthRequest, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bidIdParam = req.params.bidId;

    // ✅ Type guard (THIS fixes the error)
    if (!bidIdParam || Array.isArray(bidIdParam)) {
      return res.status(400).json({ message: "Invalid bid ID" });
    }

    const bidObjectId = new mongoose.Types.ObjectId(bidIdParam);

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const bid = await Bid.findById(bidObjectId).session(session);
    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    const gig = await Gig.findById(bid.gigId).session(session);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // 👮 Only gig owner can hire
    if (gig.ownerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to hire for this gig"
      });
    }

    if (gig.status === "assigned") {
      return res.status(400).json({
        message: "Gig already assigned"
      });
    }

    // ✅ Hire selected bid
    await Bid.updateOne(
      { _id: bidObjectId },
      { status: "hired" },
      { session }
    );

    // ✅ Reject all other bids
    await Bid.updateMany(
      {
        gigId: bid.gigId,
        _id: { $ne: bidObjectId }
      },
      { status: "rejected" },
      { session }
    );

    // ✅ Assign gig
    await Gig.updateOne(
      { _id: gig._id },
      { status: "assigned" },
      { session }
    );

    await session.commitTransaction();

    return res.status(200).json({
      message: "Freelancer hired successfully"
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Hire error:", error);
    return res.status(500).json({ message: "Hiring failed" });
  } finally {
    session.endSession();
  }
};

export const getBidsForGig = async (req: AuthRequest, res: Response) => {
  try {
    const gigIdParam = req.params.gigId;

    // ✅ Type guard
    if (!gigIdParam || Array.isArray(gigIdParam)) {
      return res.status(400).json({ message: "Invalid gig ID" });
    }

    const gigObjectId = new mongoose.Types.ObjectId(gigIdParam);

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔍 Check gig exists
    const gig = await Gig.findById(gigObjectId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // 👮 Owner-only access
    if (gig.ownerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to view bids for this gig"
      });
    }

    // 📥 Fetch bids
    const bids = await Bid.find({ gigId: gigObjectId })
      .populate("freelancerId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json(bids);
  } catch (error) {
    console.error("Get bids error:", error);
    return res.status(500).json({
      message: "Failed to fetch bids"
    });
  }
};