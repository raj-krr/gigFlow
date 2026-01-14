import api from "./axios";

export const createBid = async (
  gigId: string,
  message: string,
  price: number
) => {
  const res = await api.post("/api/bids", {
    gigId,
    message,
    price,
  });
  return res.data;
};

export const getBidsForGig = async (gigId: string) => {
  const res = await api.get(`/api/bids/${gigId}`);
  return res.data;
};

export const hireBid = async (bidId: string) => {
  const res = await api.patch(`/api/bids/${bidId}/hire`);
  return res.data;
};

export const getMyBids = async () => {
  const res = await api.get("/api/bids/my");
  return res.data;
};
