# Cross-Project Integration Notes

Date: 2026-03-29

## Purpose

These notes capture how the newly cloned Forgejo repositories should relate to
`evo-edu.org` and to the broader hosting and study-tool roadmap.

Repositories:

- `Didactopus`
- `Operational-Premise-Taxonomy`
- `VHostLoom`

## Core Idea

The primary near-term value is direct access to useful resources in these
projects from `evo-edu.org` and related public work. A second-layer goal is to
identify whether each project has a realistic path to a useful web-facing
component.

## Project Assessments

### Didactopus

This is the strongest immediate integration target.

Why:

- It already aligns with `evo-edu.org` pathway packs, guided study, review,
  concept mapping, and grounded learner support.
- It already has an active codebase and an existing `webui/` scaffold.
- Its roadmap already prioritizes learner-session and learner-workbench work.

Best near-term use:

- Link `evo-edu.org` pathways and packs to Didactopus study flows.
- Use Didactopus as the future guided-study layer behind:
  - pack prompts
  - reflection workflows
  - concept sequencing
  - source-grounded learner sessions

Likely web-facing component:

- a learner workbench that consumes evo-edu pathway packs and presents:
  - current concept
  - why it matters
  - supporting sources
  - practice or reflection prompt
  - next recommended step

### Operational Premise Taxonomy

This is better treated first as a linked advanced reference resource than as an
immediate public component.

Why:

- It is conceptually strong, but currently more paper/framework-oriented than
  user-interface-oriented.
- It can support advanced AI literacy, taxonomy, and evaluation topics without
  needing to become a major front-page component immediately.

Best near-term use:

- link it from advanced study materials
- use it in Didactopus-oriented or AI-literacy contexts
- treat it as a reference and classification framework

Likely web-facing component:

- an OPT classifier/explorer UI that shows:
  - example systems
  - OPT code classifications
  - rationale and audit logs
  - comparisons among AI mechanism families

### VHostLoom

This is infrastructure-facing, not learner-facing.

Why:

- It aligns with hosting-framework work, Traefik/Authelia organization, and
  modular site deployment rather than with direct instructional delivery.
- It is valuable, but not as an `evo-edu.org` student-facing component.

Best near-term use:

- reuse patterns for hosting and deployment
- keep it available as a technical support framework
- link to it from developer/operator documentation, not from learner pathways

Likely web-facing component:

- an operator-facing workbench for:
  - vhost planning
  - auth/proxy decisions
  - VPN-only service planning
  - generated stack layouts

## Recommended Direction

Priority order:

1. `Didactopus`
2. `Operational-Premise-Taxonomy`
3. `VHostLoom`

Near-term action:

- add direct resource links from relevant `evo-edu.org` pages into
  `Didactopus` and selected supporting references
- keep `OPT` and `VHostLoom` as broader-roadmap integrations, not immediate
  front-line public components

## Roadmap Implication

The broad roadmap should now explicitly include:

- direct cross-project resource linking
- a Didactopus learner workbench path
- a later OPT web explorer/classifier path
- a later VHostLoom operator workbench path
