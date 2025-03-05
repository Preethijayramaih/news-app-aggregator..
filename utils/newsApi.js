import axios from "axios";

const API_KEY = "pub_7297079b446addb900e4092c2d342a42fb10e"; // Your News API key
const BASE_URL = "https://newsdata.io/api/1/news"; // API base URL

/**
 * Fetches top headlines for a given category or query
 * @param {string} category - The category of news (e.g., "sports", "technology")
 * @param {string} searchQuery - The search query (for searching articles by keyword)
 * @returns {Array} List of articles
 */
export const getTopHeadlines = async (category = "general", searchQuery = "") => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: searchQuery || category, // Use search query if provided, otherwise fallback to category
        apiKey: API_KEY, // API Key
        language: "en", // Fetch news in English
      },
    });
    console.log(response.data); // Check what data we are getting from the API
    return response.data.results || []; // Return fetched articles or empty array
  } catch (error) {
    console.error("Error fetching news:", error);
    return []; // Return empty array if error occurs
  }
};
