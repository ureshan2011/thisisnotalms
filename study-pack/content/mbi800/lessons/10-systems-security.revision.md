---
maxPages: 2
---

## Six categories of loss

Business interruption · loss of software · **loss of data** (worst, hardest to recover) · loss of hardware · loss of facilities · loss of service & personnel.

## Security lifecycle (mirrors SDLC)

1. **Systems Analysis** — name the relevant threats + exposure
2. **Systems Design** — design controls + recovery plans
3. **Systems Implementation** — build the controls
4. **Operation, Evaluation & Control** — run + continuously reassess (never finishes)

## Sizing risk

- **Quantitative:** loss exposure = cost of one loss × likelihood
- **Qualitative:** rank by judgement (critical/high/medium/low) — used when reliable cost/probability data isn't available (most of the time)

## Active threats (deliberate) — 6 techniques

| Technique | Frequency | Note |
|---|---|---|
| Input manipulation | Most common | Needs least skill |
| Data theft | High | Damage invisible — data still there |
| Sabotage | Moderate | Often disgruntled insider |
| Misappropriation of resources | Moderate | "Harmless" but steals capacity |
| Direct file alteration | Lower | Bypasses all app validation |
| Program alteration | Rarest | Needs real technical skill |

**Who:** systems personnel (deepest access) · users (often the entry point) · intruders (hackers, wiretappers, impersonators).

## Malware types

- **Logic bomb** — dormant, triggered by a later event
- **Trojan horse** — malicious code disguised as legitimate
- **Worm** — self-spreads across network, no host program needed
- **Virus** — spreads by infecting other programs

## Passive threats (failures) — fault tolerance

| Level | Defence |
|---|---|
| Network | Duplicate communication paths |
| CPU | Watchdog processor takeover |
| Storage | Disk mirroring/shadowing |
| Power | UPS battery backup |
| Transactions | Rollback processing / DB shadowing |

## Backup strategies

| Strategy | Daily backup size | Restore |
|---|---|---|
| Full | Largest (everything) | Fastest — one tape |
| Incremental | Smallest (since last backup, resets flag) | Slowest — full + every incremental in order |
| Differential | Middle (since last full, no reset) | Simple — full + latest differential |
