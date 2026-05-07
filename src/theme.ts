import { createTheme, Theme } from "@mui/material/styles";

export const shellTheme: Theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1f2937" },
    secondary: { main: "#6366f1" },
    background: {
      default: "#f6f7fb",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#475569",
    },
  },
  typography: {
    fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700, letterSpacing: "-0.01em" },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
  },
});

export type DesignTokens = {
  primary: string;
  spacing: number;
  radius: number;
  fontSize: number;
  fontFamily: string;
  surface: string;
  text: string;
};

export const canonicalTokens: DesignTokens = {
  primary: "#0066ff",
  spacing: 12,
  radius: 10,
  fontSize: 14,
  fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
  surface: "#ffffff",
  text: "#0f172a",
};
