import { useState } from "react";
import { Box, FormControlLabel, Stack, Switch, Typography } from "@mui/material";
import { DemoSection } from "../components/DemoSection";
import { FakeMfePane } from "../components/FakeMfePane";
import { CodeBlock } from "../components/CodeBlock";
import { canonicalTokens, DesignTokens } from "../theme";

const ordersTokens: DesignTokens = {
  primary: "#0066ff",
  spacing: 8,
  radius: 4,
  fontSize: 13,
  fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
  surface: "#ffffff",
  text: "#0f172a",
};

const usersTokens: DesignTokens = {
  primary: "#0055dd",
  spacing: 14,
  radius: 12,
  fontSize: 15,
  fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
  surface: "#fafbfc",
  text: "#1f2937",
};

function FakeOrdersUI({ tokens }: { tokens: DesignTokens }) {
  return (
    <Box
      sx={{
        bgcolor: tokens.surface,
        color: tokens.text,
        fontFamily: tokens.fontFamily,
        fontSize: tokens.fontSize,
        p: `${tokens.spacing}px`,
        borderRadius: `${tokens.radius}px`,
        border: "1px solid #e2e8f0",
        flex: 1,
      }}
    >
      <Box sx={{ fontWeight: 700, mb: `${tokens.spacing / 2}px` }}>Orders</Box>
      <Box
        sx={{
          display: "flex",
          gap: `${tokens.spacing / 2}px`,
          mb: `${tokens.spacing}px`,
        }}
      >
        <Box
          sx={{
            bgcolor: tokens.primary,
            color: "#fff",
            px: `${tokens.spacing}px`,
            py: `${tokens.spacing / 2}px`,
            borderRadius: `${tokens.radius}px`,
            fontWeight: 600,
            fontSize: tokens.fontSize - 1,
          }}
        >
          + New order
        </Box>
        <Box
          sx={{
            border: `1px solid ${tokens.primary}`,
            color: tokens.primary,
            px: `${tokens.spacing}px`,
            py: `${tokens.spacing / 2}px`,
            borderRadius: `${tokens.radius}px`,
            fontWeight: 600,
            fontSize: tokens.fontSize - 1,
          }}
        >
          Filter
        </Box>
      </Box>
      {[
        ["#A-1042", "$1,240"],
        ["#A-1043", "$320"],
        ["#A-1044", "$98"],
      ].map(([id, total]) => (
        <Box
          key={id}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            py: `${tokens.spacing / 2}px`,
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <span>{id}</span>
          <span>{total}</span>
        </Box>
      ))}
    </Box>
  );
}

function FakeUsersUI({ tokens }: { tokens: DesignTokens }) {
  return (
    <Box
      sx={{
        bgcolor: tokens.surface,
        color: tokens.text,
        fontFamily: tokens.fontFamily,
        fontSize: tokens.fontSize,
        p: `${tokens.spacing}px`,
        borderRadius: `${tokens.radius}px`,
        border: "1px solid #e2e8f0",
        flex: 1,
      }}
    >
      <Box sx={{ fontWeight: 700, mb: `${tokens.spacing / 2}px` }}>Users</Box>
      <Box
        sx={{
          bgcolor: tokens.primary,
          color: "#fff",
          px: `${tokens.spacing}px`,
          py: `${tokens.spacing / 2}px`,
          borderRadius: `${tokens.radius}px`,
          fontWeight: 600,
          mb: `${tokens.spacing}px`,
          display: "inline-block",
          fontSize: tokens.fontSize - 1,
        }}
      >
        Invite user
      </Box>
      {["Marta R.", "Lin H.", "Diego A."].map((name) => (
        <Box
          key={name}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: `${tokens.spacing / 2}px`,
            py: `${tokens.spacing / 2}px`,
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <Box
            sx={{
              width: tokens.spacing * 2,
              height: tokens.spacing * 2,
              borderRadius: "50%",
              bgcolor: tokens.primary,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: tokens.fontSize - 2,
              fontWeight: 700,
            }}
          >
            {name[0]}
          </Box>
          <span>{name}</span>
        </Box>
      ))}
    </Box>
  );
}

export function DesignTokenDrift() {
  const [centralized, setCentralized] = useState(false);

  const ordersActive = centralized ? canonicalTokens : ordersTokens;
  const usersActive = centralized ? canonicalTokens : usersTokens;

  return (
    <DemoSection
      title="1. Design token drift"
      subtitle="Each microfrontend builds its own CSS, with its own Tailwind-style config. When teams evolve at different paces, primary colors, spacing, and radii silently diverge. Users notice — even if your designers don't."
      controls={
        <FormControlLabel
          control={
            <Switch
              checked={centralized}
              onChange={(e) => setCentralized(e.target.checked)}
              color="secondary"
            />
          }
          label={
            <Typography variant="body2" fontWeight={600}>
              Centralize tokens
            </Typography>
          }
        />
      }
      takeaway={
        centralized
          ? "Both MFEs now read from a single source of truth. Same primary, same radius, same scale — visual coherence restored."
          : "Two teams. Two tailwind.config.js. Two visual languages. Multiply by 10 microfrontends and you have a fragmented product."
      }
    >
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <FakeMfePane
          name="mfe-orders"
          team="alpha"
          badge={centralized ? "tokens@1.4.0" : "tailwind.config.js (local)"}
          badgeColor={centralized ? "success" : "warning"}
        >
          <FakeOrdersUI tokens={ordersActive} />
          <CodeBlock
            language="js"
            caption={centralized ? "imports shared tokens" : "mfe-orders/tailwind.config.js"}
            code={
              centralized
                ? `import { tokens } from "@org/design-tokens";\n\nmodule.exports = {\n  theme: { extend: tokens },\n};`
                : `module.exports = {\n  theme: {\n    colors:  { primary: "#0066ff" },\n    spacing: { unit: "8px" },\n    borderRadius: { md: "4px" },\n  },\n};`
            }
          />
        </FakeMfePane>

        <FakeMfePane
          name="mfe-users"
          team="beta"
          badge={centralized ? "tokens@1.4.0" : "tailwind.config.js (local)"}
          badgeColor={centralized ? "success" : "warning"}
        >
          <FakeUsersUI tokens={usersActive} />
          <CodeBlock
            language="js"
            caption={centralized ? "imports shared tokens" : "mfe-users/tailwind.config.js"}
            code={
              centralized
                ? `import { tokens } from "@org/design-tokens";\n\nmodule.exports = {\n  theme: { extend: tokens },\n};`
                : `module.exports = {\n  theme: {\n    colors:  { primary: "#0055dd" },\n    spacing: { unit: "14px" },\n    borderRadius: { md: "12px" },\n  },\n};`
            }
          />
        </FakeMfePane>
      </Stack>
    </DemoSection>
  );
}
