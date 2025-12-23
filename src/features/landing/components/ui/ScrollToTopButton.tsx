/**
 * 맨 위로 스크롤 버튼
 * 페이지를 아래로 스크롤하면 우측 하단에 나타나는 floating 버튼
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdKeyboardArrowUp } from "react-icons/md";

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // 300px 이상 스크롤하면 버튼 표시
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 hover:shadow-xl transition-all duration-200 group"
          aria-label="맨 위로 스크롤"
        >
          <MdKeyboardArrowUp className="w-6 h-6 group-hover:animate-bounce" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
