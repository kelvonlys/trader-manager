"use client";

import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import useColorMode from "@/hooks/useColorMode"; // ← Add this import

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [colorMode] = useColorMode(); // ← Get the current mode

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Apply "dark" class to <html> based on colorMode
  useEffect(() => {
    if (colorMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [colorMode]);

  return (
    <html lang="en" className={colorMode === "dark" ? "dark" : ""}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Roboto:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>

      <body
        suppressHydrationWarning={true}
        className="min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-white"
      >
        {loading ? (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-black z-50">
            <div className="text-4xl font-thin tracking-widest text-gray-400">
              Loading...
            </div>
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  );
}