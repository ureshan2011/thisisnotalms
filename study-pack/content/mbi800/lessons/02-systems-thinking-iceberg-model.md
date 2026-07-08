---
number: 2
title: Systems Thinking and the Iceberg Model
subtitle: Seeing organisations as interconnected systems, and using the Iceberg Model to find the real cause of a problem
objectives:
  - Distinguish a system from a mere collection of parts
  - Explain systems thinking as a shift from linear cause-and-effect to interrelationships and patterns of change
  - Use the Iceberg Model to move from an observed event down to the mental models that produced it
  - Apply systems thinking to a documented technology incident
---

## 2.1 Why systems thinking comes first

Every framework later in this course — SISP's process dimensions, risk registers, feasibility studies — assumes you can already look at an organisation and see it as a system: a set of interconnected parts producing behaviour that no single part explains on its own. Without that habit of mind, planning collapses into fixing one visible symptom at a time, and the same problem returns in a different form a year later. This chapter builds that habit before any formal planning framework is introduced.

## 2.2 Collections versus systems

Not everything that looks like a group of things is a system. A **collection** is a set of items with no meaningful interaction between them; a **system** is a set of interacting parts that together produce behaviour none of the parts produce alone.

::: activity Activity — Collections vs. Systems
Sort the following into "system" or "collection", and state the test you used: a bowl of fruit; a football team; a toolbox; a kitchen; a toaster; a database of customer names.

A useful test: remove or swap one part. In a **collection**, the rest is unaffected (take an apple out of the bowl; the other fruit doesn't change). In a **system**, removing or changing one part changes how the others behave (remove one player from a football team mid-match; every other player's role shifts). By that test, a football team and a kitchen are systems — their parts interact and depend on each other to produce an outcome. A bowl of fruit and a toolbox are collections — the items co-exist without interacting. A toaster is a small system (heating element, timer and lever interact to produce toast); a customer database is a system once other processes query and depend on it, but a static list of names with no relationships defined is closer to a collection.
:::

## 2.3 What systems thinking actually changes

::: definition
**Systems thinking** is a way of seeing that replaces two habits of ordinary problem-solving: it sees **interrelationships** among parts rather than isolated linear cause-and-effect chains, and it sees **processes of change over time** rather than discrete snapshots.
:::

The habit it replaces is easy to recognise because it is the default. When a system fails, the natural response is to ask "what single thing caused this?" and fix that one thing. Systems thinking asks a different question: "what pattern of interacting parts made this failure likely, and would fixing only the visible part actually prevent it recurring?"

![Six blindfolded investigators each touch a different part of the same elephant and describe a different animal — no single vantage point sees the whole system.](diagrams/systems-elephant.svg)

The elephant parable captures the risk of *not* thinking in systems: each investigator is technically correct about the part they are touching, and each is wrong about the whole. In an organisation, the finance team, the IT department, the frontline staff and senior management each experience a system failure from a different vantage point — and a plan built from only one of those vantage points will be as incomplete as the investigator holding only the tail.

## 2.4 A systems-thinking example: the sales feedback loop

::: example Worked Example — the sales performance loop
A company reports poor sales performance. The linear response is to blame the sales team and demand they work harder. A systems view instead traces the loop: **inadequate selling effort** feeds into **out-of-date sales procedures** (the input to processing), which produces **poor sales performance** (the output). That poor performance is then reported back — via **incorrect sales information** — to **poor sales management**, which is itself both a control on the process and a contributor to the original inadequate selling effort. The loop closes on itself: management, acting on bad information, reinforces the very conditions that produced the bad information.
:::

![Input (inadequate selling effort) drives processing (out-of-date sales procedures), producing output (poor sales performance); a feedback loop from output through incorrect sales information back to poor sales management closes the cycle.](diagrams/systems-feedback-loop.svg)

Fixing this system by telling the sales team to try harder addresses none of the actual loop — it treats the output as though it were an isolated event, not the visible tip of a running feedback cycle. The correct intervention point is wherever the loop can most cheaply be broken, which the diagram — not intuition — reveals.

## 2.5 The Iceberg Model

Systems thinking's most practical export is the **Iceberg Model**: a way of asking why a single observed event is happening, by moving downward through progressively less visible layers.

::: definition
The **Iceberg Model** (Senge, *The Fifth Discipline*, 1996) organises a system into four layers, from most to least visible: **Events** (what is happening), **Patterns of Behaviour** (what has been happening, what trends are visible), **Structures** (the rules, workflows, resource allocations and relationships that produce the patterns), and **Mental Models** (the values, beliefs and assumptions that hold the structures in place).
:::

