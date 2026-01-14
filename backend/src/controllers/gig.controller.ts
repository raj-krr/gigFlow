import Gig from "../models/Gig.model";
import { AuthRequest } from "../types/AuthRequest";

export const createGig = async (req: AuthRequest, res: any) => {
  try {
    const body = req.body as {
      title?: string;
      description?: string;
      budget?: number;
    };

    const { title, description, budget } = body;

    if (!title || !description || !budget) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user.id
    });

    return res.status(201).json({
      message: "Gig created successfully",
      gig
    });
  } catch (error) {
    console.error("Create gig error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getOpenGigs = async (req: any, res: any) => {
  try {
    const { search } = req.query as { search?: string };

    const query: any = { status: "open" };

    if (search) {
      query.title = {
        $regex: search,
        $options: "i"
      };
    }

    const gigs = await Gig.find(query).sort({ createdAt: -1 });

    return res.status(200).json(gigs);
  } catch (error) {
    console.error("Fetch gigs error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const getGigById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const gig = await Gig.findById(id);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    res.json(gig);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch gig" });
  }
};

export const getMyGigs = async (req:any, res:any) => {
  const gigs = await Gig.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
  res.json(gigs);
};
