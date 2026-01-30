import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  login: async (credentials) => {
    console.log("🔐 authAPI.login called with:", credentials);
    try {
      const response = await api.post("/auth/login", credentials);
      console.log("✅ Login response:", response.data);

      if (response.data.token && response.data.user) {
        const userData = {
          ...response.data.user,
          token: response.data.token,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("💾 User stored in localStorage");
      }

      return response.data;
    } catch (error) {
      console.error(
        "❌ Login API error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  register: async (userData) => {
    console.log("📤 Sending registration data:", userData);
    const response = await api.post("/auth/register", userData);

    console.log("📥 Registration response:", response.data);

    if (response.data.token && response.data.user) {
      const storedUser = {
        ...response.data.user,
        token: response.data.token,
      };
      localStorage.setItem("user", JSON.stringify(storedUser));
      console.log("💾 Stored user in localStorage:", storedUser);
    }

    return response.data;
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      console.log("👤 No user found in localStorage");
      return null;
    }

    try {
      const user = JSON.parse(userStr);
      console.log("👤 Retrieved user from storage:", user);
      return user;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    console.log("👋 User logged out");
    return Promise.resolve();
  },
};


export const gigAPI = {
  getAllGigs: async () => {
    const response = await api.get("/gigs");
    return response.data;
  },

   getOpenGigs: async () => {
    const response = await api.get("/gigs/open");
    return response.data;
  },

  getMyGigs: async () => {
    const response = await api.get("/gigs/my-gigs");
    return response.data;
  },

  getAllGigsAdmin: async () => {
    const response = await api.get("/gigs/my-gigs/all");
    return response.data;
  },

  getGig: async (id) => {
    const response = await api.get(`/gigs/${id}`);
    return response.data;
  },

  createGig: async (gigData) => {
    const response = await api.post("/gigs", gigData);
    return response.data;
  },

  updateGig: async (id, gigData) => {
    const response = await api.put(`/gigs/${id}`, gigData);
    return response.data;
  },

  deleteGig: async (id) => {
    const response = await api.delete(`/gigs/${id}`);
    return response.data;
  },

  hireFreelancer: async (gigId, bidId) => {
    const response = await api.post(`/gigs/${gigId}/hire/${bidId}`);
    return response.data;
  },
};

export const bidAPI = {
  getMyBids: async () => {
    const response = await api.get("/bids/my-bids");
    return response.data;
  },

  getBidsByGig: async (gigId) => {
    const response = await api.get(`/bids/gig/${gigId}`);
    return response.data;
  },

  submitBid: async (bidData) => {
    console.log("📤 Submitting bid:", bidData);
    const response = await api.post("/bids", {
      gigId: bidData.gigId,
      price: bidData.price,
      proposal: bidData.proposal || bidData.message,
      deliveryTime: bidData.deliveryTime || 7,
    });
    console.log("📥 Bid response:", response.data);
    return response.data;
  },

  hireFreelancer: async (bidId) => {
    console.log("🤝 Hiring freelancer for bid:", bidId);
    const response = await api.patch(`/bids/${bidId}/hire`);
    return response.data;
  },

  hireFreelancerNew: async (gigId, bidId) => {
    console.log("🤝 Hiring freelancer for gig:", gigId, "bid:", bidId);
    const response = await api.post(`/gigs/${gigId}/hire/${bidId}`);
    return response.data;
  },

  getAssignedGigs: async () => {
    const response = await api.get("/bids/assigned");
    return response.data;
  },

  updateBidStatus: async (bidId, status) => {
    const response = await api.put(`/bids/${bidId}`, { status });
    return response.data;
  },
};

export default api;
