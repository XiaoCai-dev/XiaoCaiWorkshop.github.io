# Agent Layer

Agents are the thinkers of Kino. The contract is intentionally small:

> An agent takes a `Context` and returns a `Decision`.

## Planner

The planner is the orchestrator. It is the only agent that may spawn other
agents or create subtasks. Everything else is a tool agent.

A planner turn:

1. Read the graph + user intent.
2. Decide the next step.
3. Emit a `Plan` (task or spawn).

## Tool Agents

Tool agents wrap one capability and are deterministic. Examples:

- `script` — draft / revise a script beat.
- `shots` — pick shots for a beat.
- `tts` — render a voiceover line.
- `caption` — generate and time captions.

## Memory

Each agent gets a bounded, read-only view of the graph — never the whole thing.
This keeps prompts small and agents focused.

See [architecture](/projects/kino/architecture) for how the planner and task
system connect.
