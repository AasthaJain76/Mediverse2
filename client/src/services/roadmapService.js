import axiosInstance from "../utils/axiosInstance";

export const generateRoadmap = async (topic) => {
  try {
    const response = await axiosInstance.post("/roadmap/generate", { topic });
    return response.data.roadmap; // matches backend res.json({ roadmap })
  } catch (error) {
    console.error("Error generating roadmap:", error.response?.data || error.message);
    throw new Error("Failed to generate roadmap. Please try again later.");
  }
};


export const saveRoadmap = async (topic, roadmap) => {
  try {
    const response = await axiosInstance.post("/roadmap/save", { topic, roadmap });
    return response.data; // e.g., { message: "Roadmap saved successfully" }
  } catch (error) {
    console.error("Error saving roadmap:", error.response?.data || error.message);
    throw new Error("Failed to save roadmap. Please try again later.");
  }
};


// ✅ Get all roadmaps of logged-in user
export const getMyRoadmaps = async () => {
  try {
    const response = await axiosInstance.post("/roadmap/my");
    return response.data; // should return an array of roadmaps
  } catch (error) {
    console.error("Error fetching my roadmaps:", error.response?.data || error.message);
    throw new Error("Failed to load your roadmaps. Please try again later.");
  }
};


// ✅ Fetch single roadmap by ID
export const getRoadmapById = async (id) => {
  try {
    const response = await axiosInstance.get(`/roadmap/${id}`);
    return response.data; // should return one roadmap object
  } catch (error) {
    console.error(
      `Error fetching roadmap with id ${id}:`,
      error.response?.data || error.message
    );
    throw new Error("Failed to load roadmap. Please try again later.");
  }
};
