import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html {
    min-width: ${({ theme }) => theme.breakpoints.lg};
    scroll-behavior: smooth;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      min-width: 0;
    }
  }

  body {
    margin: 0;
    color: #0d2244;
    background: #ffffff;
    font-family: ${({ theme }) => theme.typography.fontBody};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      overflow-x: hidden;
    }
  }

  html.admin-route {
    min-width: 0;
    width: 100%;
    max-width: 100%;
    overflow-x: clip;
  }

  html.admin-route,
  html.admin-route body,
  html.admin-route #root {
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 0;
  }

  html.admin-route body {
    overflow-x: hidden;
  }

  html.admin-route,
  html.admin-route body,
  html.admin-route [data-page-scroll-container] {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  html.admin-route::-webkit-scrollbar,
  html.admin-route body::-webkit-scrollbar,
  html.admin-route [data-page-scroll-container]::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }

  html.admin-route img,
  html.admin-route svg,
  html.admin-route canvas,
  html.admin-route video,
  html.admin-route input,
  html.admin-route select,
  html.admin-route textarea,
  html.admin-route button {
    max-width: 100%;
  }

  code {
    font-family: ${({ theme }) => theme.typography.fontMono};
  }

  body.reveal-enabled [data-reveal] {
    opacity: 0;
    transform: translateY(34px);
    transition:
      opacity 760ms cubic-bezier(0.22, 1, 0.36, 1),
      transform 760ms cubic-bezier(0.22, 1, 0.36, 1);
    transition-delay: var(--reveal-delay, 0ms);
    will-change: opacity, transform;
  }

  body.reveal-enabled [data-reveal].is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }

    body.reveal-enabled [data-reveal] {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
`;

export default GlobalStyles;
