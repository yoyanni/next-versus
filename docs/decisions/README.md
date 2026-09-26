# Decision records

These are short notes on choices that aren't obvious from the code. Each one records the context, what was decided, and what it costs. Don't rewrite a record once it's been made. If a decision changes, add a new record and mark the old one as superseded.

| # | Decision | Status |
| --- | --- | --- |
| [0001](0001-numeric-fighter-ids.md) | Numeric fighter IDs instead of ObjectIds | Accepted |
| [0002](0002-seed-at-runtime-in-batches.md) | Seed at startup, from a file read at runtime, in batches | Accepted |

## Template

```markdown
# NNNN. Title

- Status: Proposed | Accepted | Superseded by NNNN
- Date: YYYY-MM-DD

## Context
## Decision
## Consequences
```
