import axios from "axios";

export const getContests = async (req, res) => {
  const username = process.env.CLIST_USER_NAME;
  const apiKey = process.env.CLIST_API_KEY;
  
  if (!username || !apiKey) {
    console.warn("⚠️ Clist API credentials not set in server configuration. Returning empty array.");
    return res.status(200).json([]);
  }

  const now = new Date().toISOString();
  // Default platforms: 1 (Codeforces), 102 (LeetCode), 73 (HackerEarth), 74 (HackerRank), 93 (AtCoder)
  const platforms = req.query.platforms || "1,102,73,74,93";
  const limit = parseInt(req.query.limit, 10) || 20;

  try {
    const response = await axios.get("https://clist.by/api/v2/contest/", {
      params: {
        start__gte: now,
        order_by: "start",
        limit: limit,
        resource_id_in: platforms,
      },
      headers: {
        Authorization: `ApiKey ${username}:${apiKey}`,
      },
    });

    res.json(response.data.objects || []);
  } catch (error) {
    console.error("❌ Error fetching contests from Clist:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch contests from external provider." });
  }
};
