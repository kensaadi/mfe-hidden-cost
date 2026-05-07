import { Box, Typography } from "@mui/material";

export type ConsoleEntry = {
  level: "log" | "warn" | "error";
  source?: string;
  message: string;
  ts: number;
};

const levelColor: Record<ConsoleEntry["level"], string> = {
  log: "#cbd5e1",
  warn: "#fbbf24",
  error: "#f87171",
};

const levelBg: Record<ConsoleEntry["level"], string> = {
  log: "transparent",
  warn: "rgba(251, 191, 36, 0.08)",
  error: "rgba(248, 113, 113, 0.08)",
};

type Props = {
  entries: ConsoleEntry[];
  emptyHint?: string;
  height?: number | string;
};

export function ConsoleOutput({ entries, emptyHint = "// console is empty", height = 220 }: Props) {
  return (
    <Box
      sx={{
        bgcolor: "#0b1020",
        color: "#e2e8f0",
        borderRadius: 1.5,
        fontFamily: "JetBrains Mono, monospace",
        fontSize: 12.5,
        lineHeight: 1.6,
        overflow: "hidden",
        border: "1px solid #1e293b",
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
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        Console
      </Box>
      <Box sx={{ height, overflowY: "auto", p: 1.5 }}>
        {entries.length === 0 ? (
          <Typography
            sx={{ color: "#64748b", fontFamily: "inherit", fontSize: "inherit", fontStyle: "italic" }}
          >
            {emptyHint}
          </Typography>
        ) : (
          entries.map((entry, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                gap: 1,
                px: 1,
                py: 0.5,
                borderRadius: 0.5,
                bgcolor: levelBg[entry.level],
              }}
            >
              <Box sx={{ color: "#475569", minWidth: 70, fontSize: 11 }}>
                {new Date(entry.ts).toLocaleTimeString("en-GB", { hour12: false })}
              </Box>
              <Box
                sx={{
                  color: levelColor[entry.level],
                  fontWeight: 600,
                  textTransform: "uppercase",
                  minWidth: 50,
                  fontSize: 11,
                }}
              >
                {entry.level}
              </Box>
              {entry.source && (
                <Box sx={{ color: "#7dd3fc", minWidth: 110, fontSize: 11 }}>{entry.source}</Box>
              )}
              <Box sx={{ color: "#e2e8f0", flex: 1, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {entry.message}
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
