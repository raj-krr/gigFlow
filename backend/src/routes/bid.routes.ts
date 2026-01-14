import express from "express";
import { createBid, hireBid,getBidsForGig, getMyBids } from "../controllers/bid.controller";
import protect from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", protect, createBid);
router.get("/my", protect, getMyBids);

router.get("/:gigId", protect, getBidsForGig);
router.patch("/:bidId/hire", protect, hireBid);

export default router;
