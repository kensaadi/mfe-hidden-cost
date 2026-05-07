import { Box } from "@mui/material";

type Props = {
  code: string;
  language?: string;
  caption?: string;
};

export function CodeBlock({ code, language = "ts", caption }: Props) {
  return (
    <Box
      sx={{
        bgcolor: "#0b1020",
        color: "#e2e8f0",
        borderRadius: 1.5,
        overflow: "hidden",
        border: "1px solid #1e293b",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: 12.5,
      }}
    >
      <Box
        sx={{
          px: 1.5,
          py: 0.75,
          bgcolor: "#111733",
          borderBottom: "1px solid #1e293b",
          color: "#94a3b8",
          fontSize: 11,
          fontWeight: 600,
          display: "flex",
          gap: 1,
          alignItems: "center",
        }}
      >
        <Box sx={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>{language}</Box>
        {caption && <Box sx={{ color: "#64748b" }}>· {caption}</Box>}
      </Box>
      <Box
        component="pre"
        sx={{
          m: 0,
          p: 1.5,
          overflowX: "auto",
          whiteSpace: "pre",
        }}
      >
        <code>{code}</code>
      </Box>
    </Box>
  );
}
