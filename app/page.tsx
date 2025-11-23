"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

type Insight = {
  title: string;
  description: string;
  tone: "positive" | "warning";
};

type StepKey = "question" | "background" | "goal" | "constraints";

const steps: { key: StepKey; title: string; description: string }[] = [
  {
    key: "question",
    title: "Your Question",
    description: "State the question clearly so we can unpack it."
  },
  {
    key: "background",
    title: "Background",
    description: "Add relevant context, history, or dependencies."
  },
  {
    key: "goal",
    title: "Desired Outcome",
    description: "Explain what a successful answer or solution looks like."
  },
  {
    key: "constraints",
    title: "Constraints",
    description: "List any limits such as time, tools, or stakeholders."
  }
];

const positivePhrases = [
  "Great clarity!",
  "Solid context!",
  "Thoughtful goal!",
  "Nice constraints!"
];

const warningPhrases = [
  "Could use more detail.",
  "Think about edge cases.",
  "Consider scope & timing.",
  "Clarify who is impacted."
];

const motionVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 }
};

export default function Home() {
  const [stage, setStage] = useState<StepKey>("question");
  const [question, setQuestion] = useState("");
  const [background, setBackground] = useState("");
  const [goal, setGoal] = useState("");
  const [constraints, setConstraints] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const progress = useMemo(() => {
    const entries = [question, background, goal, constraints];
    const filled = entries.filter((field) => field.trim().length > 0).length;
    return Math.round((filled / entries.length) * 100);
  }, [question, background, goal, constraints]);

  const insights = useMemo<Insight[]>(() => {
    const insightsList: Insight[] = [];
    const addInsight = (params: Insight) => {
      insightsList.push(params);
    };

    if (question.trim().length > 10) {
      addInsight({
        title: positivePhrases[0],
        description: "Your question has enough detail to start digging in.",
        tone: "positive"
      });
    } else {
      addInsight({
        title: warningPhrases[0],
        description:
          "Expand the core question with specifics. Try starting with who, what, when, where, why, or how.",
        tone: "warning"
      });
    }

    if (background.trim().length > 20) {
      addInsight({
        title: positivePhrases[1],
        description:
          "Solid background info makes it easier to deliver a precise answer.",
        tone: "positive"
      });
    } else {
      addInsight({
        title: warningPhrases[1],
        description:
          "Add dependencies, teammates, or previous attempts so others can avoid redundant suggestions.",
        tone: "warning"
      });
    }

    if (goal.trim().length > 10) {
      addInsight({
        title: positivePhrases[2],
        description:
          "Defining success helps others tailor advice to your expectations.",
        tone: "positive"
      });
    } else {
      addInsight({
        title: warningPhrases[2],
        description:
          "Think about the impact you want. Are you looking for a decision, a workaround, or validation?",
        tone: "warning"
      });
    }

    if (constraints.trim().length > 5) {
      addInsight({
        title: positivePhrases[3],
        description:
          "Knowing constraints early reduces back-and-forth clarifications.",
        tone: "positive"
      });
    } else {
      addInsight({
        title: warningPhrases[3],
        description:
          "Call out time limits, resources, or approvals you need. It sets expectations for possible answers.",
        tone: "warning"
      });
    }

    return insightsList;
  }, [question, background, goal, constraints]);

  const recommendedPrompts = useMemo(() => {
    const prompts: string[] = [];
    if (question.length > 0) {
      prompts.push(
        "What would solving this unlock for you or your team?",
        "Who needs to sign off once you have an answer?"
      );
    }
    if (!background) {
      prompts.push("What have you already tried or considered?");
    }
    if (!goal) {
      prompts.push("How will you know you're done?");
    }
    if (!constraints) {
      prompts.push("Are there deadlines or tools that limit your options?");
    }
    return prompts.slice(0, 4);
  }, [question, background, goal, constraints]);

  const formattedSummary = useMemo(() => {
    const lines = [
      `🧠 Question: ${question || "—"}`,
      `📚 Background: ${background || "—"}`,
      `🎯 Desired outcome: ${goal || "—"}`,
      `⏱️ Constraints: ${constraints || "—"}`,
      keywords.length > 0 ? `🏷️ Keywords: ${keywords.join(", ")}` : undefined
    ].filter(Boolean);
    return lines.join("\n");
  }, [question, background, goal, constraints, keywords]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch (error) {
      console.error("Failed to copy summary", error);
    }
  };

  const toggleKeyword = (keyword: string) => {
    setKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((item) => item !== keyword)
        : [...prev, keyword]
    );
  };

  const activeStepIndex = steps.findIndex((step) => step.key === stage);

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header>
          <motion.div
            {...motionVariants}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand-dark">
              Question Companion
            </span>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">
              Shape your question into a laser-focused brief.
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-600">
              Move through each step, capture the missing pieces, and share a
              complete context package. The clearer the question, the faster the
              answer.
            </p>
          </motion.div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Capture the essentials
                  </h2>
                  <p className="text-sm text-slate-500">
                    Fill in the fields below. Each step influences your context
                    score.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-semibold text-brand-dark">
                    {progress}%
                  </span>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Context score
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-4">
                {steps.map((step, index) => (
                  <button
                    key={step.key}
                    onClick={() => setStage(step.key)}
                    className={clsx(
                      "rounded-2xl border px-3 py-4 text-left transition",
                      "border-slate-200 bg-slate-50 hover:bg-white",
                      stage === step.key && "border-brand bg-white shadow-sm"
                    )}
                  >
                    <div className="text-xs uppercase tracking-wide text-slate-400">
                      Step {index + 1}
                    </div>
                    <div className="mt-1 text-base font-semibold text-slate-800">
                      {step.title}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {step.description}
                    </p>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={stage}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={motionVariants}
                  transition={{ duration: 0.25 }}
                  className="mt-8"
                >
                  {stage === "question" && (
                    <FieldCard
                      label="What question are you trying to answer?"
                      placeholder="Explain what you're stuck on, what decision you need, or what you want to understand."
                      value={question}
                      onChange={setQuestion}
                      autoFocus
                    />
                  )}
                  {stage === "background" && (
                    <FieldCard
                      label="What's the background?"
                      placeholder="Share relevant context, prior attempts, stakeholders involved, or anything that sets the scene."
                      value={background}
                      onChange={setBackground}
                    />
                  )}
                  {stage === "goal" && (
                    <FieldCard
                      label="What does success look like?"
                      placeholder="Describe how you'll know you got the answer you need. What outcome are you aiming for?"
                      value={goal}
                      onChange={setGoal}
                    />
                  )}
                  {stage === "constraints" && (
                    <FieldCard
                      label="Are there constraints?"
                      placeholder="List deadlines, resources, technical limits, or other constraints that shape potential solutions."
                      value={constraints}
                      onChange={setConstraints}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Quick keywords
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Tag your question so collaborators can route it faster.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["frontend", "backend", "product", "strategy", "process", "people"].map(
                  (keyword) => (
                    <button
                      key={keyword}
                      onClick={() => toggleKeyword(keyword)}
                      className={clsx(
                        "rounded-full border px-3 py-1 text-sm capitalize transition",
                        keywords.includes(keyword)
                          ? "border-brand bg-brand text-white shadow-sm"
                          : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-white"
                      )}
                    >
                      {keyword}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Insight pulses
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Generated guidance helps you spot missing context.
              </p>
              <div className="mt-4 space-y-3">
                {insights.map((insight, index) => (
                  <div
                    key={`${insight.tone}-${index}`}
                    className={clsx(
                      "rounded-2xl border p-4 text-sm transition",
                      insight.tone === "positive"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                        : "border-amber-200 bg-amber-50 text-amber-900"
                    )}
                  >
                    <p className="font-semibold">{insight.title}</p>
                    <p className="mt-1 leading-relaxed">{insight.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Reflective prompts
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Unlock deeper clarity with these quick checks.
              </p>
              {recommendedPrompts.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {recommendedPrompts.map((prompt) => (
                    <li
                      key={prompt}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                    >
                      {prompt}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                  You're all set! Your question is ready to share.
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Shareable summary
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Copy and paste this into Slack, email, or your doc.
              </p>
              <pre className="mt-4 max-h-52 overflow-y-auto rounded-2xl border border-slate-100 bg-slate-900/90 p-4 text-xs leading-relaxed text-slate-100">
                {formattedSummary || "Start filling out the fields to see your summary."}
              </pre>
              <button
                onClick={handleCopy}
                className={clsx(
                  "mt-4 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium shadow-sm transition",
                  copied
                    ? "bg-emerald-600 text-white"
                    : "bg-brand text-white hover:bg-brand-dark"
                )}
              >
                {copied ? "Copied!" : "Copy summary"}
              </button>
            </div>
          </aside>
        </section>

        <footer className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row">
          <div>
            <span className="font-medium text-slate-700">Pro tip:</span> Try
            sharing your summary before meetings to align on expectations.
          </div>
          <div className="flex items-center gap-3">
            {steps.map((step, index) => (
              <div
                key={step.key}
                className={clsx(
                  "h-2 rounded-full transition-all",
                  index <= activeStepIndex ? "bg-brand" : "bg-slate-200"
                )}
                style={{ width: index <= activeStepIndex ? "36px" : "24px" }}
              />
            ))}
          </div>
        </footer>
      </div>
    </main>
  );
}

type FieldCardProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
};

function FieldCard({
  label,
  placeholder,
  value,
  onChange,
  autoFocus
}: FieldCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-inner">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <textarea
        className="mt-3 h-40 w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
        placeholder={placeholder}
        value={value}
        autoFocus={autoFocus}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
