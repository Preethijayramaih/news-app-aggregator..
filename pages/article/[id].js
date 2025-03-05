import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head"; // For dynamic page titles
import styles from "../../styles/Article.module.css"; // Make sure you have this CSS file

export default function ArticleDetails() {
  const [article, setArticle] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false); // Track bookmark state
  const router = useRouter();
  const { id } = router.query; // Get the article ID from the URL

  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        try {
          // Replace with actual API request or dynamic data fetching
          const fetchedArticle = {
            title: `Article ${id}`, // Example title using ID
            content: "This is the full content of the article...",
            image: "https://via.placeholder.com/600x300?text=News+Image", // Placeholder image
          };
          setArticle(fetchedArticle);

          // Check if the article is already bookmarked
          checkIfBookmarked(fetchedArticle);
        } catch (error) {
          console.error("Failed to fetch article:", error);
          setArticle(null);
        }
      };
      fetchArticle();
    }
  }, [id]); // Runs when the ID changes

  const checkIfBookmarked = (article) => {
    if (typeof window !== "undefined") {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
      const isAlreadyBookmarked = bookmarks.some((b) => b.title === article.title);
      setIsBookmarked(isAlreadyBookmarked);
    }
  };

  // Function to toggle bookmarking an article
  const toggleBookmark = (article) => {
    if (typeof window !== "undefined") {
      let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

      if (isBookmarked) {
        // If already bookmarked, remove from bookmarks
        bookmarks = bookmarks.filter((b) => b.title !== article.title);
        alert("Article removed from bookmarks!");
      } else {
        // Add to bookmarks
        bookmarks.push(article);
        alert("Article bookmarked!");
      }

      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      setIsBookmarked(!isBookmarked); // Toggle the bookmark status
    } else {
      console.warn("localStorage is not available.");
    }
  };

  return (
    <div className={styles.page}>
      {/* Dynamically set the title of the page */}
      <Head>
        <title>
          {article ? `${article.title} - News Aggregator App` : "Loading..."}
        </title>
      </Head>

      {article ? (
        <>
          <h1 className={styles.title}>{article.title}</h1>
          <img 
            src={article.image} 
            alt={article.title} 
            className={styles.image} 
          />
          <p className={styles.content}>{article.content}</p>
          
          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(article)}
            className={`${styles.bookmarkButton} ${isBookmarked ? styles.bookmarked : ""}`}
          >
            {isBookmarked ? "Remove Bookmark" : "Bookmark"}
          </button>
        </>
      ) : (
        <p className={styles.loadingText}>Loading article...</p>
      )}
    </div>
  );
}
