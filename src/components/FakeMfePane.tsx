import { Box, Typography, Chip } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  name: string;
  team?: string;
  badge?: string;
  badgeColor?: "success" | "warning" | "error" | "info" | "default";
  children: ReactNode;
};

export function FakeMfePane({ name, team, badge, badgeColor = "default", children }: Props) {
  return (
    <Box
      sx={{
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        minHeight: 280,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1,
          bgcolor: "rgba(15, 23, 42, 0.04)",
          borderBottom: "1px solid",
          borderColor: "divider",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 12,
        }}
      >
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#ef4444" }} />
          <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#f59e0b" }} />
          <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#10b981" }} />
        </Box>
        <Typography sx={{ fontFamily: "inherit", fontSize: "inherit", ml: 1, fontWeight: 600 }}>
          {name}
        </Typography>
        {team && (
          <Typography
            sx={{ fontFamily: "inherit", fontSize: 11, color: "text.secondary", ml: 0.5 }}
          >
            · team {team}
          </Typography>
        )}
        <Box sx={{ flex: 1 }} />
        {badge && <Chip label={badge} size="small" color={badgeColor} variant="outlined" />}
      </Box>
      <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
        {children}
      </Box>
    </Box>
  );
}
