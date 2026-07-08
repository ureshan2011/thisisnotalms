---
number: 6
title: Risk Management Standards
subtitle: Maintaining a risk register, and choosing between five industry frameworks for managing information systems risk
objectives:
  - Explain why risks to information systems must be monitored and reviewed on an ongoing basis, not assessed once
  - Describe the purpose and key steps of the NIST Risk Management Framework
  - Compare ISO/IEC 27005, COBIT, OCTAVE and FAIR on focus, method and typical use case
  - Select an appropriate risk framework for a given organisational context
---

## 6.1 Why risk is never assessed just once

Every information systems investment this course has discussed — a new system request, a SISP-approved initiative, a business case built on a canvas — carries risk that does not stay fixed after the initial assessment. A risk that currently sits within an organisation's tolerance may not stay there: threats evolve, controls age, and the business context that made a risk "acceptable" can change without anyone updating the risk assessment that said so.

::: definition
A **risk register** is a maintained record of the risks to an organisation's information systems and the controls currently in place for each one, reviewed on a routine schedule rather than left as a one-time assessment.
:::

Maintaining a risk register lets an organisation **monitor** whether a risk's rating has changed and whether its existing controls are still effective, and **review** whether the factors behind each risk — the likelihood or impact of it happening, or the suitability and cost of the control addressing it — have shifted since the last assessment. This routine draws on the same underlying process used to build the original assessment: analysing the risks to a system, and evaluating them against the organisation's risk tolerance.

## 6.2 Five industry frameworks compared

Beyond the discipline of monitoring and reviewing risk, organisations typically adopt one or more named frameworks to structure how risk is identified and managed in the first place. Five recur across industry.

<div class="key-concepts">

| Framework | Source | Focus | Use case |
|---|---|---|---|
| NIST RMF | U.S. NIST (SP 800-37 Rev.2) | Integrating cybersecurity into the system development lifecycle | Public sector, critical infrastructure, regulated industries |
| ISO/IEC 27005 | ISO, part of the 27000 family | Risk management supporting ISO 27001 compliance | Broad industry — finance, healthcare, tech |
| COBIT | ISACA | Governance and management of enterprise IT | Enterprises aligning IT with business goals |
| OCTAVE | Carnegie Mellon University SEI | Organisational risk evaluation from a strategic perspective | Medium–large organisations, business impact analysis |
| FAIR | The Open Group | Quantitative risk analysis in financial terms | Boards and CISOs wanting cost-based risk evaluation |

</div>

### NIST Risk Management Framework (RMF)

::: definition
The **NIST Risk Management Framework**, defined in SP 800-37 Rev.2, is a structured six-step lifecycle — **Categorize, Select, Implement, Assess, Authorize, Monitor** — for integrating cybersecurity and risk management activities directly into the system development lifecycle.
:::

RMF's distinguishing feature is that risk management is not a separate exercise bolted onto a finished system; each of its six steps corresponds to a stage most systems pass through anyway, from classifying a system's sensitivity (Categorize) through choosing and building in controls (Select, Implement) to formally accepting the residual risk (Authorize) and then continuing to watch it (Monitor). It is the standard most associated with government and other regulated environments where formal authorisation to operate a system is itself a required step.

### ISO/IEC 27005

::: definition
**ISO/IEC 27005** is part of the ISO/IEC 27000 family of Information Security Management System standards. It structures information-security risk management around **risk identification, risk analysis, risk evaluation and risk treatment**, and supports organisations seeking ISO 27001 certification.
:::

ISO/IEC 27005's broad industry uptake — finance, healthcare, technology and beyond — comes from its position as the risk-management companion to ISO 27001, the most widely recognised information-security certification. An organisation already pursuing ISO 27001 compliance will typically adopt 27005 as its risk methodology by default, rather than choosing it independently.

### COBIT

::: definition
**COBIT** (Control Objectives for Information and Related Technologies), published by ISACA, is a governance framework for the management of enterprise IT, built around components including **"Evaluate, Direct and Monitor"** and **"Align, Plan and Organize."**
:::

COBIT sits one level more strategic than the other four frameworks in this chapter: it is less a method for assessing a specific technical risk and more a governance structure for ensuring that IT activity — including risk management itself — stays aligned with business goals and management performance targets. Organisations reach for COBIT when the underlying question is governance ("is IT being managed and directed correctly?") rather than a specific technical risk assessment.

### OCTAVE

::: definition
**OCTAVE** (Operationally Critical Threat, Asset, and Vulnerability Evaluation), developed by Carnegie Mellon University's Software Engineering Institute, evaluates organisational risk from a strategic perspective through three steps: **identify assets and threats, evaluate vulnerabilities, develop a protection strategy.**
:::

OCTAVE's emphasis on asset identification before vulnerability analysis reflects its intended use: medium-to-large organisations conducting a **business impact analysis**, where the first genuine question is not "what could go wrong technically?" but "what do we actually have that matters, and to what degree would losing it hurt the business?"

### FAIR

