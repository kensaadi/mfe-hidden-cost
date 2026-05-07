import { useState } from "react";
import {
  AppBar,
  Box,
  Container,
  Link,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import { DesignTokenDrift } from "./demos/DesignTokenDrift";
import { SharedThemeAdvantage } from "./demos/SharedThemeAdvantage";
import { HttpLayerComparison } from "./demos/HttpLayerComparison";
import { VersionHell } from "./demos/VersionHell";
import { SharedStoreMinefield } from "./demos/SharedStoreMinefield";
import { DecisionMatrix } from "./demos/DecisionMatrix";

const TABS = [
  { label: "Token drift", component: <DesignTokenDrift /> },
  { label: "Shared theme", component: <SharedThemeAdvantage /> },
  { label: "HTTP layer", component: <HttpLayerComparison /> },
  { label: "Version hell", component: <VersionHell /> },
  { label: "Shared store", component: <SharedStoreMinefield /> },
  { label: "Should you?", component: <DecisionMatrix /> },
];

export default function App() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      <AppBar position="sticky" color="default" elevation={0} sx={{ bgcolor: "background.paper", borderBottom: "1px solid", borderColor: "divider" }}>
        <Toolbar>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <HubOutlinedIcon color="secondary" />
            <Box>
              <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
                The Hidden Costs of Microfrontends
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Interactive companion · edge cases the tutorials skip
              </Typography>
            </Box>
          </Stack>
        </Toolbar>
        <Box sx={{ borderTop: "1px solid", borderColor: "divider" }}>
          <Container maxWidth="xl" disableGutters>
            <Tabs
              value={tab}
              onChange={(_e, v) => setTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              indicatorColor="secondary"
              textColor="inherit"
              sx={{ px: 2, "& .MuiTab-root": { fontWeight: 600, textTransform: "none" } }}
            >
              {TABS.map((t, i) => (
                <Tab key={t.label} label={`${i + 1}. ${t.label}`} />
              ))}
            </Tabs>
          </Container>
        </Box>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4, flex: 1 }}>
        {TABS[tab].component}
      </Container>

      <Box
        component="footer"
        sx={{
          mt: 8,
          py: 4,
          px: 4,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          color: 'text.secondary',
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
          }}
        >
          Ken Saadi
        </Typography>

        <Typography variant="body2">
          Frontend Architect • React • TypeScript • Microfrontends • Design Systems
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="https://github.com/kensaadi"
            target="_blank"
            underline="hover"
          >
            GitHub
          </Link>

          <Link
            href="https://linkedin.com/in/ken-saadi"
            target="_blank"
            underline="hover"
          >
            LinkedIn
          </Link>

          <Link
            href="https://dashforge-ui.com"
            target="_blank"
            underline="hover"
          >
            dashforge-ui.com
          </Link>
        </Box>

        <Typography
          variant="body2"
          sx={{
            mt: 1,
            maxWidth: 900,
            lineHeight: 1.7,
          }}
        >
          Each demo simulates two or more "microfrontends" inside a single React
          application — no real Module Federation, no real backend infrastructure.
          The goal is to make architectural failure modes visible: design token drift,
          dependency mismatches, shared session coupling, store synchronization issues,
          and long-term maintainability problems.
        </Typography>
      </Box>
    </Box>
  );
}
