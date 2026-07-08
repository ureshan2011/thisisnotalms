---
number: 9
title: Immersive Realities — AR/VR in the Enterprise
subtitle: Virtual, augmented and mixed reality, the interaction models behind them, and why they belong in a strategic IS plan
objectives:
  - Define virtual, augmented and mixed reality and place them on Milgram's Reality-Virtuality Continuum
  - Explain the four human-computer interaction models that motivate immersive technology design
  - Describe the current landscape of VR and AR devices and their strategic use cases
  - Assess when an immersive-reality investment belongs in an organisation's SISP process
---

## 9.1 Why an emerging technology belongs in a planning course

A SISP process that only manages the systems an organisation already has is planning for a world that no longer exists by the time the plan is delivered. Part of SISP's core agenda — identifying value-adding information systems before a competitor does — requires understanding technologies that are not yet mainstream in your organisation, but plausibly will be within the planning horizon. Immersive reality is a useful case study precisely because it is still maturing: an organisation's strategic choice today is not "should we adopt this," but "at what stage of maturity does this technology cross into genuine business value for us."

## 9.2 Defining the three realities

::: definition
**Virtual Reality (VR)** fully replaces the user's perceived environment with a computer-generated one. **Augmented Reality (AR)** overlays computer-generated content onto the real environment in real time, without replacing it. **Mixed Reality (MR)** is the broader category spanning everything between a fully real and a fully virtual environment, within which AR and its counterpart, Augmented Virtuality, sit.
:::

