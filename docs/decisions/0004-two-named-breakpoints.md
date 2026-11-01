# 0004. Two named breakpoints, `tablet` and `desktop`, in place of Tailwind's defaults

- Status: Accepted
- Date: 2026-11-01

## Context

- The client was built for phones only. Every page was a single full-width column, so on a tablet or desktop the stat cards, accordions and form stretched across the whole screen.
- Tailwind's defaults are five breakpoints (`sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536). We only want three layouts for now: phone, tablet and desktop.
- The compare page puts a stat name between two 100px value columns. The longest names, such as "Submission Defence", need about 150px, so a card needs about 350px. Two card columns have that from 768px up.

## Decision

- `theme.screens` is replaced, not extended, with `tablet: 768px` and `desktop: 1280px`. Unprefixed classes stay the phone design.
- Desktop starts at 1280px, not 1024, so iPads in landscape (1024 to 1194px) get the tablet layout.
- The compare page keeps 2 card columns on desktop. It doesn't add a third; its 2 columns get wider, up to `max-w-7xl`.
- `future.hoverOnlyWhenSupported` is on, so the hover styles added for mouse users don't stick after a tap on a touch screen.

## Consequences

- `sm:`, `md:`, `lg:`, `xl:`, `2xl:` and the `max-w-screen-*` utilities don't exist. Copied Tailwind snippets that use them do nothing until they're renamed.
- A third breakpoint (for example a wide-desktop layout) means adding a new name to `theme.screens`.
- Screens between 1024 and 1279px wide, such as small laptops, get the tablet layout.