![The Iceberg: events visible above the waterline; patterns of behaviour, structures and mental models beneath it, in order of decreasing visibility and increasing leverage.](diagrams/iceberg-model.svg)

The diagram's two side labels matter as much as the four layers. **Learning** runs downward — each layer down explains more about *why* the layer above it happens. **Leverage** also runs downward — the deeper the layer at which you intervene, the more durable the fix, because mental models and structures shape many future events, while patching a single event fixes nothing about the next one. Most organisations spend nearly all their improvement effort on the Events layer — reacting to the latest outage, the latest complaint — precisely because it is the only layer that is directly visible without deliberate investigation.

::: activity Group Activity — Applying the Iceberg Model
Take a documented technology incident — the CrowdStrike/Windows outage of 2024 is a useful real case, as are a cybersecurity breach or a pattern of low user adoption in your own organisation — and work down through the model:

1. **Event.** State the single observable incident precisely (e.g. "a faulty content update caused widespread Windows system crashes").
2. **Patterns of behaviour.** What has been recurring around this event? (e.g. "outages of this class cluster around unreviewed emergency updates".)
3. **Structures.** What policies, technical architecture, workflows or resource allocations made that pattern possible? (e.g. "kernel-level update deployment with no staged rollout or canary testing".)
4. **Mental models.** What underlying belief allowed those structures to exist? (e.g. "an assumption that vendor updates are low-risk enough to skip staged deployment".)
5. Summarise what you found at the Structures and Mental Models layers — those are the levels at which a durable fix has to operate, not the Events layer.
:::

## 2.6 Key concepts and terminology

<div class="key-concepts">

| Term | Definition |
|---|---|
| System | A set of interacting parts producing behaviour no single part produces alone |
| Collection | A set of items with no meaningful interaction between them |
| Systems thinking | Seeing interrelationships and change over time, rather than isolated linear cause-and-effect |
| Feedback loop | A cycle in which a system's output influences its own future input |
| Iceberg Model | A four-layer framework — Events, Patterns of Behaviour, Structures, Mental Models — for finding the root cause of an observed event |
| Leverage | The degree to which an intervention prevents future recurrence, not just the current instance |

</div>

## 2.7 Summary

::: summary End-of-topic summary
- A system is defined by interaction between its parts, not by proximity or category; the "remove one part" test distinguishes systems from mere collections.
- Systems thinking replaces linear cause-and-effect reasoning with attention to interrelationships and to processes of change over time.
- Feedback loops mean that a system's output can reinforce the very conditions that produced it — visible in the sales-performance example.
- The Iceberg Model moves from Events (most visible, least leverage) down through Patterns of Behaviour and Structures to Mental Models (least visible, most leverage); durable fixes operate at the lower layers.
:::

## Practice Questions

1. A retail chain sees a recurring event: "checkout queues are long every Friday evening." Sketch what you would expect to find at the Patterns, Structures and Mental Models layers of the Iceberg Model for this event.
2. Explain, using the "remove one part" test, why a shared spreadsheet used by a single person to track their own to-do list is a collection, while the same spreadsheet becomes a system once three departments update it and each department's plans depend on the others' entries.
3. A hospital's IT team responds to every alert individually and closes each ticket once the alert stops firing. Using the Iceberg Model, explain why this practice guarantees the team stays permanently at the Events layer.

## Answer Key

1. **Patterns:** the delay recurs specifically at Friday evenings, not other times — suggesting a scheduling or staffing pattern rather than a one-off event. **Structures:** likely candidates include fixed staff rostering that does not scale with weekly demand peaks, a checkout system with no express lane, or a promotions calendar that concentrates offers on Fridays. **Mental models:** an underlying assumption that staffing costs should be held constant across the week, or that customer complaints about queueing are an acceptable cost of doing business. A fix aimed only at the Events layer — apologising to customers in the queue — leaves all three deeper layers untouched.
2. By the "remove one part" test: removing an item from a personal to-do list changes nothing about how the list is used elsewhere — there is no other part depending on it, so it is a collection. Once three departments update the same spreadsheet and each department's plans depend on what the others have entered, removing or changing one department's entries changes what the other two departments will do next — the parts now interact and depend on each other, which is the defining property of a system.
3. Responding to each alert until it stops firing addresses only the Events layer: the alert is the visible tip, and closing the ticket once it stops treats the event as resolved without asking what pattern, structure or belief produced it. Because no deeper layer is ever examined, the same class of event — different alert, same underlying structural cause — will keep recurring, and the team's practice guarantees they will keep discovering this at the least leverage-rich layer of the model.
