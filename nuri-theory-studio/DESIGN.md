# 누리 이론 연구실 · Design contract

## 0. Research log
Source: AI Theory, 13 original Markdown documents. Academic workspace for early childhood teachers and teacher educators. Embedded references: Notion (selected: warm paper, quiet border, readable document), Claude (shortlisted), Linear (shortlisted). Layer A: taste-skill; mechanism: interaction-skill/tabs and layout-skill. Local Next.js 16.2.10 docs read before implementation. Lazyweb and beui research requests could not reach external network from sandbox shell; no screens from those services claimed. Instead of paid UI mockup drafts, one original learning-material watercolor illustration was generated using the exact user-requested gemini-nano-banana-2.1 model after official documentation and account-catalog verification. Key read in memory from base-folder file; only the illustration is deployed.

## 1. Direction & users
Warm scholarly field notebook: ivory paper, forest olive ink, coral annotations, five domain colors. Distinctive moment: an editorial pencil-and-watercolor tabletop connects five learning-material vignettes; five color-coded cards open the corresponding domain. Audience: teacher planning a lesson; lecturer comparing theory to practice. Content order: orient → choose domain → understand theory → design activity → observe → reflect.

## 2. Tokens
Canvas #f7f8f3; paper #ffffff; sidebar #f0f2eb; ink #25352d; muted #667066; line #e1e6dc; olive #536c44; olive-light #e8efde; warm #f4eee1; coral #ba654c. Domain colors: physical #a6783e, social #b96059, arts #8c70a3, language #4e82a0, nature #5e8757; pair with pale tinted backgrounds. Border 1px. Card shadow 0 4px 20px #25352d05. Radius: 8/12/20/28px. Space scale: 4/8/12/16/20/24/32/40/48/64px.

## 3. Typography
System sans: Arial, Apple SD Gothic Neo, Malgun Gothic, sans-serif. Editorial headlines: Georgia, Noto Serif KR, Batang, serif. Display clamp(30px, 3.2vw, 44px); h2 24px; h3 19px; body 15px/1.75; compact dashboard metadata 9–12px, controls 13px/1.5. Reading text max width 76ch. Korean word-break keep-all; overflow-wrap anywhere for long URLs. No remote font dependency.

## 4. Spatial model
Desktop sticky 244px sidebar with its own overflow only when necessary; document owns main scrolling. Main max 1580px; margins 40px. At 1200px sidebar 210px; secondary panels stack at smaller widths. At 760px navigation moves to top with collapsible domain navigation; long-form content uses one column and overview domain cards use two columns plus a full-width final card. At 375px page margin 18px, inputs full width, cards never overflow. Original reader has bounded independent TOC and document scroll; tables scroll horizontally inside their own region.

## 5. Primitives
NavItem: default/active/hover/focus, aria-current. DomainCard: colored glyph, number, title, explanation, action; one button per card. SectionTabs: horizontal wrapping, selected aria-pressed. PaperPanel: heading, body, optional source action. SourceLink: exact original document and section target. CheckItem: native checkbox, checked/unchecked. FormField: native label, focus/error. Status: live polite. EmptyState: clear next action. Dialog: native dialog modal, labelled, close/Escape, focus return. Original reader: semantic markdown, sanitized links, table overflow. Showcase equivalent: overview contains domain cards, tabs, actions and source references; design lab exercises form and checked states.

## 6. Motion
120ms button press transform; 220ms tab/content reveal opacity + translateY(6px). Hover raises actionable cards 3px. No endless ambient animations. prefers-reduced-motion removes transforms and nonessential transitions.

## 7. Accessibility & evidence
WCAG AA target. Visible focus 3px olive offset 3px, native buttons/selects/checkboxes, labelled controls, headings in order, skip link. Primary touch targets 44px minimum; dense desktop TOC is compact, mobile TOC expands to 44px. No color-only states. No child-identifiable data requested. Local notes and plans explicitly device-only. Markdown source, plan and notes downloads verified as actual files. Scholarly evidence: original claims not treated as independently verified findings; no fabricated effect sizes. The domain mapping is editor synthesis, clearly labelled. 375/768/1280px all main views and native original-reader dialog checked without page overflow; no JavaScript page errors in browser QA.

## 8. Limits & acceptance
No login or cloud records requested. No public paid-generation endpoint. No key in source, browser, deploy payload or environment; illustration generation only if necessary and requested model is verified. Original sources may contain incomplete references, repeated content or factual errors; preserved original reader labels this. Academic summaries correct stage terminology and avoid promoting AI facial inference as valid emotion measurement. Final review: actual desktop/mobile screenshots, domain navigation, source search, note reload, plan download and no-result states.
