import { AuthRequest } from "../types/AuthRequest";
import Bid from "../models/Bid.model";
import Gig from "../models/Gig.model";
import mongoose from "mongoose";

export const createBid = async (req: AuthRequest, res: any) => {
  try {
    const body = req.body as {
      gigId?: string;
      message?: string;
      price?: number;
    };

    const { gigId, message, price } = body;

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

export const hireBid = async (req: AuthRequest, res: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bidId } = (req as any).params as { bidId: string };

    if (!bidId) {
      return res.status(400).json({ message: "Invalid bid ID" });
    }

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const bidObjectId = new mongoose.Types.ObjectId(bidId);

    const bid = await Bid.findById(bidObjectId).session(session);
    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    const gig = await Gig.findById(bid.gigId).session(session);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

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

    await Bid.updateOne(
      { _id: bidObjectId },
      { status: "hired" },
      { session }
    );

    await Bid.updateMany(
      { gigId: bid.gigId, _id: { $ne: bidObjectId } },
      { status: "rejected" },
      { session }
    );

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


export const getBidsForGig = async (req:any, res: any) => {
  try {
    const { gigId } = req.params;

    console.log("gigId:", gigId);
    console.log("user:", req.user);

    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.ownerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const bids = await Bid.find({ gigId })
      .populate("freelancerId", "name email")
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    console.error("GET BIDS ERROR 👉", error);
    res.status(500).json({
      message: "Failed to fetch bids",
      err: error,
    });
  }
};

export const getMyBids = async (req:any, res:any) => {
  const bids = await Bid.find({ freelancerId: req.user.id })
    .populate("gigId")
    .sort({ createdAt: -1 });

  res.json(bids);
};


