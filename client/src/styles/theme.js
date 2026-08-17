const adminColors = {
  primary: "#0254a0",
  primaryHover: "#024987",
  primarySoft: "#f6fbff",
  primaryMuted: "rgba(2, 84, 160, 0.18)",
  secondary: "#2c649c",
  ink: "#0d2244",
  text: "#33425e",
  muted: "#64748b",
  subtle: "#77849a",
  surface: "#ffffff",
  canvas: "#f0f4f8",
  adminCanvas: "#eef3f9",
  adminHeader: "#071e49",
  border: "rgba(13, 34, 68, 0.08)",
  borderStrong: "rgba(13, 34, 68, 0.16)",
  overlay: "rgba(11, 31, 60, 0.45)",
  success: "#15803d",
  warning: "#b45309",
  danger: "#dc2626",
};

const adminSpacing = {
  4: "4px",
  8: "8px",
  16: "16px",
  24: "24px",
  32: "32px",
  48: "48px",
  64: "64px",
  96: "96px",
  xs: "8px",
  sm: "16px",
  md: "24px",
  lg: "32px",
  xl: "64px",
  "2xl": "96px",
  "3xl": "144px",
};

const adminRadius = {
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  xxl: "24px",
  pill: "999px",
  input: "12px",
  button: "12px",
  card: "20px",
  modal: "24px",
  full: "999px",
};

const adminBreakpoints = {
  mobile: "0px",
  tablet: "600px",
  laptop: "1024px",
  desktop: "1280px",
  ultrawide: "1600px",
  xs: "375px",
  sm: "600px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1600px",
};

const adminMedia = {
  tablet: `@media (min-width: ${adminBreakpoints.tablet})`,
  laptop: `@media (min-width: ${adminBreakpoints.laptop})`,
  desktop: `@media (min-width: ${adminBreakpoints.desktop})`,
  ultrawide: `@media (min-width: ${adminBreakpoints.ultrawide})`,
};

const adminTypography = {
  fontHeading: "var(--font-heading), sans-serif",
  fontBody: "var(--font-body), sans-serif",
  fontMono: "var(--font-mono), monospace",
  size: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px",
    "4xl": "36px",
    "5xl": "48px",
    "6xl": "60px",
    h6: "20px",
    h5: "24px",
    h4: "30px",
    h3: "36px",
    h2: "48px",
    h1: "clamp(48px, 8vw, 96px)",
  },
  weight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.65,
    heading: 1.2,
    body: 1.5,
  },
  letterSpacing: {
    tighter: "0",
    tight: "0",
    normal: "0",
    wide: "0.08em",
    wider: "0.18em",
  },
};

const adminShadows = {
  sm: "0 1px 2px rgba(15, 23, 42, 0.06)",
  md: "0 4px 12px rgba(15, 23, 42, 0.08)",
  lg: "0 12px 24px rgba(15, 23, 42, 0.12)",
  xl: "0 24px 48px rgba(15, 23, 42, 0.16)",
  focusRing: `0 0 0 3px ${adminColors.primaryMuted}`,
  card: "0 4px 12px rgba(15, 23, 42, 0.08)",
  glow: "0 0 60px rgba(2, 84, 160, 0.16)",
  glowStrong: "0 0 100px rgba(2, 84, 160, 0.22)",
};

const adminZIndex = {
  base: 0,
  sticky: 100,
  header: 200,
  overlay: 300,
  modal: 400,
  toast: 500,
  above: 10,
  dropdown: 250,
  cursor: 1000,
};

const adminMotion = {
  duration: {
    fast: "150ms",
    base: "250ms",
    slow: "400ms",
  },
  easing: {
    standard: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
};

const adminTransitions = {
  fast: `${adminMotion.duration.fast} ${adminMotion.easing.standard}`,
  base: `${adminMotion.duration.base} ${adminMotion.easing.standard}`,
  slow: `${adminMotion.duration.slow} ${adminMotion.easing.standard}`,
  smooth: `800ms ${adminMotion.easing.standard}`,
  cinematic: `1200ms ${adminMotion.easing.standard}`,
};

export const adminTheme = {
  spacing: adminSpacing,
  radius: adminRadius,
  breakpoints: adminBreakpoints,
  media: adminMedia,
  colors: adminColors,
  typography: adminTypography,
  shadows: adminShadows,
  zIndex: adminZIndex,
  motion: adminMotion,
  transitions: adminTransitions,
  blur: {
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "40px",
  },
};

export const theme = {
  typography: {
    fontHeading: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
    fontBody: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
    fontMono: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
    size: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      h6: "1.4rem",
      h5: "1.8rem",
      h4: "2.2rem",
      h3: "3rem",
      h2: "4.5rem",
      h1: "clamp(5rem, 10vw, 10rem)",
    },
    weight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 0.92,
      heading: 0.98,
      body: 1.75,
      relaxed: 1.95,
    },
    letterSpacing: {
      tighter: "-0.04em",
      tight: "-0.03em",
      normal: "-0.015em",
      wide: "0.08em",
      wider: "0.18em",
    },
  },
  breakpoints: {
    xs: "375px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
  radius: {
    sm: "10px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    full: "9999px",
  },
  spacing: {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "4rem",
    "2xl": "6rem",
    "3xl": "9rem",
  },
  transitions: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    base: "300ms cubic-bezier(0.22, 1, 0.36, 1)",
    slow: "500ms cubic-bezier(0.22, 1, 0.36, 1)",
    smooth: "800ms cubic-bezier(0.22, 1, 0.36, 1)",
    cinematic: "1200ms cubic-bezier(0.19, 1, 0.22, 1)",
  },
  shadows: {
    sm: "0 2px 8px rgba(11, 31, 60, 0.08)",
    md: "0 8px 24px rgba(11, 31, 60, 0.12)",
    lg: "0 16px 48px rgba(11, 31, 60, 0.16)",
    xl: "0 24px 80px rgba(11, 31, 60, 0.2)",
    card: "0 10px 40px rgba(11, 31, 60, 0.12), inset 0 1px 0 rgba(255,255,255,0.65)",
    glow: "0 0 60px rgba(2, 84, 160, 0.16)",
    glowStrong: "0 0 100px rgba(2, 84, 160, 0.22)",
  },
  blur: {
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "40px",
  },
  zIndex: {
    base: 0,
    above: 10,
    header: 100,
    dropdown: 150,
    modal: 200,
    overlay: 300,
    cursor: 1000,
  },
};

export default theme;
