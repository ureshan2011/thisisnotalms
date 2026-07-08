---
number: 4
title: Strategic IT Planning — Business Case and the SDLC
shortTitle: Strategic IT Planning and the SDLC
subtitle: How a mission statement becomes a systems request, how requests are evaluated, and what feasibility actually tests
objectives:
  - Explain how strategic planning cascades from mission statement to business results
  - Describe the main drivers behind information systems requests
  - Distinguish internal from external factors that affect systems projects
  - Evaluate a systems request using the four tests of feasibility and the factors that set priority
  - Name the five phases of the systems development lifecycle and what each phase produces
---

## 4.1 From strategic plan to business results

Strategic planning is the process by which a company examines its purpose, vision and values, and turns that examination into a mission statement — the foundation from which everything else in this chapter follows.

![Purpose, Vision and Values converge into a Mission Statement, which cascades to Goals, then Objectives, then Business Operations (fed by Information Technology and other corporate resources), producing Business Results that affect Stakeholders.](diagrams/strategic-planning-cascade.svg)

::: definition
A **mission statement** is a company's foundational statement of purpose, vision and values. It cascades into **goals** (broad, long-term aims), then **objectives** (specific, measurable steps toward those goals), which in turn shape **business operations** — the day-to-day activity that information technology and other corporate resources exist to support.
:::

The chain does not stop at operations. Business operations produce **business results**, and those results affect **stakeholders** — everyone with a legitimate interest in the organisation's performance: employees, customers, owners, suppliers and the communities the organisation operates in. Reading the cascade in reverse is just as important as reading it forward: if a proposed information system cannot be traced back up this chain to a stated objective, it has no business case yet, however technically interesting it may be.

A typical strategic-planning exercise for an IT-relevant example works through a **SWOT analysis** — strengths, weaknesses, opportunities and threats — before committing to goals. A firm might identify excellent web design staff, low systems-analyst turnover and a recently upgraded network as strengths; several legacy systems and an unapproved budget increase as weaknesses; strong positioning for expansion and high potential for B2B growth as opportunities; and aggressive new web-based competition and new regulatory rules as threats. From that analysis follow **critical success factors** (what must go right), **critical business issues** (open questions that block progress), and a **case for action** (why change is needed now, not later).

## 4.2 The role of the IT department in project evaluation

Management leadership and information technology have become closely linked, and systems development today is far more team-oriented than it once was. That said, in some companies the IT department is still treated as a **gatekeeper** — a single point through which every request must pass and be approved — rather than as one voice among several in a genuinely collaborative evaluation process. Recognising which model an organisation actually operates under matters, because it changes who needs to be consulted before a systems request can move forward.

## 4.3 Why information systems projects get started

Systems requests are not random; they originate from a small, recurring set of drivers.

::: definition
The main reasons behind an **information systems request** are: **improved services** (to customers or internal users), **support for new products and services**, **better performance**, **stronger controls** (security, audit, data privacy), and **more information** (analytics, real-time reporting) that either reduces costs or enables new decisions.
:::

## 4.4 Internal and external factors in systems projects

Every systems request is shaped by forces both inside and outside the organisation, and a preliminary investigation should account for both.

<div class="key-concepts">

| Category | Factors |
|---|---|
| Internal | Strategic plan · top managers · user requests · the IT department itself · existing systems |
| External — market | Technology and vendors · suppliers (e.g. just-in-time, JIT, inventory arrangements) · customers (e.g. customer relationship management, CRM) · competitors |
| External — macro | Economy · government (regulation) |

</div>

::: example Worked Example — reading a systems request against both lenses
A logistics company proposes a new warehouse tracking system. Internally: the request aligns with the strategic plan's goal of faster order fulfilment, has active support from top management, and responds to specific requests from warehouse staff frustrated with manual counts. Externally: RFID and barcode technology has matured to the point of being affordable (technology); a key supplier now requires just-in-time delivery windows that the current manual process cannot reliably hit (suppliers); and a major customer has begun asking for real-time shipment visibility as a condition of continued business (customers, via CRM expectations). Every one of these factors strengthens the case; a request that could only point to internal enthusiasm, with no external pressure or opportunity behind it, would be a weaker candidate for priority.
:::

## 4.5 Evaluating systems requests

Most large companies route systems requests through a **systems review committee** (sometimes a computer resources committee); many smaller companies rely on a single designated manager instead of a formal committee. Either way, the goal is the same: evaluate requests consistently and set priorities, which requires a **properly designed systems request form** to standardise what information is submitted and ensure like-for-like comparison between competing requests.

## 4.6 The four tests of feasibility

A systems request that survives initial review still has to pass a **feasibility study** before significant resources are committed. Feasibility is tested from four distinct standpoints.

::: definition
**Operational feasibility** asks whether the proposed system will actually be used effectively once built — covering user acceptance, training needs, and resistance to changed ways of working.
:::

::: definition
**Technical feasibility** asks whether the organisation's technology, data volumes and in-house expertise can support the proposed system — including whether current systems analysts and infrastructure are equal to the job, or whether new capability must be acquired first.
:::

::: definition
**Economic feasibility** compares the ongoing cost of the current (or proposed) system against its expected financial benefit, justifying the capital investment required to build it.
:::

::: definition
**Schedule feasibility** asks whether the project can realistically be completed within a useful time frame, and how long its results are expected to remain valid once delivered.
:::

::: warning
A proposal can pass three of the four feasibility tests and still fail overall. A technically elegant, economically justified system that the organisation is not operationally ready to adopt — through resistance, inadequate training time, or unclear job-role implications — will underperform regardless of how sound its cost-benefit case looked on paper.
:::

