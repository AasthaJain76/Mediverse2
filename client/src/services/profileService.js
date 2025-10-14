import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || 'https://mediverse2-9.onrender.com/';

// ✅ Axios instance with credentials enabled
const axiosInstance = axios.create({
  baseURL: BASE,            
  withCredentials: true, // important for sending session cookies
});

// 📥 GET current user's profile
export const getMyProfile = async () => {
  console.log("📤 Sending request to:", "/profile/me");
  const res = await axiosInstance.get('/profile/me');
  return res.data;
};

// ✏️ UPDATE or CREATE current user's profile
export const updateMyProfile = async (profileData) => {
  const res = await axiosInstance.put('/profile/me', profileData);
  return res.data;
};

// ❌ DELETE current user's profile
export const deleteMyProfile = async () => {
  const res = await axiosInstance.delete('/profile/me');
  return res.data;
};

// 👤 GET another user's profile by ID (this is public, so no credentials needed)
export const getProfileById = async (userId) => {
  try {
    const res = await axiosInstance.get(`/profile/${userId}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch profile by ID:", error);
    throw error;
  }
};
