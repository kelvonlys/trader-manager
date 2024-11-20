// useWindowDimensions.js
import { useState, useEffect } from 'react';

export function useWindowDimensions() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Initialize window size on component mount
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener when component mounts
    window.addEventListener('resize', handleResize);

    // Call handleResize immediately to set initial dimensions
    handleResize();

    // Remove event listener before unmounting
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures this runs once on mount and unmount

  return windowSize;
}
