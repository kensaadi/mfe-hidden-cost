import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import { DemoSection } from "../components/DemoSection";
import { FakeMfePane } from "../components/FakeMfePane";
import { CodeBlock } from "../components/CodeBlock";

type LogEntry = {
  ts: number;
  status: "ok" | "fail";
  url: string;
  token: string;
  reason?: string;
};

type FakeClient = {
  token: string;
  broken: boolean;
  request: (url: string) => { status: "ok" | "fail"; token: string; reason?: string };
};

function makeClient(initialToken: string): FakeClient {
  const client: FakeClient = {
    token: initialToken,
    broken: false,
    request(url) {
      if (this.broken) {
        return { status: "fail", token: this.token, url, reason: "interceptor threw" } as never;
      }
      return { status: "ok", token: this.token };
    },
  };
  return client;
}

const ISOLATED_MFES = ["mfe-orders", "mfe-users", "mfe-dashboard"] as const;
const SHARED_MFES = ["mfe-orders", "mfe-users", "mfe-dashboard"] as const;

function newToken() {
  return "tk_" + Math.random().toString(36).slice(2, 8);
}

function MiniLog({ entries }: { entries: LogEntry[] }) {
  if (entries.length === 0) {
    return (
      <Typography variant="caption" sx={{ color: "text.secondary", fontStyle: "italic" }}>
        No requests yet.
      </Typography>
    );
  }
  return (
    <Stack spacing={0.5} sx={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11.5 }}>
      {entries.slice(-3).map((e, i) => (
        <Box
          key={i}
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            color: e.status === "ok" ? "success.main" : "error.main",
          }}
        >
          <Box sx={{ minWidth: 64, color: "text.secondary" }}>
            {new Date(e.ts).toLocaleTimeString("en-GB", { hour12: false })}
          </Box>
          <Box sx={{ minWidth: 32, fontWeight: 700 }}>{e.status === "ok" ? "200" : "5xx"}</Box>
          <Box sx={{ flex: 1, color: "text.primary" }}>
            {e.url}{" "}
            <Box component="span" sx={{ color: "text.secondary" }}>
              · {e.token}
            </Box>
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

export function HttpLayerComparison() {
  const isolatedClients = useRef<Record<string, FakeClient>>({});
  const sharedClient = useRef<FakeClient | null>(null);

  if (Object.keys(isolatedClients.current).length === 0) {
    ISOLATED_MFES.forEach((m) => {
      isolatedClients.current[m] = makeClient(newToken());
    });
  }
  if (!sharedClient.current) {
    sharedClient.current = makeClient(newToken());
  }

  const [isolatedLogs, setIsolatedLogs] = useState<Record<string, LogEntry[]>>(() =>
    Object.fromEntries(ISOLATED_MFES.map((m) => [m, []]))
  );
  const [sharedLogs, setSharedLogs] = useState<Record<string, LogEntry[]>>(() =>
    Object.fromEntries(SHARED_MFES.map((m) => [m, []]))
  );
  const [, force] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      // simulate one MFE making a request periodically
      const mfeI = ISOLATED_MFES[Math.floor(Math.random() * ISOLATED_MFES.length)];
      const cI = isolatedClients.current[mfeI];
      const rI = cI.request(`/api/${mfeI.replace("mfe-", "")}`);
      setIsolatedLogs((prev) => ({
        ...prev,
        [mfeI]: [
          ...prev[mfeI],
          { ts: Date.now(), status: rI.status, url: `/api/${mfeI.replace("mfe-", "")}`, token: rI.token, reason: rI.reason },
        ],
      }));

      const mfeS = SHARED_MFES[Math.floor(Math.random() * SHARED_MFES.length)];
      const cS = sharedClient.current!;
      const rS = cS.request(`/api/${mfeS.replace("mfe-", "")}`);
      setSharedLogs((prev) => ({
        ...prev,
        [mfeS]: [
          ...prev[mfeS],
          { ts: Date.now(), status: rS.status, url: `/api/${mfeS.replace("mfe-", "")}`, token: rS.token, reason: rS.reason },
        ],
      }));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  function rotateIsolated(mfe: string) {
    isolatedClients.current[mfe].token = newToken();
    force((n) => n + 1);
  }

  function rotateShared() {
    sharedClient.current!.token = newToken();
    force((n) => n + 1);
  }

  function pushBreakingInterceptor() {
    sharedClient.current!.broken = true;
    force((n) => n + 1);
  }

  function fixShared() {
    sharedClient.current!.broken = false;
    sharedClient.current!.token = newToken();
    force((n) => n + 1);
  }

  return (
    <DemoSection
      title="3. Shared vs isolated HTTP layer"
      subtitle="Refresh tokens, retry policy, tracing — every MFE needs them. Sharing one Axios instance centralizes auth but globalizes outages. Per-MFE isolation buys safety at the cost of duplication. Click the buttons; watch what propagates and what doesn't."
      takeaway="Hybrid is usually the right answer: share the bare minimum (auth, error envelope) in a tiny package, let each MFE wrap and extend. The breaking-interceptor button shows why you don't want to share too much."
    >
      <Stack direction={{ xs: "column", lg: "row" }} spacing={2}>
        <Paper variant="outlined" sx={{ p: 2.5, flex: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
            <Box>
              <Typography variant="overline" color="warning.main" fontWeight={700}>
                Approach A — Isolated
              </Typography>
              <Typography variant="h6">Each MFE owns its Axios</Typography>
            </Box>
          </Stack>
          <CodeBlock
            language="ts"
            code={`// apps/mfe-orders/src/api/http.ts
const http = axios.create({ baseURL: API_URL });
http.interceptors.request.use(attachToken);`}
          />
          <Stack spacing={1.5} mt={2}>
            {ISOLATED_MFES.map((m) => {
              const client = isolatedClients.current[m];
              return (
                <FakeMfePane
                  key={m}
                  name={m}
                  badge={`token: ${client.token}`}
                  badgeColor="info"
                >
                  <MiniLog entries={isolatedLogs[m]} />
                  <Stack direction="row" spacing={1}>
                    <Button size="small" variant="outlined" onClick={() => rotateIsolated(m)}>
                      Rotate this MFE's token
                    </Button>
                  </Stack>
                </FakeMfePane>
              );
            })}
          </Stack>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Rotating one MFE's token leaves the others on stale tokens until each one rotates separately.
            Three teams, three deployments, three retry strategies.
          </Alert>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2.5, flex: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
            <Box>
              <Typography variant="overline" color="success.main" fontWeight={700}>
                Approach B — Shared
              </Typography>
              <Typography variant="h6">One Axios in @org/shared-api</Typography>
            </Box>
          </Stack>
          <CodeBlock
            language="ts"
            code={`// packages/shared-api/index.ts
export const http = axios.create({ baseURL: API_URL });
http.interceptors.request.use(attachToken);`}
          />
          <Stack spacing={1.5} mt={2}>
            {SHARED_MFES.map((m) => (
              <FakeMfePane
                key={m}
                name={m}
                badge={`token: ${sharedClient.current!.token}`}
                badgeColor={sharedClient.current!.broken ? "error" : "success"}
              >
                <MiniLog entries={sharedLogs[m]} />
              </FakeMfePane>
            ))}
          </Stack>
          <Stack direction="row" spacing={1} mt={2} flexWrap="wrap" useFlexGap>
            <Button variant="contained" size="small" onClick={rotateShared}>
              Rotate shared token
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={pushBreakingInterceptor}
              disabled={sharedClient.current!.broken}
            >
              Push breaking interceptor
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={fixShared}
              disabled={!sharedClient.current!.broken}
            >
              Roll back
            </Button>
          </Stack>
          {sharedClient.current!.broken && (
            <Alert severity="error" sx={{ mt: 2 }}>
              A faulty interceptor shipped in <code>@org/shared-api</code>. Every MFE on the platform is
              now failing at once. This is the cost of coupling.
            </Alert>
          )}
        </Paper>
      </Stack>
    </DemoSection>
  );
}
