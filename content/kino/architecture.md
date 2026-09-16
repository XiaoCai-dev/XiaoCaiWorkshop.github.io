# Kino Architecture

Kino is designed as a set of cooperating agents over a shared task graph. Each
agent owns a capability; the planner decides who runs next. Nothing happens
outside the graph, so every step is inspectable and replayable.

## Architecture

At the top level there are four layers:

1. **Agent layer** — the thinkers.
2. **Task system** — the queue and execution engine.
3. **Asset system** — storage and versioning for media.
4. **Timeline layer** — the editable result (in progress).

They communicate only through the task graph and an event bus, never directly.
This keeps agents replaceable and runs reproducible.

## Agent Layer

Agents are thin: they receive a context, return a decision. The planner is the
only agent allowed to spawn other agents.

### Planner

The planner reads the current graph and the user intent, then emits the next
step as a task. It can decompose a step into subtasks, or call a tool agent.

```ts
type Plan = { kind: 'task'; task: Task } | { kind: 'spawn'; agent: AgentSpec };
```

### Tools

Tool agents wrap a concrete capability — script generation, shot selection,
TTS, captioning. They are deterministic given inputs and do not call other
agents.

## Task System

### Queue

A persistent priority queue. Every task has a status (`pending | running |
done | failed`) and a parent. Failures bubble up to the planner with the
error attached.

### Execution

The executor pulls tasks, dispatches them to the right agent, and writes the
result back to the graph. Retries with backoff are handled here; agents stay
pure.

## Asset System

### Storage

Assets are content-addressed (sha256) and immutable. A video frame, a generated
clip, a voiceover take — all live under the same scheme, deduplicated
automatically.

## Design Notes

- The graph is the source of truth, not the agents.
- Prefer many small tools over one large model.
- Every side effect goes through the asset system so runs are reproducible.
