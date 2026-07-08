---
number: 11
title: Platform Strategy
subtitle: Pipes versus platforms, network effects, governance, and two case studies — one flywheel, one $4 billion cautionary tale
objectives:
  - Distinguish a pipeline business, a product business and a platform business
  - Identify the four types of network effect and explain why they are not all positive
  - Apply the chicken-and-egg tactics a platform can use to seed both sides of a market
  - Evaluate a platform's governance approach and its risk of failure, using the Amazon and GE Predix cases
---

## 11.1 Why platform strategy belongs in a SISP course

Classic SISP models — including everything this course has covered through Chapter 4 — implicitly assume a firm controls its whole value chain, end to end. That assumption breaks the moment a firm's biggest strategic decisions involve a network it does not fully own: outside sellers, independent developers, or drivers who are not employees. A traditional plan asks what systems the value chain needs, how to align IT with the business, what the architecture roadmap looks like, and how to govern IT risk. A platform-era plan has to ask a parallel set of questions: what ecosystem is the firm part of, how do outsiders safely build on it, is the architecture open at the edges, and how do you govern a network you do not own?

## 11.2 Pipes, products and platforms

::: definition
A **pipeline business** moves value in one direction — design, build, sell — with the firm owning the whole chain. A **product business** sells a single offering directly, with no crowd of outside partners required. A **platform business** connects two or more distinct groups, with the owner supplying rules and infrastructure rather than necessarily owning the product being exchanged.
:::

The distinction matters strategically because platforms **orchestrate** value rather than **own** it. A pipeline business grows by building more capacity itself; a platform business can grow by attracting more of other people's capacity — inventory, developer talent, or drivers — onto infrastructure it controls.

## 11.3 Network effects — and their dark side

