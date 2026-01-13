import { Request,Response } from "express";
import Gig from "../models/Gig.model";
import { AuthRequest } from "../types/AuthRequest";

export const createGig = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, budget } = req.body;

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

export const getOpenGigs = async (req: Request, res: Response) => {
  try {
    const search = (req as any).query?.search as string | undefined;

    const query: any = {
      status: "open"
    };

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