::: definition
**FAIR** (Factor Analysis of Information Risk), published by The Open Group, is a quantitative risk-analysis model that converts cybersecurity and operational risk into **financial terms — a dollar value** — to support informed decision-making.
:::

FAIR's distinguishing strength is also its main cost: producing a defensible dollar figure for a risk requires more rigorous input data than the qualitative "high/medium/low" ratings common to the other frameworks. Where a board or a CISO needs to compare a security investment directly against its expected loss reduction in the same units used for every other capital decision, FAIR is the framework built for that comparison; where an organisation needs a faster, less data-intensive first pass, the other four frameworks are typically more practical starting points.

::: tip
None of these five frameworks is exclusive of the others. A regulated organisation might run NIST RMF for system authorisation, hold ISO 27001/27005 certification for its overall information-security management system, use COBIT to govern how IT investment decisions get made, and layer FAIR on top for the specific risks a board wants expressed in dollar terms. Frameworks compose; they are rarely a single either/or choice.
:::

## 6.3 Choosing a framework for a given context

::: example Worked Example — matching framework to context
A government agency handling citizen data needs to formally authorise a new case-management system before it goes live, and operates under a legislative mandate that requires documented risk acceptance at named checkpoints. **NIST RMF** fits directly — its Categorize→Authorize pipeline is built for exactly this requirement.

A private healthcare provider pursuing ISO 27001 certification to reassure hospital-network partners of its data-security posture needs a risk methodology that plugs directly into that certification. **ISO/IEC 27005** is the natural choice, since it is designed as 27001's risk-management companion.

A board of directors at a mid-sized financial-services firm wants next year's cybersecurity budget request justified in the same dollar terms as every other capital proposal on the agenda. **FAIR** is built for this comparison; a qualitative "high/medium/low" rating from any of the other four frameworks would not answer the board's actual question.
:::

## 6.4 Key concepts and terminology

<div class="key-concepts">

| Term | Definition |
|---|---|
| Risk register | A maintained record of risks and their controls, reviewed on an ongoing schedule |
| NIST RMF | Six-step lifecycle (Categorize–Monitor) integrating cybersecurity into system development |
| ISO/IEC 27005 | Risk management standard supporting ISO 27001 certification |
| COBIT | Enterprise IT governance framework aligning IT with business goals |
| OCTAVE | Strategic risk evaluation via asset/threat identification, vulnerability evaluation, protection strategy |
| FAIR | Quantitative framework converting risk into financial ($) terms |

</div>

## 6.5 Summary

::: summary End-of-topic summary
- Risk to information systems is not a one-time assessment; a maintained risk register lets an organisation monitor whether ratings have changed and review whether controls remain effective.
- NIST RMF integrates risk management into the system development lifecycle via six steps, and is most associated with public-sector and regulated environments.
- ISO/IEC 27005 supports ISO 27001 certification through risk identification, analysis, evaluation and treatment, and sees broad cross-industry use.
- COBIT is a governance framework aligning IT management with business goals, one level more strategic than a technical risk-assessment method.
- OCTAVE evaluates risk strategically through assets and business impact; FAIR converts risk into dollar terms for board-level, cost-based decisions.
- The five frameworks are not mutually exclusive; organisations commonly layer several together for different purposes.
:::

## Practice Questions

1. A hospital IT team wants to justify a security upgrade to its board using the same financial language the board uses for every other capital request. Which framework fits best, and why would a qualitative risk rating not satisfy the board's actual question?
2. Explain why ISO/IEC 27005 is rarely chosen independently of ISO 27001, and what that implies about how an organisation typically arrives at using it.
3. Compare NIST RMF and OCTAVE: both eventually produce a protective response to risk, but they start from different first questions. What is each framework's starting question?

## Answer Key

1. **FAIR** fits best, since it is specifically designed to convert cybersecurity risk into a dollar value, letting the security upgrade compete for budget in the same units as every other capital proposal. A qualitative "high/medium/low" rating from another framework would not satisfy the board's question because it cannot be directly compared against a dollar-denominated return-on-investment figure for a competing capital project — the board needs a number in the same currency as its other decisions, not a category label.
2. ISO/IEC 27005 is structured specifically as the risk-management companion within the ISO/IEC 27000 family, supporting organisations pursuing ISO 27001 certification. This implies that organisations typically do not select 27005 as a standalone risk methodology first; instead, the decision to pursue ISO 27001 certification (often driven by partner, customer or regulatory expectations) is what leads an organisation to adopt 27005 as the accompanying risk-management approach.
3. **NIST RMF** starts from the system development lifecycle itself — its first question is essentially "as we build or acquire this system, how do we categorise it and select the right controls before authorising it to operate?" **OCTAVE** starts from the organisation's assets — its first question is "what do we actually have that matters, and how badly would losing it hurt the business?" — before moving to vulnerabilities and a protection strategy. NIST RMF is anchored to a specific system's development process; OCTAVE is anchored to the organisation's overall asset base and strategic exposure.
