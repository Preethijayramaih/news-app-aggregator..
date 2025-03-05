"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { getTopHeadlines } from "../utils/newsApi"; // Assuming this function is correctly fetching articles
import styles from "../styles/Home.module.css"; // Correctly import the CSS file

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null); // Reset error before fetching new data

      try {
        const fetchedArticles = await getTopHeadlines(category, searchQuery); // Fetching news articles
        setArticles(fetchedArticles || []); // Ensure we don’t set `null` to articles
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [category, searchQuery]); // Runs only when category or searchQuery changes

  // Function to bookmark the article
  const bookmarkArticle = (article) => {
    if (typeof window !== "undefined") {
      try {
        let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
        const isAlreadyBookmarked = bookmarks.some((b) => b.title === article.title);

        if (!isAlreadyBookmarked) {
          bookmarks.push(article);
          localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
          alert("Article bookmarked!");
        } else {
          alert("This article is already bookmarked!");
        }
      } catch (error) {
        console.error("Error bookmarking article:", error);
        alert("An error occurred while bookmarking.");
      }
    }
  };

  return (
    <div className={styles.page}>
      <Head>
        <title>News Aggregator App</title>
        <meta name="description" content="Stay updated with the latest news across multiple categories." />
      </Head>

      <div className={styles.header}>
        <h1 className={styles.stylishTitle}>
          {"Top Headlines".split("").map((char, index) => (
            <span key={index}>{char}</span>
          ))}
        </h1>
      </div>

      {error && <p className={styles.error}>{error}</p>} {/* Show error message if any */}

      {/* Search & Filter Container */}
      <div className={styles.searchContainer}>
        {/* Search Bar */}
        <input
          type="text"
          className={styles.searchBar}
          placeholder="Search for articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
        />

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={styles.categoryFilter}
        >
          <option value="general">General</option>
          <option value="sports">Sports</option>
          <option value="technology">Technology</option>
          <option value="business">Business</option>
          <option value="health">Health</option>
          <option value="entertainment">Entertainment</option>
        </select>
      </div>

      {/* Articles */}
      <div className={styles.grid}>
        {loading ? (
          <p className={styles.loadingText}>Loading articles...</p>
        ) : articles.length > 0 ? (
          articles.map((article, index) => (
            <div key={index} className={styles.article}>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={article.image_url || "https://via.placeholder.com/400x200.png?text=No+Image"}
                  alt={article.title}
                  className={styles.articleImage}
                />
                <h3 className={styles.articleTitle}>{article.title}</h3>
                <p>{article.source ? article.source.name : "Unknown Source"}</p>
                <p>{article.description || "No description available"}</p>
              </a>
              {/* Bookmark Button */}
              <button 
                onClick={() => bookmarkArticle(article)} 
                className={styles.bookmarkButton}>
                Bookmark
              </button>
            </div>
          ))
        ) : (
          <p>No articles found for this category.</p> // Display if no articles are found
        )}
      </div>
    </div>
  );
}
