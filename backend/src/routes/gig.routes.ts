import express from "express";
import { createGig, getOpenGigs, getGigById, getMyGigs } from "../controllers/gig.controller";
import protect from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", getOpenGigs);
router.get("/my", protect, getMyGigs);

router.get("/:id", getGigById);
router.post("/", protect, createGig);

export default router;
