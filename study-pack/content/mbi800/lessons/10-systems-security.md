---
number: 10
title: Systems Security
subtitle: What an organisation stands to lose, how security is planned like any other system, and the active and passive threats that cause loss
objectives:
  - Name the six categories of loss a computerised organisation is exposed to
  - Explain the security lifecycle and why it mirrors the systems development lifecycle
  - Distinguish quantitative from qualitative risk assessment
  - Identify the six active-threat techniques and the passive failures that fault-tolerant design defends against
---

## 10.1 Why security closes this course

Every system this course has discussed planning, building, or investing in — Chapter 4's business cases, Chapter 9's immersive-reality deployments, every case study in Chapter 7 — is also a system that has to be defended once it exists. A SISP process that plans a system's value without planning its security has only done half the job. This chapter treats security the same way the rest of the course treats any other IS decision: as something to be planned, assessed and continuously reviewed, not bolted on once a system is already live.

## 10.2 What a computerised organisation stands to lose

::: definition
The six categories of loss facing a computerised organisation are: **business interruption** (the system goes down and transactions that should have happened, don't); **loss of software** (programs damaged, deleted or stolen); **loss of data** (the most painful and hardest to recover — hardware can be rebought in a day, years of records cannot); **loss of hardware** (physical devices destroyed, damaged or stolen); **loss of facilities** (the building, power or infrastructure itself); and **loss of service and personnel** (key staff or providers whose absence is as damaging as any technical failure).
:::

::: example Worked Example — the real cost of an outage
When an airline's booking system fails for a few hours, the aircraft still fly — the cost is not the broken server itself, but every booking, check-in and rebooking that could not happen while the system was down. This is why business interruption is listed first: it is often the loss category with the widest, least visible blast radius, since its cost accumulates in transactions that simply never occurred, rather than in damage that shows up on an asset register.
:::

## 10.3 The security lifecycle

Security is not a one-time purchase; it is a system, and it is planned the same way any other information system in this course is planned — through a four-phase lifecycle that closely mirrors the systems development lifecycle from Chapter 4.

::: definition
The **security lifecycle** proceeds through: **(1) Systems Analysis** — identifying which threats are actually relevant to this system and the loss exposure each one carries (you cannot protect against a threat you have not named); **(2) Systems Design** — designing the security measures and contingency/recovery plans that will control the identified exposures, before anything has gone wrong; **(3) Systems Implementation** — putting those measures in place exactly as designed (access controls, backups, fault tolerance, training — a plan on paper protects nothing); and **(4) Operation, Evaluation and Control** — running the security system and continuously assessing its effectiveness, because threats evolve and the system must change with them.
:::

::: tip
Phase 4 is the phase most often skipped in practice. Organisations that treat security as a project with an end date, rather than a loop with no finish line, are the ones still running defences designed for threats that no longer match how attackers actually operate.
:::

## 10.4 Sizing up a risk: quantitative versus qualitative assessment

Once a threat has been named, an organisation still has to decide how seriously to treat it relative to every other threat competing for the same security budget.

::: definition
**Quantitative risk assessment** puts a number on exposure: **loss exposure = cost of a single loss × the likelihood of it occurring**, producing an annual figure that can be ranked and budgeted against directly. **Qualitative risk assessment** instead ranks threats by judgement — critical, high, medium, low — without requiring precise cost and probability data.
:::

Quantitative assessment is more rigorous, but it depends on having reliable cost and probability figures — which, in practice, is often exactly the data an organisation does not have for a novel or rapidly evolving threat. Qualitative assessment is faster and more subjective, and is the default in most real organisations for precisely that reason: a security team can usually rank "ransomware encrypting the customer database" above "a lobby printer jamming" without needing a precise dollar figure for either.

## 10.5 Active threats — six deliberate attack techniques

**Active threats** are deliberate: someone is doing this on purpose. Six recurring techniques account for the great majority of computer fraud and sabotage.

<div class="key-concepts">

| Technique | What it is | Relative frequency |
|---|---|---|
| Input manipulation | Feeding deliberately wrong input to produce a wrong result | Most common — needs the least technical skill |
| Data theft | Stealing information via email, USB or similar channels | High — and the damage is invisible, since the data is still there |
| Sabotage | Destroying part of computer processing (logic bombs, Trojan horses, worms, viruses) | Moderate — often a disgruntled insider's weapon |
| Misappropriation of resources | Using company computing resources for personal purposes | Moderate — easy to dismiss as harmless, but steals capacity and raises liability |
| Direct file alteration | Editing data files directly, bypassing the application entirely | Lower — but dangerous because it sidesteps every validation rule the application enforces |
| Program alteration | Secretly changing program code's behaviour | Rarest — requires real technical skill few people have |

</div>

::: warning
Input manipulation is the most frequent fraud technique specifically *because* it requires no programming skill — typing a fake invoice or approving a fraudulent expense claim is available to almost anyone with legitimate system access. Program alteration is the rarest for the opposite reason: it demands genuine technical capability, which is exactly why programmers should never retain unauthorised access to live production code.
:::

### Who poses the threat

::: definition
Three groups pose active threats: **systems personnel** (maintenance staff, programmers, operators, administrators, data-control clerks — with the deepest access and so the greatest opportunity); **users** (people outside the data-processing function who still touch sensitive data and control important inputs — often overlooked, frequently the actual entry point); and **intruders** (outsiders breaking in — hackers seeking challenge, plus wiretappers, eavesdroppers, impersonators and unnoticed intruders).
:::

### Four kinds of malicious code

::: example Worked Example — telling malware types apart
A dormant piece of code left by a developer who was recently fired, set to wipe the customer database ninety days after their name disappears from the payroll file, is a **logic bomb** — dormant until a specific later event triggers it. A file named "FreeGameInstaller.exe" that looks like a harmless game but quietly opens a backdoor when run is a **Trojan horse** — destructive code disguised as something legitimate and useful. A program that copies itself to every machine on an office network overnight with no human action required is a **worm** — spreading itself across a network without needing a host program. Malicious code that attaches itself to a spreadsheet macro and copies itself into every subsequent file opened is a **virus** — spreading by infecting other programs with a copy of itself.
:::

## 10.6 Passive threats — failures, not attackers

**Passive threats** are not deliberate; they are failures — of a network link, a processor, a disk, a power supply, or a single transaction caught mid-way through. Fault-tolerant design defends against passive threats at each of five levels.

<div class="key-concepts">

| Level | Passive threat | Fault-tolerant defence |
|---|---|---|
| Network communications | A cut line isolates the system | Duplicate communication paths |
| CPU processors | The main processor fails | A watchdog processor stands ready to take over |
| Storage | A disk fails, corrupting data | Disk mirroring / shadowing — every write goes to two disks at once |
| Power supply | An outage interrupts operation | Battery backup (UPS) carries the load through without missing a beat |
| Individual transactions | A transaction fails mid-way | Rollback processing and database shadowing undo the half-finished transaction cleanly |

</div>

### Backup strategy

::: definition
**Full backup** copies every file, every time — largest storage cost, fastest single-tape restore. **Incremental backup** copies only files changed since the *last backup of any kind*, then resets the tracking flag — smallest daily backups, but restoring requires the full backup plus every incremental backup in the chain since, in order, and losing any one link breaks the chain. **Differential backup** copies files changed since the *last full backup*, without resetting the tracking flag — a middle ground: larger daily backups than incremental, but a simple two-step restore (the last full backup, plus the most recent differential).
:::

::: example Worked Example — choosing a backup strategy
A full backup runs every Sunday night. Restoring data lost on a Friday: with a **full-only** strategy, only Friday's full backup is needed — fast, but every backup stores the entire dataset again. With **incremental**, Sunday's full backup plus every daily incremental from Monday through Friday must be restored in sequence — the smallest backups day to day, but the slowest and most fragile restore, since losing any single day's tape breaks the chain. With **differential**, only Sunday's full backup plus Friday's differential are needed — a practical middle ground between the two extremes.
:::

## 10.7 Key concepts and terminology

<div class="key-concepts">

| Term | Definition |
|---|---|
| Active threat | A deliberate act — fraud, sabotage, theft — by a person |
| Passive threat | An unintended failure — of hardware, network, power or a transaction |
| Loss exposure | Quantitatively, the cost of a single loss multiplied by its likelihood |
| Logic bomb | Dormant code triggered by a specific later event |
| Trojan horse | Destructive code disguised as something legitimate |
| Worm | Self-spreading malicious code that needs no host program |
| Virus | Malicious code that spreads by infecting other programs |
| Fault tolerance | Design that keeps a system operating through a component failure |
| Incremental / differential backup | Backup strategies trading daily backup size against restore complexity |

</div>

## 10.8 Summary

::: summary End-of-topic summary
- Six loss categories threaten a computerised organisation: business interruption, and loss of software, data, hardware, facilities, and service/personnel.
- Security follows its own four-phase lifecycle — analysis, design, implementation, operation/evaluation/control — mirroring the systems development lifecycle, and phase 4 never truly ends.
- Risk can be assessed quantitatively (cost × likelihood) or qualitatively (ranked judgement); qualitative is more common because reliable cost/probability data is often unavailable.
- Six active-threat techniques, ranging from input manipulation (most common, least skill) to program alteration (rarest, most skill), are carried out by systems personnel, users, or intruders; logic bombs, Trojan horses, worms and viruses are the malicious-code forms sabotage most often takes.
- Passive threats are unintended failures, defended against through fault tolerance at the network, processor, storage, power and transaction levels — and through a deliberately chosen backup strategy (full, incremental or differential) that trades storage cost against restore speed and fragility.
:::

## Practice Questions

1. A company suffers a two-hour outage of its order-processing system. Using the six loss categories, explain why "business interruption" and "loss of hardware" can be almost entirely separate losses, even if the same outage causes both.
2. A disgruntled employee, about to be dismissed, is found to have left code that will delete the customer database automatically once their name is removed from the payroll system. Name the specific type of malicious code this is, and explain why it evaded detection until now.
3. A small business currently uses full backups only, every night. Explain one specific operational cost of this approach, and recommend an alternative strategy that reduces that cost — stating the trade-off your recommended alternative introduces.

## Answer Key

1. **Loss of hardware** is the physical damage — a server destroyed, a disk failed — which can typically be repaired or replaced within a fixed, known cost and timeframe (the chapter notes hardware "can be rebought in a day"). **Business interruption** is separate and often larger: it is every order, payment and customer interaction that could not happen during the two-hour window, a loss that accumulates continuously for the duration of the outage regardless of whether any hardware was actually damaged — a software bug or a network failure could cause the same two hours of business interruption with zero hardware loss at all.
2. This is a **logic bomb** — dormant code triggered by a specific later event, in this case the employee's name disappearing from the payroll file. It evaded detection because logic bombs are, by design, inert and unremarkable in normal operation; the malicious code produces no visible effect until its trigger condition is met, so a routine security scan looking for active, currently-executing malicious behaviour would find nothing to flag until the moment the bomb actually fires.
3. **Operational cost:** nightly full backups store the entire dataset every single night, which consumes far more storage capacity and backup-window time than necessary once the dataset grows, since most files do not change from one night to the next. **Recommended alternative:** switch to a **differential** backup strategy — one full backup (e.g. weekly) plus a daily differential of everything changed since that full backup. **Trade-off introduced:** daily differential backups grow larger as the week progresses (since they are not reset after each backup, unlike incremental), and a restore now requires two steps — the last full backup plus the most recent differential — rather than the single-tape restore a nightly full backup offered.
