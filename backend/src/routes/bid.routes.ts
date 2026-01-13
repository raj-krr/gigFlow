import express from "express";
import { createBid, hireBid,getBidsForGig } from "../controllers/bid.controller";
import protect from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", protect, createBid);
router.patch("/:bidId/hire", protect, hireBid);
router.get("/:gigId", protect, getBidsForGig);
export default router;
