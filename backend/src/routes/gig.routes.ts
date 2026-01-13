import express from "express";
import { createGig, getOpenGigs } from "../controllers/gig.controller";
import protect from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", getOpenGigs);

router.post("/", protect, createGig);

export default router;
