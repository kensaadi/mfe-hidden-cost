import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { DemoSection } from "../components/DemoSection";
import { FakeMfePane } from "../components/FakeMfePane";
import { CodeBlock } from "../components/CodeBlock";

type Listener = (n: number) => void;

class FakeStore {
  private value = 0;
  private listeners = new Set<Listener>();
  get() {
    return this.value;
  }
  set(v: number) {
    this.value = v;
    this.listeners.forEach((l) => l(v));
  }
  subscribe(l: Listener) {
    this.listeners.add(l);
    return () => {
      this.listeners.delete(l);
    };
  }
}

function useStoreValue(store: FakeStore) {
  const [v, setV] = useState(store.get());
  useEffect(() => store.subscribe(setV), [store]);
  return v;
}

function CartView({ store, mfeName }: { store: FakeStore; mfeName: string }) {
  const count = useStoreValue(store);
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="overline" color="text.secondary">
            Cart count
          </Typography>
          <Typography sx={{ fontFamily: "JetBrains Mono, monospace", fontSize: 32, fontWeight: 700 }}>
            {count}
          </Typography>
        </Box>
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" onClick={() => store.set(Math.max(0, count - 1))} aria-label="decrement">
            <RemoveIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => store.set(count + 1)} aria-label="increment">
            <AddIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "JetBrains Mono, monospace" }}>
        useCartStore() in {mfeName}
      </Typography>
    </Box>
  );
}

export function SharedStoreMinefield() {
  const healthyStore = useRef(new FakeStore()).current;
  const driftedStoreA = useRef(new FakeStore()).current;
  const driftedStoreB = useRef(new FakeStore()).current;

  const [drift, setDrift] = useState(false);

  // When toggling drift on, sync from healthy so the demo starts in a consistent place
  useEffect(() => {
    if (drift) {
      driftedStoreA.set(healthyStore.get());
      driftedStoreB.set(healthyStore.get());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drift]);

  const storeA = drift ? driftedStoreA : healthyStore;
  const storeB = drift ? driftedStoreB : healthyStore;

  return (
    <DemoSection
      title="5. The shared store minefield"
      subtitle="Cross-MFE state via Zustand or a custom event bus works — until the singleton silently doubles. Two copies of the store, two sources of truth, and a UX that won't reproduce locally."
      controls={
        <FormControlLabel
          control={<Switch checked={drift} onChange={(e) => setDrift(e.target.checked)} color="warning" />}
          label={
            <Typography variant="body2" fontWeight={600}>
              Simulate version drift
            </Typography>
          }
        />
      }
      takeaway="Cross-MFE state amplifies the version-hell problem: any drift produces ghost stores that look correct in isolation and fail in integration. Treat shared stores as critical infrastructure, or avoid them and pass state through the host."
    >
      <Stack spacing={2}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <FakeMfePane
            name="mfe-catalog"
            team="alpha"
            badge={drift ? "zustand@4.4.0" : "zustand@4.5.5 (singleton)"}
            badgeColor={drift ? "error" : "success"}
          >
            <CartView store={storeA} mfeName="mfe-catalog" />
          </FakeMfePane>
          <FakeMfePane
            name="mfe-checkout"
            team="beta"
            badge={drift ? "zustand@4.5.5" : "zustand@4.5.5 (singleton)"}
            badgeColor={drift ? "error" : "success"}
          >
            <CartView store={storeB} mfeName="mfe-checkout" />
          </FakeMfePane>
        </Stack>

        {drift ? (
          <Alert severity="error">
            Two zustand instances are loaded into memory. Each MFE has wired up its own store under
            the same name, but they no longer share state. Increment in catalog → checkout doesn't
            see it. Production-only bugs follow.
          </Alert>
        ) : (
          <Alert severity="success">
            Module Federation kept the zustand singleton intact. Both MFEs subscribe to the same
            store instance — incrementing in one is observed in the other.
          </Alert>
        )}

        <CodeBlock
          language="ts"
          caption={drift ? "what's actually loaded (broken)" : "what you wanted (healthy)"}
          code={
            drift
              ? `// mfe-catalog ships its own copy
import { create } from "zustand"; // 4.4.0

// mfe-checkout ships another copy
import { create } from "zustand"; // 4.5.5

// Module Federation gives up on the singleton
// because requiredVersion strictness failed.
// Two stores. Two truths. Silent fragmentation.`
              : `// packages/shared-store/cart.ts
import { create } from "zustand";

export const useCartStore = create<CartState>((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
}));

// Both MFEs import the same module instance.
// Module Federation singleton keeps zustand at one copy.`
          }
        />
      </Stack>
    </DemoSection>
  );
}
