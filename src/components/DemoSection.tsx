import { Box, Stack, Typography, Paper } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  controls?: ReactNode;
  children: ReactNode;
  takeaway?: ReactNode;
};

export function DemoSection({ title, subtitle, controls, children, takeaway }: Props) {
  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "flex-end" }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {controls && <Box>{controls}</Box>}
      </Stack>

      <Box>{children}</Box>

      {takeaway && (
        <Paper
          variant="outlined"
          sx={{
            p: 2.5,
            borderLeft: "4px solid",
            borderLeftColor: "secondary.main",
            bgcolor: "rgba(99, 102, 241, 0.04)",
          }}
        >
          <Typography variant="overline" color="secondary.main" sx={{ fontWeight: 700 }}>
            Takeaway
          </Typography>
          <Typography variant="body2" color="text.primary">
            {takeaway}
          </Typography>
        </Paper>
      )}
    </Stack>
  );
}
