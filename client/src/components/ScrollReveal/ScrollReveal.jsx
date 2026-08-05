import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function getRevealTargets(main) {
  const topLevelBlocks = Array.from(main.children);
  const footer = document.querySelector("footer");
  const targets =
    topLevelBlocks.length === 1 ? Array.from(topLevelBlocks[0].children) : topLevelBlocks;

  if (footer) {
    targets.push(footer);
  }

  return targets;
}

function ScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    const main = document.querySelector("main");
    let observer;
    let revealFrameId;

    if (!main) {
      return undefined;
    }

    document.body.classList.add("reveal-enabled");

    const frameId = window.requestAnimationFrame(() => {
      const targets = getRevealTargets(main).filter(
        (target) => target instanceof HTMLElement
      );

      targets.forEach((target, index) => {
        target.classList.remove("is-visible");
        target.setAttribute("data-reveal", "");
        target.style.setProperty("--reveal-delay", `${Math.min(index, 8) * 70}ms`);
      });

      if (!("IntersectionObserver" in window)) {
        revealFrameId = window.requestAnimationFrame(() => {
          targets.forEach((target) => target.classList.add("is-visible"));
        });
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: "0px 0px -12% 0px",
          threshold: 0.12,
        }
      );

      revealFrameId = window.requestAnimationFrame(() => {
        targets.forEach((target) => observer.observe(target));
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.cancelAnimationFrame(revealFrameId);

      if (observer) {
        observer.disconnect();
      }
    };
  }, [location.pathname]);

  return null;
}

export default ScrollReveal;