![Milgram and Kishino's Reality–Virtuality Continuum: a single axis from Real Environment to Virtual Environment, with Augmented Reality near the real end, Augmented Virtuality near the virtual end, and Mixed Reality spanning the space between them.](diagrams/reality-virtuality-continuum.svg)

This continuum, formalised by Milgram and Kishino in 1994, matters strategically because it reframes AR and VR as two points on a single spectrum rather than as two unrelated technologies. A planning decision is rarely "AR or VR" in the abstract; it is a decision about how much of the real environment a given use case needs to preserve. A warehouse worker who needs to see the physical shelf in front of them while receiving picking instructions needs a position near the "real" end of the continuum (AR). A training simulation that benefits from a fully controlled, repeatable environment can sit near the "virtual" end (VR).

## 9.3 Four models of human-computer interaction

Before evaluating specific devices, it helps to understand the interaction philosophy each immersive technology embodies. Rekimoto and Nagao's 1995 framework, developed to motivate what they called "augmented interaction," distinguishes four models by how a human interacts with the computer world versus the real world.

::: definition
**Model A — GUI** — the computer world and the real world are separated by a **gap**; the user interacts with each independently, through a screen, with no direct link between the two. **Model B — Virtual Reality** — the user is placed entirely inside the computer world; connections to the real world are deliberately cut off. **Model C — Ubiquitous Computers** — multiple small computers are distributed throughout the real world, each interacting with the human directly, without one dominant interface. **Model D — Augmented Interaction** — the computer world and real world are directly linked, so the user interacts with real-world objects while computer-generated information is overlaid onto them in context.
:::

The strategic point of this framework is that AR is not simply "VR with see-through goggles" — it is a distinct interaction philosophy (Model D) built to keep the human's attention anchored in the real world while the computer supplies situationally relevant information, rather than pulling attention into a separate screen (Model A) or a separate world entirely (Model B).

## 9.4 Why vision alone is not enough

::: definition
**Stereopsis** is the perception of depth produced by the brain combining two slightly different images, one from each eye.
:::

Research estimates suggest vision accounts for a substantial share — commonly cited between 70% and 90% — of the sensory input the brain processes. This is part of why headset displays invest heavily in stereoscopic rendering: convincing depth perception is one of the highest-leverage things a device can get right. But vision alone does not produce a convincing sense of presence — spatial audio, tracked hand and head movement, and in some specialised setups, physical motion platforms, all contribute to making an immersive environment feel real rather than merely displayed. The **NOVA 360**, a full-motion simulation ball used in human-interface research, illustrates the point directly: it exists specifically because a visually convincing VR headset alone does not reproduce the vestibular sensation of physical movement, and some training and research applications need that sensation reproduced as well.

## 9.5 The current device landscape

<div class="key-concepts">

| Category | Examples | Notes |
|---|---|---|
| VR headsets | Meta Quest 3, Meta Quest Pro, HTC Vive XR Elite | Standalone, consumer and prosumer positioning |
| AR headsets | Microsoft HoloLens 2, Apple Vision Pro | Enterprise/prosumer mixed-reality devices with spatial sensing |
| AR smart glasses | XREAL Air, Niantic's outdoor AR headset reference design | Lighter-weight, narrower field of view, designed for everyday wear |

</div>

Enterprise-grade AR devices increasingly combine several sensor types to understand the physical space around the wearer: a **LiDAR scanner** for depth mapping, a **TrueDepth camera** for close-range facial or hand sensing, **downward and side cameras** for tracking hands and surroundings, and **infrared illuminators** to support low-light sensing. This sensor stack is what allows an AR device to place a virtual object convincingly on a real table, or to recognise a real doorway well enough to anchor a virtual portal to it — capability that a simple camera-and-screen AR app on a phone approximates far more crudely.

## 9.6 What AR is actually used for today

Consumer AR is most visible through games — Pokémon GO placed virtual creatures into real parks and streets using phone cameras and location data; simpler mobile apps let a user "shoot hoops" on their own desk by anchoring a virtual basketball hoop to a real surface. These consumer examples matter to a strategic planner because they demonstrate the underlying capability — real-time spatial anchoring — being proven at consumer scale, at low cost, before an enterprise use case has to justify the investment alone.

::: example Worked Example — from consumer game to enterprise capability
Niantic's Lightship platform, built originally for its AR games, provides developers with **semantic channels** — the ability to classify what a device's camera is seeing in real time: sky, ground, natural ground, artificial ground, water, person, building, foliage, grass. A retail chain evaluating an AR store-navigation app, or a facilities team evaluating AR-guided equipment maintenance, is drawing on exactly this capability: recognising *what kind* of real-world surface or object is in view, not just that something is there. The same semantic-segmentation technology that lets a game place a creature convincingly on "grass" rather than "pavement" is the technology an enterprise AR deployment needs to place a maintenance instruction convincingly next to the right piece of equipment.
:::

AR is also used to create and share **spatial scans** of real locations — a LiDAR-equipped device (paired with tools such as Niantic's Scaniverse) can scan a room or building into a shareable 3D model, which other users can then view and place AR content into. Game and application designers building on this capability distinguish several presentation modes for AR content: **window** mode (content appears through a bounded frame, like looking through a portal), **overlay** mode (content is superimposed directly onto the live camera view), and **tabletop** mode (content is anchored to a real horizontal surface, scaled to sit convincingly on it).

## 9.7 Getting started with development

For an organisation evaluating whether to build AR or VR capability in-house rather than buy a packaged solution, the development ecosystem is now mature enough to support both tracks without starting from a blank page. **Unity** is the dominant engine underlying both tracks. The **augmented reality beginner track** typically combines Unity with **AR Foundation** (Unity's cross-platform AR layer), **Niantic Lightship** (for semantic understanding and shared AR spaces) and **Vuforia** (image and object recognition). The **virtual reality beginner track** combines Unity with device SDKs such as **Oculus** and the cross-vendor **OpenXR** standard, which reduces the risk of building for a single headset vendor.

::: tip
OpenXR is worth flagging specifically in a SISP context: choosing a development stack built on an open, cross-vendor standard rather than a single manufacturer's proprietary SDK reduces vendor lock-in risk — the same category of risk this course examined generally in the risk-management chapter, applied to a specific emerging-technology decision.
:::

## 9.8 Deciding whether AR/VR belongs in your SISP process

Not every organisation should be planning an immersive-reality investment today, and the frameworks from earlier chapters give you the tools to decide. A **feasibility study** (Chapter 4) applied to an AR/VR proposal should weigh: operational feasibility (will staff actually use a headset in their daily workflow, or will it be abandoned after a pilot?); technical feasibility (does the use case need full VR immersion, or does the same problem yield to simpler AR on a phone already in every employee's pocket?); economic feasibility (does the device and integration cost compare favourably to the problem it solves, using tangible figures rather than a vague claim about "innovation"); and schedule feasibility (is the technology, and the organisation's tolerance for it, mature enough now, or would waiting eighteen months for the next device generation change the answer?).

::: summary End-of-topic summary
- VR fully replaces the perceived environment; AR overlays content onto the real one in real time; Mixed Reality spans the continuum between them, formalised by Milgram and Kishino (1994).
- Rekimoto and Nagao's four interaction models — GUI, VR, Ubiquitous Computers, Augmented Interaction — show that AR is a distinct interaction philosophy, not merely "VR with a see-through screen."
- Stereopsis and spatial audio matter because vision dominates sensory input, but presence requires more than visual fidelity alone — as full-motion simulators like the NOVA 360 demonstrate.
- Enterprise AR devices combine LiDAR, TrueDepth, and multiple camera types to understand physical space; semantic segmentation (classifying what a camera sees) is the capability bridge between consumer AR games and enterprise AR applications.
- A mature open development ecosystem (Unity, AR Foundation, Niantic Lightship, Oculus, OpenXR) lowers the barrier to build rather than buy — but the decision to invest should still pass the same four feasibility tests as any other systems request.
:::

## Practice Questions

1. A logistics company is deciding between a VR training simulation for new forklift operators and an AR overlay that guides operators in real time on the actual warehouse floor. Using Milgram's continuum, explain which use case sits closer to which end, and why.
2. Explain, using Rekimoto and Nagao's four models, why a smartphone AR app that overlays furniture onto a photo of your room is closer to Model D (Augmented Interaction) than to Model B (Virtual Reality), even though both involve a computer-generated image.
3. A retailer wants to deploy AR store navigation. Apply the four feasibility tests from Chapter 4 to this proposal and identify one specific risk under each test.

## Answer Key

1. The **training simulation** sits closer to the **virtual** end of the continuum: a controlled, repeatable, safety-critical environment benefits from fully replacing the perceived surroundings so trainees can practise without real consequences. The **real-time guidance overlay** sits closer to the **real/augmented** end: the operator must keep the actual warehouse floor, actual pallets and actual forklift in view at all times, with the system adding information on top rather than replacing what is seen — placing it firmly in AR, near the "Real Environment" end of the continuum.
2. In Model B (Virtual Reality), the user's connection to the real world is deliberately cut off — the computer world replaces it. The furniture-overlay app keeps the real photo of the room fully visible and adds the furniture *into* that real context, directly linking the computer-generated object to the real-world scene the camera sees — matching Model D (Augmented Interaction), where computer and real worlds are directly linked rather than separated.
3. **Operational feasibility risk:** shoppers may not adopt a phone-based navigation app if it is not clearly more convenient than simply asking staff or reading signage. **Technical feasibility risk:** the app requires the store's layout to be spatially mapped and kept up to date as shelving changes, which is an ongoing technical maintenance burden, not a one-time build. **Economic feasibility risk:** the cost of building and maintaining the spatial map and app may not be justified by a measurable increase in sales or reduced staff time spent on customer directions — this needs a tangible, not assumed, benefit figure. **Schedule feasibility risk:** if the retailer is early to this technology, waiting for wider customer AR-app familiarity (and better default smartphone AR capability) might change the cost-benefit case substantially in twelve to eighteen months.
