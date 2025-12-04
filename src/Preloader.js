import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader({ text = "UDAVIN", onComplete }) {
  const [loading, setLoading] = useState(true);
  const [displayedText, setDisplayedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const hasStartedTyping = useRef(false);

  const typeNextChar = (index) => {
    if (index < text.length) {
      setDisplayedText((prev) => prev + text[index]);
      setTimeout(() => typeNextChar(index + 1), 75); // Faster typing speed
    } else {
      // Typing complete—start the delay before hiding
      setTimeout(() => {
        setLoading(false);
      }, 500); // Shorter delay
    }
  };

  useEffect(() => {
    if (!hasStartedTyping.current) {
      setDisplayedText("");
      hasStartedTyping.current = true;
      typeNextChar(0);
    }

    const cursorBlink = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorBlink);
  }, [text]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {loading && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full bg-black flex items-center justify-center z-50"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-extrabold text-gray-200 tracking-widest font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {displayedText}
            {cursorVisible && <span className="inline-block w-2 h-16 md:h-24 bg-blue-500 ml-2 align-middle"></span>}
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}