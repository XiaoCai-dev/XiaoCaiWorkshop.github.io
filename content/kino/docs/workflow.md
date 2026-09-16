# Workflow

A run, end to end.

## 1. Intent

The user gives a prompt: *"a 20s product teaser, calm voiceover, slow zooms."*
Kino normalizes it into an intent object and seeds the task graph.

## 2. Plan

The planner expands the intent into a chain of tasks — script, shots, voiceover,
assembly. Each task records its inputs.

## 3. Execute

The executor dispatches tasks to tool agents in dependency order. Assets
produced along the way are stored content-addressed.

## 4. Assemble

A final assembly task stitches assets into a timeline. The timeline is itself
editable — you can nudge a shot or re-render a line and only that branch reruns.

## 5. Export

Render the timeline to a finished video. The full graph is kept, so the whole
run can be replayed or forked later.
