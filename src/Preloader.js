import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader({ text = "UDAVIN" }) {
  const [loading, setLoading] = useState(true);
  const [displayedText, setDisplayedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const hasStartedTyping = useRef(false);

  const typeNextChar = (index) => {
    if (index < text.length) {
      setDisplayedText((prev) => prev + text[index]);
      setTimeout(() => typeNextChar(index + 1), 150);
    } else {
      // Typing complete—start the delay before hiding
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    // Reset text only if we haven't started typing yet (helps with StrictMode double-mount)
    if (!hasStartedTyping.current) {
      setDisplayedText("");
      hasStartedTyping.current = true;
      typeNextChar(0); // Start typing
    }

    // Cursor blink toggle (runs independently)
    const cursorBlink = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    // Cleanup: Stop blinking when unmounting (typing timeout chain self-cleans)
    return () => clearInterval(cursorBlink);
  }, [text]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full bg-black flex items-center justify-center z-50"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-extrabold text-gray-200 tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {displayedText}
            {cursorVisible && <span className="inline-block w-1 bg-gray-200 ml-1">&nbsp;</span>}
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}