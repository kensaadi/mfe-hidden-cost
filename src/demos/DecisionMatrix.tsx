import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { DemoSection } from "../components/DemoSection";

type Answer = "yes" | "no" | null;

type Question = {
  id: string;
  text: string;
  yesPushes: "mfe" | "mono";
  rationale: string;
};

const QUESTIONS: Question[] = [
  {
    id: "autonomy",
    text: "Are your teams truly autonomous — different products, different roadmaps?",
    yesPushes: "mfe",
    rationale: "Real autonomy is the only thing that justifies the operational tax.",
  },
  {
    id: "deploy",
    text: "Does each team need to deploy independently, multiple times a day?",
    yesPushes: "mfe",
    rationale: "If everyone ships in the same release train, you don't need separate runtimes.",
  },
  {
    id: "domains",
    text: "Are the domains genuinely separate (different data, different users, different SLAs)?",
    yesPushes: "mfe",
    rationale: "Org separation alone doesn't justify MFEs. Domain separation does.",
  },
  {
    id: "size",
    text: "Do you have more than 4 product teams owning frontend code?",
    yesPushes: "mfe",
    rationale: "Below this threshold, a monorepo with code ownership is almost always cheaper.",
  },
  {
    id: "tooling",
    text: "Do you have the platform team and tooling to manage version pinning, contracts, governance?",
    yesPushes: "mfe",
    rationale: "Without this you're choosing the complexity without the safety nets.",
  },
  {
    id: "designsystem",
    text: "Do you have a runtime-shareable design system (e.g., MUI theme) already in place?",
    yesPushes: "mfe",
    rationale: "Tailwind across MFEs is doable but doubles your governance burden.",
  },
];

function recommendation(answers: Record<string, Answer>) {
  const answered = QUESTIONS.filter((q) => answers[q.id] !== null);
  if (answered.length < 3) {
    return { kind: "incomplete" as const };
  }
  let mfeScore = 0;
  let monoScore = 0;
  for (const q of answered) {
    if (answers[q.id] === "yes") {
      if (q.yesPushes === "mfe") mfeScore++;
      else monoScore++;
    } else {
      if (q.yesPushes === "mfe") monoScore++;
      else mfeScore++;
    }
  }
  const total = mfeScore + monoScore;
  const mfePct = Math.round((mfeScore / total) * 100);

  if (mfePct >= 80) {
    return {
      kind: "mfe" as const,
      confidence: mfePct,
      message:
        "Microfrontends look like the right call. You have real autonomy, real deployment value, and the platform muscle to absorb the complexity.",
    };
  }
  if (mfePct <= 35) {
    return {
      kind: "mono" as const,
      confidence: 100 - mfePct,
      message:
        "A modular monorepo is almost certainly cheaper, faster, and more stable. Save MFEs for when staying monolithic actually hurts.",
    };
  }
  return {
    kind: "fence" as const,
    confidence: Math.max(mfePct, 100 - mfePct),
    message:
      "On the fence. Start as a modular monolith with strict module boundaries. Graduate to microfrontends only when the pain of staying monolithic exceeds the pain of going distributed.",
  };
}

export function DecisionMatrix() {
  const [answers, setAnswers] = useState<Record<string, Answer>>(() =>
    Object.fromEntries(QUESTIONS.map((q) => [q.id, null]))
  );

  const result = useMemo(() => recommendation(answers), [answers]);
  const answeredCount = QUESTIONS.filter((q) => answers[q.id] !== null).length;

  function setAnswer(id: string, v: Answer) {
    setAnswers((prev) => ({ ...prev, [id]: v }));
  }

  function reset() {
    setAnswers(Object.fromEntries(QUESTIONS.map((q) => [q.id, null])));
  }

  const badge =
    result.kind === "incomplete"
      ? { label: `Answer at least ${3 - answeredCount} more`, color: "default" as const }
      : result.kind === "mfe"
        ? { label: "Microfrontends", color: "success" as const }
        : result.kind === "mono"
          ? { label: "Modular Monolith", color: "primary" as const }
          : { label: "On the fence", color: "warning" as const };

  return (
    <DemoSection
      title="6. Should you actually go microfrontend?"
      subtitle="Six questions, one honest answer. Most teams asking this question already know — they just need permission to choose the boring solution."
      controls={
        <Button variant="text" size="small" onClick={reset}>
          Reset
        </Button>
      }
      takeaway={
        <>
          The right question is not <em>can we use microfrontends</em>, but <em>do we really need them</em>?
          Start with a monorepo. Graduate to microfrontends only when staying monolithic costs more.
        </>
      }
    >
      <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
        <Stack spacing={1.5} sx={{ flex: 2 }}>
          {QUESTIONS.map((q, i) => (
            <Paper key={q.id} variant="outlined" sx={{ p: 2 }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    Q{i + 1}
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {q.text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {q.rationale}
                  </Typography>
                </Box>
                <ToggleButtonGroup
                  exclusive
                  value={answers[q.id]}
                  onChange={(_e, v) => setAnswer(q.id, v as Answer)}
                  size="small"
                >
                  <ToggleButton value="yes" sx={{ minWidth: 64 }}>
                    Yes
                  </ToggleButton>
                  <ToggleButton value="no" sx={{ minWidth: 64 }}>
                    No
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            </Paper>
          ))}
        </Stack>

        <Card variant="outlined" sx={{ flex: 1, position: "sticky", top: 16, alignSelf: "flex-start" }}>
          <CardContent>
            <Typography variant="overline" color="text.secondary" fontWeight={700}>
              Recommendation
            </Typography>
            <Box mt={1} mb={2}>
              <Chip label={badge.label} color={badge.color} sx={{ fontWeight: 700 }} />
            </Box>
            {result.kind !== "incomplete" && (
              <>
                <Box mb={2}>
                  <Typography variant="caption" color="text.secondary">
                    Confidence
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={result.confidence}
                    color={
                      result.kind === "mfe" ? "success" : result.kind === "mono" ? "primary" : "warning"
                    }
                    sx={{ mt: 0.5, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" sx={{ fontFamily: "JetBrains Mono, monospace" }}>
                    {result.confidence}%
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.primary">
                  {result.message}
                </Typography>
              </>
            )}
            {result.kind === "incomplete" && (
              <Typography variant="body2" color="text.secondary">
                Answer at least three questions to get a recommendation. Be honest — the cost of choosing
                wrong is measured in years.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Stack>
    </DemoSection>
  );
}
