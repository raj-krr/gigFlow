import api from "./axios";

export const getGigs = async (search?: string) => {
  const res = await api.get("/api/gigs", {
    params: search ? { search } : {},
  });
  return res.data;
};

export const createGig = async (
  title: string,
  description: string,
  budget: number
) => {
  const res = await api.post("/api/gigs", {
    title,
    description,
    budget,
  });
  return res.data;
};

export const getGigById = async (gigId: string) => {
  const res = await api.get(`/api/gigs/${gigId}`);
  return res.data;
};

export const getMyGigs = async () => {
  const res = await api.get("/api/gigs/my");
  return res.data;
};
