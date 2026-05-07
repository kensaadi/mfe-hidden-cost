import { useMemo, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { DemoSection } from "../components/DemoSection";
import { FakeMfePane } from "../components/FakeMfePane";
import { CodeBlock } from "../components/CodeBlock";

const PRESETS: { name: string; color: string }[] = [
  { name: "Indigo", color: "#6366f1" },
  { name: "Emerald", color: "#10b981" },
  { name: "Sunset", color: "#f97316" },
  { name: "Crimson", color: "#e11d48" },
];

function MfeOrdersInner() {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Orders this week
        </Typography>
        <Stack direction="row" spacing={1} mb={2}>
          <Chip label="Paid" color="primary" size="small" />
          <Chip label="Pending" color="warning" size="small" variant="outlined" />
          <Chip label="Refunded" size="small" variant="outlined" />
        </Stack>
        <Stack spacing={1}>
          {[
            ["#A-1042", "$1,240"],
            ["#A-1043", "$320"],
          ].map(([id, total]) => (
            <Box
              key={id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1.25,
                bgcolor: "action.hover",
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                {id}
              </Typography>
              <Typography variant="body2">{total}</Typography>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={1} mt={2}>
          <Button variant="contained" size="small">
            New order
          </Button>
          <Button variant="outlined" size="small">
            Export
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function MfeUsersInner() {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Invite a teammate
        </Typography>
        <Stack spacing={1.5}>
          <TextField label="Email" size="small" defaultValue="alex@example.com" fullWidth />
          <TextField label="Role" size="small" defaultValue="Editor" fullWidth />
          <Stack direction="row" spacing={1}>
            <Button variant="contained" size="small">
              Send invite
            </Button>
            <Button variant="text" size="small">
              Cancel
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function SharedThemeAdvantage() {
  const [primary, setPrimary] = useState(PRESETS[0].color);
  const [dark, setDark] = useState(false);
  const [dense, setDense] = useState(false);
  const [radius, setRadius] = useState(10);

  const sharedTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: dark ? "dark" : "light",
          primary: { main: primary },
        },
        shape: { borderRadius: radius },
        typography: {
          fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
          button: { textTransform: "none", fontWeight: 600 },
        },
        components: {
          MuiButton: {
            defaultProps: { size: dense ? "small" : "medium", disableElevation: true },
          },
          MuiTextField: {
            defaultProps: { size: dense ? "small" : "medium" },
          },
        },
      }),
    [primary, dark, dense, radius]
  );

  const themeCode = `<ThemeProvider theme={sharedTheme}>
  <App />
</ThemeProvider>

const sharedTheme = createTheme({
  palette: { mode: "${dark ? "dark" : "light"}", primary: { main: "${primary}" } },
  shape:   { borderRadius: ${radius} },
});`;

  return (
    <DemoSection
      title="2. The shared MUI theme advantage"
      subtitle="Wrap every microfrontend in a single ThemeProvider and the design system becomes runtime-reactive. Mutate one token, every MFE updates in the same frame — no rebuild, no republish."
      controls={
        <Stack spacing={1.5}>
          <ButtonGroup size="small" variant="outlined">
            {PRESETS.map((p) => (
              <Button
                key={p.name}
                onClick={() => setPrimary(p.color)}
                variant={primary === p.color ? "contained" : "outlined"}
                sx={{
                  bgcolor: primary === p.color ? p.color : "transparent",
                  color: primary === p.color ? "#fff" : p.color,
                  borderColor: p.color,
                  "&:hover": { bgcolor: primary === p.color ? p.color : "transparent" },
                }}
              >
                {p.name}
              </Button>
            ))}
          </ButtonGroup>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControlLabel
              control={<Switch size="small" checked={dark} onChange={(e) => setDark(e.target.checked)} />}
              label={<Typography variant="body2">Dark</Typography>}
            />
            <FormControlLabel
              control={
                <Switch size="small" checked={dense} onChange={(e) => setDense(e.target.checked)} />
              }
              label={<Typography variant="body2">Dense</Typography>}
            />
            <ButtonGroup size="small" variant="outlined">
              {[2, 10, 20].map((r) => (
                <Button
                  key={r}
                  variant={radius === r ? "contained" : "outlined"}
                  onClick={() => setRadius(r)}
                >
                  r={r}
                </Button>
              ))}
            </ButtonGroup>
          </Stack>
        </Stack>
      }
      takeaway="One source of truth, propagated at runtime through React context. No CSS rebuild, no version bump. The cost is coupling — but for a true platform, that coupling is the point."
    >
      <ThemeProvider theme={sharedTheme}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <FakeMfePane name="mfe-orders" team="alpha" badge="theme: shared" badgeColor="success">
            <MfeOrdersInner />
          </FakeMfePane>
          <FakeMfePane name="mfe-users" team="beta" badge="theme: shared" badgeColor="success">
            <MfeUsersInner />
          </FakeMfePane>
        </Stack>
      </ThemeProvider>
      <Box mt={2}>
        <CodeBlock language="tsx" caption="single source of truth" code={themeCode} />
      </Box>
    </DemoSection>
  );
}
