 // app/layout.js
export const metadata = {
    title: "News Aggregator App",
    description: "Stay updated with the latest news.",
  };
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }
  