::: definition
A **network effect** exists when a platform becomes more valuable as more people use it. Four distinct types recur: **cross-side positive** (more drivers on a ride-hailing platform means shorter waits for riders, and more riders means more fares for drivers); **same-side positive** (more friends using a messaging app makes it more useful to you, with no other side involved); **same-side negative** (too many drivers competing in one area lowers earnings per driver — growth on one side is not automatically good for that side); and **data network effects** (every interaction improves recommendations for everyone, even without adding new users — the same mechanism behind Netflix's data flywheel in Chapter 8).
:::

::: warning
Network effects are not uniformly positive. Managing the negative ones — congestion, oversupply, quality dilution — matters as much as growing the positive ones. A platform that only optimises for growth on every side, without watching for same-side negative effects, can grow itself into a worse experience for its own most active users.
:::

## 11.4 Solving the chicken-and-egg problem

Neither side of a two-sided platform wants to join an empty one: a seller will not list on a marketplace with no buyers, and a buyer will not visit a marketplace with no sellers. Solving this requires pricing — or seeding — the two sides differently.

<div class="key-concepts">

| Tactic | How it works | Example |
|---|---|---|
| Subsidise one side | Pay or discount one side to guarantee supply before the other side trusts the platform | Uber paid early drivers to guarantee supply before riders trusted the app |
| Single-player mode | Make the platform useful even with zero participants on the other side | Early Airbnb worked as a browsing tool even with no hosts nearby |
| Seed your own supply | The platform owner supplies inventory itself before opening to third parties | Amazon and Zappos listed their own inventory first, before opening to outside sellers |
| Piggyback a network | Launch inside an existing platform where your target users already gather | PayPal grew by riding on eBay auctions |
| Target a micro-market | Launch in one small, dense market before expanding | Facebook launched at a single campus first; food-delivery apps still launch suburb by suburb |

</div>

## 11.5 Multi-homing and why some markets tip

::: definition
**Single-homing** is a user sticking to one platform; **multi-homing** is a user relying on rival platforms at once — a hotel listed on both Booking.com and Expedia is multi-homing. The easier it is to multi-home, the harder it is for any one platform to become a monopoly; the higher the cost of multi-homing, the more a market tends to **tip** toward a single winner.
:::

Voice assistants — Alexa, Siri, Google Assistant — illustrate the boundary case directly: whether the market tips toward one dominant winner or several coexisting platforms depends heavily on how easily a user can actually switch between them.

## 11.6 Three kinds of platforms

::: definition
Following Cusumano, Gawer and Yoffie's classification, a **transaction platform** lets people find and transact with each other (revenue from commission, listing fees or subscription; governance focused on trust, ratings and fraud prevention — e.g. eBay, Airbnb, Uber, Stripe). An **innovation platform** gives third parties a technology base to build on (revenue from licensing, revenue share, or cloud/hardware sales; governance focused on developer relations, API stability and IP protection — e.g. Windows, Android, AWS, the Salesforce Platform). A **hybrid platform** does both at once — Apple's iOS lets developers build apps (innovation) while the App Store sells and distributes them (transaction); Amazon's Marketplace is a transaction platform while AWS beneath it is an innovation platform.
:::

## 11.7 Four decisions every platform has to make

::: definition
Building a platform requires four sequential decisions: **(1) choose your sides** — which groups will you connect?; **(2) solve chicken-and-egg** — which side do you seed first, and how?; **(3) design the business model** — who pays, and how much, on each side?; and **(4) set the governance rules** — how open is the platform, and who shares in the value it creates?
:::

## 11.8 Governance through boundary resources

::: definition
**Boundary resources** — APIs, SDKs and review processes — are how a platform owner governs outsiders building on the platform. Every boundary resource balances two opposing needs: **resourcing** (enabling developers, attracting them with real capability) and **securing** (controlling and protecting the platform through review and restriction).
:::

Apple's App Store does both jobs simultaneously: its review process gives developers access to a huge market (resourcing) while reviewing every submitted app and taking a commission on sales (securing). Governance and architecture **co-evolve** — opening up platform rules without redesigning the underlying system to support that openness safely creates real risk, not just a policy gap.

## 11.9 Case study — Amazon: from bookstore to hybrid platform

::: example Worked Example — Amazon's flywheel
Amazon's **Marketplace** is a transaction platform, opened to third-party sellers to fill selection gaps without Amazon carrying the inventory risk itself. **AWS** is an innovation platform that started as Amazon's own internal infrastructure, then was sold externally — eventually even to Amazon's own retail competitors. The resulting flywheel: lower prices and greater selection attract more traffic, which attracts more third-party sellers, which lowers Amazon's costs further, which supports lower prices again — each turn of the loop reinforcing the next.
:::

The SISP takeaway is specific: internal infrastructure can become a second platform business in its own right. Deciding who gets admitted to use that infrastructure — including a direct competitor — is a **governance call**, not merely an operational one.

## 11.10 Case study — GE Predix: when a platform strategy fails

GE launched Predix in 2014, explicitly aiming to become "the Android of industry" — an innovation platform for industrial equipment data across aviation, healthcare, and oil and gas. It was quietly retired around 2022, after GE had spent roughly $4 billion over six years.

::: warning
Three specific failures explain the outcome. **Scope overreach:** Predix tried to serve too many sides at once — aviation, healthcare and oil and gas all need fundamentally different things, and one platform could not go deep enough in any single vertical. **Infrastructure isolation:** GE built its own data centres rather than using established cloud infrastructure such as AWS or Azure, putting itself in direct competition with far larger, more specialised cloud providers instead of building on top of them. **Weak developer ecosystem:** Predix was not developer-friendly, and a platform that outsiders cannot easily build on is, functionally, just expensive custom software wearing a platform's name.
:::

Most platform teaching leans on winners; Predix is the counter-example worth remembering specifically because its failures map directly onto the four decisions in Section 11.7 — GE chose too many sides at once, never properly solved chicken-and-egg for any single vertical, and set governance and infrastructure choices that actively discouraged the developer ecosystem a genuine platform strategy depends on.

## 11.11 Does platform strategy actually pay off?

A study of 43 public platform companies found they generated the same revenue as comparable non-platform firms with roughly half the staff, twice the profit, and twice the growth. A separate study of 959 unicorns found a real valuation premium for platform business models, though the premium varies substantially by region — roughly +129% in North America, +68% in Europe, and +39% in Asia-Pacific in that one study, at that one point in time.

::: tip
Treat these figures as evidence of a real, measurable pattern — not as proof that adopting a platform model guarantees these outcomes. Section 11.10's GE Predix case is the reminder that the same strategic category produces both the most efficient business models on record and multi-billion-dollar failures.
:::

## 11.12 Where platform strategy goes wrong

Six recurring failure modes, beyond the specific Predix case: **mispricing** (subsidising the wrong side means liquidity never arrives); **cold-start failure** (most platform launches never actually solve chicken-and-egg); **scope overreach** (the Predix pattern — too many verticals at once); **trust collapse** (weak governance can destroy accumulated platform value quickly); **dependence** (once one side relies on the platform, the owner can unilaterally change the rules on them); and **regulation** (antitrust scrutiny grows in direct proportion to platform dominance).

## 11.13 Key concepts and terminology

<div class="key-concepts">

| Term | Definition |
|---|---|
| Platform business | A business connecting two or more groups via owned rules and infrastructure, without necessarily owning what is exchanged |
| Network effect | A platform becoming more valuable as more people use it — cross-side, same-side, positive, negative, or data-driven |
| Chicken-and-egg problem | Neither side of a two-sided market wants to join first; solved by subsidy, single-player mode, seeded supply, piggybacking, or micro-market targeting |
| Multi-homing | Using more than one rival platform at once, rather than sticking to a single one |
| Boundary resources | APIs, SDKs and review processes through which a platform governs outside developers |
| Transaction / innovation / hybrid platform | Cusumano, Gawer and Yoffie's classification of what a platform actually does for its participants |

</div>

## 11.14 Summary

::: summary End-of-topic summary
- Platforms orchestrate value across groups they do not fully own or employ, unlike pipeline or product businesses that own their whole value chain.
- Four types of network effect exist — cross-side, same-side, positive and negative, plus data network effects — and negative effects must be actively managed, not just assumed away.
- The chicken-and-egg problem is solved through differentiated tactics: subsidy, single-player mode, seeded supply, piggybacking an existing network, or targeting a micro-market first.
- Platforms are classified as transaction, innovation, or hybrid; building one requires choosing sides, solving chicken-and-egg, designing the business model, and setting governance rules — with boundary resources balancing enabling developers against protecting the platform.
- Amazon's Marketplace/AWS pairing shows a working flywheel and the governance implications of internal infrastructure becoming external platform business; GE Predix's $4 billion failure shows scope overreach, infrastructure isolation and a weak developer ecosystem defeating an otherwise well-resourced platform strategy.
:::

## Practice Questions

1. A food-delivery app notices that in one dense city, too many drivers are competing for too few orders, and driver earnings are falling even as rider wait times stay short. Which type of network effect is this, and why is more supply not automatically good here?
2. A new B2B software marketplace has zero sellers and zero buyers at launch. Recommend one chicken-and-egg tactic from Section 11.4, and explain specifically why it fits a B2B (rather than consumer) context.
3. Using the four decisions in Section 11.7, diagnose which decision GE Predix got most visibly wrong, and connect that decision directly to one of the three failures described in Section 11.10.

## Answer Key

1. This is a **same-side negative** network effect: growth on the driver side (more drivers) is making the experience *worse* for other drivers (falling earnings), even though it may still be neutral or positive for riders (short wait times). More supply is not automatically good here because the same-side effect saturates — beyond a certain density, additional drivers compete for a fixed pool of orders rather than adding new value, which is exactly the "watch out" the chapter raises about network effects not being uniformly positive.
2. **Seed your own supply** fits well in a B2B context: the marketplace operator could list a curated initial set of vetted suppliers or offerings itself (or via early exclusive partnerships) before opening broadly, giving early business buyers something real to transact against immediately. This suits B2B specifically because business buyers are typically more risk-averse and reputation-sensitive than consumers — a "single-player mode" browsing experience (useful with zero other participants) is less persuasive to a business buyer who needs to see credible, vetted counterparties before committing budget, whereas seeded, verifiable supply directly addresses that trust requirement.
3. GE Predix most visibly failed at **decision 1, "choose your sides"** — by attempting to serve aviation, healthcare, and oil and gas simultaneously rather than choosing a narrower initial scope. This connects directly to the **scope overreach** failure in Section 11.10: because Predix never committed to a smaller set of sides first, it could not go deep enough in any single vertical to attract a genuine developer ecosystem in that vertical, which in turn compounded into the "not developer-friendly" failure — a platform trying to be everything to every industry ends up being sufficiently useful to none of them.
