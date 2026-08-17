import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const scrollCurrentPageToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto",
  });

  document.querySelectorAll("[data-page-scroll-container]").forEach((element) => {
    element.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  });
};

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollCurrentPageToTop();
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event) => {
      if (!event.target.closest("button")) return;
      window.setTimeout(scrollCurrentPageToTop, 0);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}

export default ScrollToTop;
