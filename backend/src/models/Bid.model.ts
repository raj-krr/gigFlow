import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBid extends Document {
  gigId: Types.ObjectId;
  freelancerId: Types.ObjectId;
  message: string;
  price: number;
  status: "pending" | "hired" | "rejected";
}

const BidSchema = new Schema<IBid>(
  {
    gigId: {
      type: Schema.Types.ObjectId,
      ref: "Gig",
      required: true
    },
    freelancerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    message: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "hired", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

const Bid = mongoose.model<IBid>("Bid", BidSchema);
export default Bid;
