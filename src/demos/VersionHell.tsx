import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { DemoSection } from "../components/DemoSection";
import { ConsoleOutput, ConsoleEntry } from "../components/ConsoleOutput";
import { CodeBlock } from "../components/CodeBlock";

type Mfe = {
  name: string;
  team: string;
  react: string;
  mui: string;
  zustand: string;
  status: "idle" | "mounted" | "failed";
  failReason?: string;
};

const HOST = { react: "18.3.1", mui: "6.1.6", zustand: "4.5.5" };

const initial: Mfe[] = [
  { name: "mfe-orders", team: "alpha", react: "18.3.1", mui: "6.1.6", zustand: "4.5.5", status: "idle" },
  { name: "mfe-users", team: "beta", react: "18.2.0", mui: "5.15.18", zustand: "4.5.5", status: "idle" },
  { name: "mfe-dashboard", team: "gamma", react: "18.3.1", mui: "6.1.6", zustand: "4.4.0", status: "idle" },
  { name: "mfe-billing", team: "delta", react: "17.0.2", mui: "5.15.18", zustand: "4.5.5", status: "idle" },
];

function diffReason(m: Mfe): string | null {
  const issues: string[] = [];
  if (m.react !== HOST.react) issues.push(`react ${m.react} ≠ host ${HOST.react}`);
  if (m.mui !== HOST.mui) issues.push(`@mui/material ${m.mui} ≠ host ${HOST.mui}`);
  if (m.zustand !== HOST.zustand) issues.push(`zustand ${m.zustand} ≠ host ${HOST.zustand}`);
  return issues.length ? issues.join("; ") : null;
}

function VersionCell({ value, host }: { value: string; host: string }) {
  const ok = value === host;
  return (
    <Box
      component="span"
      sx={{
        fontFamily: "JetBrains Mono, monospace",
        fontSize: 12,
        color: ok ? "success.main" : "error.main",
        fontWeight: 600,
      }}
    >
      {value}
    </Box>
  );
}

export function VersionHell() {
  const [mfes, setMfes] = useState<Mfe[]>(initial);
  const [logs, setLogs] = useState<ConsoleEntry[]>([]);

  const allMounted = useMemo(() => mfes.every((m) => m.status === "mounted"), [mfes]);

  function mount(name: string) {
    setMfes((prev) =>
      prev.map((m) => {
        if (m.name !== name) return m;
        const reason = diffReason(m);
        if (!reason) {
          appendConsole({
            level: "log",
            source: name,
            ts: Date.now(),
            message: `Mounted into host shell. Singletons reused. Bundle size −410 kB.`,
          });
          return { ...m, status: "mounted" as const };
        }
        const messages: ConsoleEntry[] = [
          {
            level: "warn",
            source: name,
            ts: Date.now(),
            message: `Module Federation: requiredVersion mismatch — ${reason}`,
          },
        ];
        if (m.react !== HOST.react) {
          messages.push({
            level: "error",
            source: name,
            ts: Date.now() + 1,
            message:
              "Warning: You might have more than one copy of React in the same app. This can lead to subtle bugs in hooks.",
          });
          messages.push({
            level: "error",
            source: name,
            ts: Date.now() + 2,
            message:
              "Invalid hook call. Hooks can only be called inside the body of a function component.",
          });
        }
        if (m.mui !== HOST.mui) {
          messages.push({
            level: "warn",
            source: name,
            ts: Date.now() + 3,
            message:
              "MUI: Two instances of @emotion/react detected. ThemeProvider context will not propagate.",
          });
        }
        appendConsoleMany(messages);
        return { ...m, status: "failed" as const, failReason: reason };
      })
    );
  }

  function pinAll() {
    setMfes((prev) =>
      prev.map((m) => ({ ...m, react: HOST.react, mui: HOST.mui, zustand: HOST.zustand, status: "idle" as const }))
    );
    appendConsole({
      level: "log",
      ts: Date.now(),
      message: `Monorepo enforced ${HOST.react} / ${HOST.mui} / ${HOST.zustand} across all MFEs. requiredVersion locked.`,
    });
  }

  function reset() {
    setMfes(initial);
    setLogs([]);
  }

  function appendConsole(e: ConsoleEntry) {
    setLogs((prev) => [...prev, e].slice(-30));
  }
  function appendConsoleMany(es: ConsoleEntry[]) {
    setLogs((prev) => [...prev, ...es].slice(-30));
  }

  return (
    <DemoSection
      title="4. Version hell"
      subtitle="Module Federation will happily load two copies of React side by side. Hooks break. Theme context vanishes. The bundle doubles. The bug only surfaces in production. Mount each MFE below to watch the singleton break."
      controls={
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="contained" onClick={pinAll} disabled={allMounted}>
            Pin all to host versions
          </Button>
          <Button size="small" variant="text" onClick={reset}>
            Reset
          </Button>
        </Stack>
      }
      takeaway="Module Federation singletons only protect you when versions actually match. Pin exact versions in a monorepo, fail CI on drift, and treat package.json across MFEs as part of your infrastructure — not a per-team detail."
    >
      <Stack spacing={2}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} mb={1.5} alignItems="baseline">
            <Typography variant="overline" fontWeight={700}>
              Host shell
            </Typography>
            <Typography sx={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12.5 }}>
              react@{HOST.react} · @mui/material@{HOST.mui} · zustand@{HOST.zustand}
            </Typography>
          </Stack>
          <CodeBlock
            language="js"
            caption="webpack ModuleFederationPlugin"
            code={`shared: {
  react:           { singleton: true, requiredVersion: "${HOST.react}", strictVersion: true },
  "react-dom":     { singleton: true, requiredVersion: "${HOST.react}", strictVersion: true },
  "@mui/material": { singleton: true, requiredVersion: "${HOST.mui}",     strictVersion: true },
  zustand:         { singleton: true, requiredVersion: "${HOST.zustand}", strictVersion: true },
}`}
          />
        </Paper>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>MFE</TableCell>
                <TableCell>Team</TableCell>
                <TableCell>react</TableCell>
                <TableCell>@mui/material</TableCell>
                <TableCell>zustand</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mfes.map((m) => (
                <TableRow key={m.name}>
                  <TableCell sx={{ fontFamily: "JetBrains Mono, monospace" }}>{m.name}</TableCell>
                  <TableCell>{m.team}</TableCell>
                  <TableCell>
                    <VersionCell value={m.react} host={HOST.react} />
                  </TableCell>
                  <TableCell>
                    <VersionCell value={m.mui} host={HOST.mui} />
                  </TableCell>
                  <TableCell>
                    <VersionCell value={m.zustand} host={HOST.zustand} />
                  </TableCell>
                  <TableCell>
                    {m.status === "idle" && <Chip size="small" label="idle" variant="outlined" />}
                    {m.status === "mounted" && (
                      <Chip size="small" label="mounted" color="success" />
                    )}
                    {m.status === "failed" && <Chip size="small" label="failed" color="error" />}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant={m.status === "mounted" ? "outlined" : "contained"}
                      onClick={() => mount(m.name)}
                      disabled={m.status === "mounted"}
                    >
                      Mount
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <ConsoleOutput
          entries={logs}
          emptyHint="// click Mount on any MFE to attempt loading it into the host shell"
        />
      </Stack>
    </DemoSection>
  );
}
