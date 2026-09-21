# Model notes and boundaries

[Return to the illustrated explanation](index.html).

20 September 2026. These are project calculations and source audits, not empirical parameter estimates or externally peer-reviewed findings. The constituent selection and search identities are established mathematics; no claim of first discovery is made.

## A physical foraging model {#foraging}

Let a trip collect usable energy G and incur metabolic cost C. In general, C depends on an integral of metabolic power over the trip, with speed, load and state included. Under the special assumption of a constant effective cost c per unit distance, equal handling costs, equal rewards and comparable risk, the net energy is U = G − cL.

The scene uses home H=(0,0) and resource points A=(3,0), B=(3,4), C=(0,4), D=(6,4). Each resource supplies 10 arbitrary energy units. Candidate A takes H→A→D→B→C→H, length 18; candidate B takes H→B→A→D→C→H, length 24. These are two specified candidates, not asserted optima of the complete route set.

Assume reproductive weights wA = 1 + βUA and wB = 1 + βUB. Both remain positive throughout the displayed control range. For initial A frequency p, proportional parent sampling gives selected frequency

\[
p_S=\frac{pw_A}{pw_A+(1-p)w_B}.
\]

With symmetric type-flipping mutation μ, selected and neutral offspring probabilities are μ+(1−2μ)pS and μ+(1−2μ)p. A finite census N has binomial counts with those probabilities, so these are **expectations**, not necessarily attainable realized fractions in one population. Their expected descendant net-energy difference is

\[
(1-2\mu)\frac{\beta p(1-p)(U_A-U_B)^2}{pw_A+(1-p)w_B}.
\]

This is nonnegative for the stated parameter range. Strict positivity needs both variants, unequal returns, positive reproductive sensitivity and retained transmission. Setting μ=1/2 erases transmission. Zero travel cost or zero reproductive sensitivity also removes the advantage in this equal-reward scene.

At c=1, β=1/4, p=1/2, μ=0, the energies are 22 and 16; weights are 6.5 and 5; expected A frequency is 13/23; expected net-energy gain is 9/23. The standard-library verification covers 459 finite-census comparisons, three adverse regimes, and 24 control-endpoint checks. A longer route can win with more reward, lower risk, or a changed evaluation environment.

The inherited type may represent a policy or learning rule. An individually learned route is not thereby genetically inherited. Bee observations cited in the story concern behavioral endpoints; a social-bee reproductive model would also need colony-level transmission and reproductive output.

## What the earlier formal counters establish {#formal-counters}

**Local environmental family.** Environmental bits E are sampled before the run. A candidate x receives positive local rewards for matching E. Fixed nearest-neighbor interactions can be included when a one-bit interaction change is smaller than the matching reward. Strictly retaining improving one-bit mutations then gives

\[
P(X_t=E)\ge 1-\frac n2 e^{-t/n}.
\]

Uniformly initialized neutral mutation has ever-hit probability at most (t+1)2^(−n). At n=64 and t=414, the selected process succeeds with probability about 0.953808 after 415 evaluations; the neutral ever-hit bound is about 2.25×10⁻¹⁷. This is a local-search/strong-selection idealization with exact feedback, not a finite-census theorem about organismal complexity.

**Permutation example.** On the four two-bit matching landscapes, query 00 and then 11 if its score is zero, otherwise 01. This adaptive policy succeeds with probability 3/4; querying 00 then 01 succeeds with probability 1/2. On all twelve equally weighted permutations of the histogram (0,1,1,2), both succeed with probability 1/2. Both policies make distinct queries.

**Induced measures.** Let Q be a random output distribution and T a fixed target. Markov’s inequality gives Pr(Q(T)≥a)≤E(Q(T))/a. Replacing the numerator by |T|/N requires that mean for T; a uniform barycenter supplies it for every target. Uniform simplex volume additionally gives a singleton tail (1−a)^(N−1). The local environmental model induces a finite-support law with a uniform barycenter but different tails. For n=8, after 36 trials its fixed-target tail at a=.95 is 1/256, while the simplex tail is .05²⁵⁵. The event concerns the drawn output distribution’s target probability. It is not the unconditional success probability of a separately fixed target.

**Finite biological tracking.** A separate finite Wright–Fisher process, with two types, balanced founders, informative reproductive feedback, heritable transmission and environmental persistence above one-half, has an expected selection advantage over matched neutrality at every subsequent finite generation. Positive mutation supplies a stationary lower bound. At N=4, s=1, μ=1/16 and persistence 3/4, the stationary payoff gain is 496015/10375232, about 0.047807606. It models expected reproductive rates, not the elementary cost of realizing them through encounters.

**Elementary resources.** For k IID tests per candidate, each with pass probability r, confirmed discovery with early rejection costs (1−r^k)/[(1−r)r^k] in expectation. Indivisible full-row testing costs k/r^k. Their ratio is k(1−r)/(1−r^k). Both costs remain exponential at fixed r, and unlimited fresh candidates are assumed for the expectation. This changes the resource metric, preserving Ewert–Marks’s equal-call simulation result.

## Why the favorable Theobald note is qualified {#theobald}

For q=(.9,.1) and q′=(.8,.2), the expression Σq(q′−q) equals −.08. This directly contradicts the note’s assertion that it is nonnegative. Marginal entropy increases in this example despite a positive KL divergence. Under q′=qv and E_q(v)=1, the valid identity is

\[
H(q)-H(q')=\operatorname{Cov}_q(v,\ln q)+D_{KL}(q'\Vert q).
\]

The nonnegative KL term does not fix the covariance sign or the sum. This neither refutes active information’s definition nor rules out acquisition of environmental information. It requires us to distinguish marginal entropy, a joint-distribution mutual information, and success relative to a specified baseline.

## Remaining boundaries

None of these calculations establishes the prevalence of the favorable mechanisms in nature, the origin of physical laws, or increasing coordinated complexity within one organism. Those questions need additional models, operational definitions and evidence. Equality of two causal accounts’ observable laws would make their observational statistics identical; that conditional statement is not a finding that all origin accounts are empirically equivalent.

See the [claim graph](graph.json), [dependency analysis](ANALYSIS.md), and [source register](index.html#sources) for attribution, exact inspected passages and qualifications.
