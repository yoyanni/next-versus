# Data and seeding

## The fighter shape

[`shared/types.ts`](../shared/types.ts) is the source of truth. Roughly:

- **Identity:** `_id` (a number), `firstName`, `nickname`, `lastName`, `weightClass`, `rank`
- **`basic`:** `level` plus `martialArt`, `stance`, `reach`
- **`standUp`, `grappling`, `health`:** each is `{ level, skills: { … } }`
- **`perks`:** `{ name, description, type }[]`
- **`moves`:** arrays of `{ name, level }` for punches, kicks, clinch, takedowns, submissions and combos, plus a nested `ground` object (getups, transitions, reversals, sweeps, strikes)

### Changing the shape

When you change the shape, update all four of these together:

1. `shared/types.ts`
2. `server/src/models/fighter.model.ts` (the Mongoose schema, typed against `Fighter`)
3. `FighterForm` in `client/src/types/component.ts`
4. `client/src/mapper/createFighterForm.ts` (Fighter → form defaults)

Then update `client/src/config/formConfig.ts` if the new field needs a form input, and `client/src/standard.ts` if it has fixed options.

## Static game data

[`client/src/standard.ts`](../client/src/standard.ts) holds the game's constants: weight classes, perks with their descriptions, stat and move names, and level and rank options. It also maps display names to property names (`{ name: "Punch Speed", propName: "punchSpeed" }`). The UI and the form options are built from it.

## Seeding

- The seed data is [`server/seed/fighters.json`](../server/seed/fighters.json): 390 fighters with `_id` 1 to 390.
- **Automatic:** at startup, `seedFighters()` (`server/src/seed.ts`) seeds the collection if it's empty. That's how a freshly recreated VPS gets its data.
- **Manual reset:** `npm run seed --workspace=server` wipes the collection and reseeds it. Your own edits are lost.
- The file is read at runtime and inserted in batches of 50. See [ADR 0002](decisions/0002-seed-at-runtime-in-batches.md) for why.

### Default fighters on the home page

`defaultFighters` in `client/src/pages/index.tsx` hardcodes a red and a blue fighter ID for each weight class. **Those IDs must exist**, or the home page shows an error. If you regenerate the seed file or delete one of those fighters, update the list.
