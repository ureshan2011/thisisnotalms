---
maxPages: 2
---

## The three realities

- **VR** — fully replaces perceived environment
- **AR** — overlays content on the real environment, real time
- **MR** — spans the continuum between Real and Virtual (Milgram & Kishino, 1994)

Continuum: **Real Environment — AR — [Mixed Reality] — AV — Virtual Environment**

## Rekimoto & Nagao's 4 HCI models (1995)

| Model | Relationship between computer world and real world |
|---|---|
| A — GUI | Gap — separate, interact independently |
| B — Virtual Reality | User fully inside computer world; real world cut off |
| C — Ubiquitous Computers | Many small computers distributed in the real world |
| D — Augmented Interaction | Computer and real world directly linked — AR's model |

::: tip
AR ≠ "VR with see-through goggles" — it's a distinct interaction philosophy (Model D), keeping attention anchored in the real world.
:::

## Perception

**Stereopsis** = depth from combining two eye images. Vision ≈ 70–90% of processed sensory input — but presence needs more (audio, tracking, motion — e.g. NOVA 360 full-motion simulator ball).

## Devices

| VR | AR |
|---|---|
| Meta Quest 3 / Pro, HTC Vive XR Elite | HoloLens 2, Apple Vision Pro, XREAL Air, Niantic outdoor AR reference |

Enterprise AR sensor stack: LiDAR scanner · TrueDepth camera · downward/side cameras · IR illuminators.

## From consumer to enterprise

Pokémon GO / AR Sports Basketball → proves real-time spatial anchoring at scale.

**Semantic channels** (Niantic Lightship): sky, ground, natural/artificial ground, water, person, building, foliage, grass — classify *what* the camera sees.

**Presentation modes:** window · overlay · tabletop.

## Dev stack

Unity (both tracks) + **AR:** AR Foundation, Niantic Lightship, Vuforia. **VR:** Oculus SDK, OpenXR (cross-vendor, reduces lock-in).

## Deciding if it belongs in your SISP

Apply the 4 feasibility tests (Ch.4): operational (will staff actually use it?), technical (does it need full VR or does simple AR suffice?), economic (tangible cost vs benefit), schedule (mature enough now, or wait?).