## 4.7 Setting priorities

Once a request is judged feasible, it still competes with every other feasible request for limited resources. The factors that determine priority are the same questions a feasibility study already partially answers, reframed as comparative rather than absolute tests:

- Will the proposed system **reduce costs** — where, when, how, and by how much?
- Will it **increase revenue** — where, when, how, and by how much?
- Will it produce **more information or better results**, and are those results **measurable**?
- Will it **serve customers better**, or **serve the organisation better**?
- Can it be **implemented in a reasonable time period**, and how long will the results last?
- Are the necessary **financial, human and technical resources** actually available?

Wherever possible, an analyst should evaluate a proposed project using **tangible** costs and benefits — figures that represent actual or closely approximate dollar values — rather than resting the case on intangible claims that cannot later be checked against results.

## 4.8 From systems request to the SDLC

Systems planning — the request, evaluation, feasibility and priority-setting process this chapter has described — is the **first phase of the systems development lifecycle (SDLC)**. Once a request is approved, execution moves through four further phases.

::: definition
The **systems development lifecycle** proceeds through: **(1) Problem Definition** — stating the issue precisely, establishing requirements and constraints, and securing formal approval to proceed; **(2) Feasibility Study** — the operational/technical/economic/schedule analysis this chapter has already covered; **(3) System Analysis** — documenting existing workflows and hardware, then gathering new requirements through observation, interviews and validated user-experience methods; **(4) System Design** — converting requirements into technical specifications, first at a conceptual level (macro-level options, procurement alternatives) and then in detail (program modules, data models, sign-off-ready documentation); and **(5) System Development and Implementation** — building the system, then managing conversion, user training and changeover to live operation.
:::

The implementation phase carries its own distinct risks, separate from the technical build: **conversion** (the transition from old to new system, whether abrupt or phased), **user training** (assessing capability baselines and delivering training matched to them), and **changeover** (confirming the new system actually resolves the original problem before fully retiring the old one). A system that is technically complete but poorly converted or under-trained can fail in the field for reasons that have nothing to do with its design.

## 4.9 Key concepts and terminology

<div class="key-concepts">

| Term | Definition |
|---|---|
| Mission statement | A company's foundational statement of purpose, vision and values |
| Systems review committee | The group (or individual, in smaller firms) that evaluates and prioritises systems requests |
| Operational feasibility | Whether a system will be used effectively once developed |
| Technical feasibility | Whether current technology and expertise can support the system |
| Economic feasibility | Whether financial benefit justifies the cost of development |
| Schedule feasibility | Whether the project can be completed, and stay useful, within a realistic time frame |
| Tangible cost/benefit | A cost or benefit expressible in actual or closely approximate dollar terms |
| SDLC | The five-phase lifecycle — problem definition, feasibility, analysis, design, development/implementation — that follows a successful systems request |
| Conversion / changeover | The transition from an old system to a new one, and confirmation that the new system resolves the original problem |

</div>

## 4.10 Summary

::: summary End-of-topic summary
- Strategic planning cascades from purpose, vision and values through a mission statement, goals and objectives, to business operations and results that affect stakeholders — a systems request should trace back up this chain to a stated objective.
- Systems requests are driven by a recurring set of causes: improved service, new product/service support, better performance, stronger controls, and more information.
- Requests are shaped by internal factors (strategic plan, management, users, IT department, existing systems) and external factors (technology/vendors, suppliers, customers, competitors, economy, government).
- Feasibility is tested on four dimensions — operational, technical, economic and schedule — and a request can fail overall even if it passes most of them.
- Priority is set by tangible, measurable cost/benefit criteria: cost reduction, revenue increase, better information, customer and organisational service, realistic timeframe, and resource availability.
- Systems planning is the first phase of the SDLC; approval hands off to problem definition, feasibility, analysis, design, and development/implementation — where conversion, training and changeover carry their own risk, separate from the technical build.
:::

## Practice Questions

1. A company proposes replacing its paper-based expense-approval process with a mobile app. State one plausible internal factor and one plausible external factor that would support this request.
2. A proposed system is technically sound, economically justified, and can be delivered on schedule, but staff have not been consulted and strongly prefer the current paper process. Which feasibility test does this fail, and what is the likely consequence of proceeding anyway?
3. Two systems requests are both feasible. Request A will save $40,000/year in processing costs, starting in three months. Request B claims to "improve company culture" but offers no measurable figures. Using the priority-setting factors in this chapter, explain which request should generally be favoured, and why.

## Answer Key

1. **Internal factor:** the request responds to direct user complaints from staff who currently re-key expense data manually (user requests), or it is explicitly listed as a goal in the strategic plan to reduce administrative overhead. **External factor:** mobile expense-management technology has matured and become inexpensive to license (technology and vendors), or a competitor's faster reimbursement process has become a recruiting advantage the company needs to match (competitors).
2. This fails the **operational feasibility** test — the system may be technically sound, economically justified and on schedule, but it will not be used effectively if staff resist it. The likely consequence of proceeding anyway is low adoption, workarounds that undermine the system's intended benefits, and a project that technically "ships" but does not deliver the results the business case promised.
3. Request A should generally be favoured. It offers a specific, tangible, measurable benefit ($40,000/year, starting within three months) that can be verified after implementation, matching the chapter's emphasis on evaluating projects using tangible costs and benefits wherever possible. Request B's claimed benefit is intangible and unmeasurable as stated — it may still have value, but it cannot be compared on equal terms with Request A's figures, and a systems review committee would reasonably ask Request B's sponsor to quantify the claim before it competes for the same resources.
