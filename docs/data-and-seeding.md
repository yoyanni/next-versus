# Data and seeding

## The fighter shape

[`shared/types.ts`](../shared/types.ts) is the source of truth. Roughly:

- **Identity:** `_id` (a number), `firstName`, `nickname`, `lastName`, `weightClass`, `rank` (a number: `0` is the champion, `1` to `14` are the ranked contenders, `15` is unranked)
- **`basic`:** `level` plus `martialArt`, `stance`, `reach`
- **`standUp`, `grappling`, `health`:** each is `{ level, skills: { … } }`
- **`perks`:** `{ name, description, type }[]`
- **`moves`:** arrays of `{ name, level }` for punches, kicks, clinch, takedowns, submissions and combos, plus a nested `ground` object (getups, transitions, reversals, sweeps, strikes)

Every field is required by the Mongoose schema except `nickname`, which may be empty and defaults to `""` (117 seed fighters have none), and the `name` and `level` of `moves.ground.*` entries. The schema checks this when a fighter is created and when the seed is inserted, not on edit.

### Changing the shape

When you change the shape, update all four of these together:

1. `shared/types.ts`
2. `server/src/models/fighter.model.ts` (the Mongoose schema, typed against `Fighter`)
3. `FighterForm` in `client/src/types/component.ts`
4. `client/src/mapper/createFighterForm.ts` (Fighter → form defaults)

Then update `client/src/config/formConfig.ts` if the new field needs a form input, and `client/src/standard.ts` if it has fixed options.

## Static game data

[`client/src/standard.ts`](../client/src/standard.ts) holds the game's constants: weight classes, perks with their descriptions, stat and move names, and level options. The rank values are `RANK_CHAMP` and `RANK_UNRANKED` in [`shared/limits.ts`](../shared/limits.ts), and `client/src/utils/formatRank.ts` turns a rank into its label ("Champ", "#3", "Unranked"). It also maps display names to property names (`{ name: "Punch Speed", propName: "punchSpeed" }`). The UI and the form options are built from it.

## Seeding

- The seed data is [`server/seed/fighters.json`](../server/seed/fighters.json): 390 fighters with `_id` 1 to 390.
- **Automatic:** at startup, `seedFighters()` (`server/src/seed.ts`) seeds the collection if it's empty. That's how a freshly recreated VPS gets its data.
- **Manual reset:** `npm run seed --workspace=server` wipes the collection and reseeds it. Your own edits are lost.
- Each seed fighter is validated against the schema as it's inserted. An entry with a missing field makes seeding fail, and at startup that stops the server.
- The file is read at runtime and inserted in batches of 50. See [ADR 0002](decisions/0002-seed-at-runtime-in-batches.md) for why.

## Seed and sandbox fighters

- A fighter with `_id` below `SANDBOX_ID_START` (100 000, in [`shared/limits.ts`](../shared/limits.ts)) is a **seed fighter**. It's read-only through the API without the admin token, and the client hides its Edit and Delete buttons.
- A fighter created through the API is a **sandbox fighter**, with an ID from 100 000 up. Anyone can edit or delete it.
- Only the newest 3 sandbox fighters are kept (`SANDBOX_MAX_FIGHTERS` in `fighter.controller.ts`).
- Seed IDs must stay below 100 000.
- Automatic seeding ignores sandbox fighters and doesn't remove them, because it only runs on an empty collection. The manual reset removes them with everything else.
- To change a seed fighter for good, edit `server/seed/fighters.json`. A change made with the admin token is lost when the VPS is rebuilt.

### Default fighters on the home page

The home page hardcodes no fighter IDs. [`client/src/utils/pickCorners.ts`](../client/src/utils/pickCorners.ts) opens each weight class on its two highest-ranked fighters, the champion in the red corner and the number 1 in the blue.

- The pick sorts by `rank`, lowest first, so unranked fighters (`15`) come last. The 14 Generic fighters are unranked.
- Seed fighters sort ahead of sandbox fighters whatever their rank, so a visitor can't claim a corner by ranking a fighter Champ.
- **Each weight class needs a champion and a number 1 in the seed file** to open on them. If one is missing, the class opens on its next ranked fighters, with no error.
- The same rule fills a corner whose selected fighter has been deleted. If a class has fewer than two fighters, the page shows a message in place of the cards and keeps the picker.
