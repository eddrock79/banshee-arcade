# The Ghost of Edinburgh: Auld Reekie's Dark Secrets

**Playable prototype / Chapter One**, created for Haunted Pubs and designed for a 15–20-minute Dizzy-inspired Edinburgh adventure. This is a shorter, self-contained first chapter, not the full proposed game.

## v2 — little ghost character upgrade

- Rebuilt the hero as a more expressive cartoon character: crooked Edinburgh cap, Black Rose badge, purple scarf, rosy cheeks, gloves and animated wee red boots.
- New running, jumping, idle breathing, blinking, cheeky grins, sleepy/squinting eyes, hiccups, and comic (non-blocking) tumbles with dust and stars.
- Animated character portrait by the wobble meter, including on phones. Tap it for an occasional cheeky remark.
- Celebratory reaction after a water break and Fire Ghost reacting to falls.
- The puzzle chain, saved games and local scores remain compatible with the original prototype.

## What is implemented

- 8 hand-drawn, side-on, interconnected rooms: Black Rose Cellar, Black Rose Tavern, Cowgate, Banshee Cinema, Banshee Passage, Deacon Brodie's Workshop, South Bridge Vaults and Stone Circle.
- Animated playable ghost, jumping, walking, wobbling, occasional tumbles, mobile touch controls.
- Find water to help with thirst; the in-game dialogue explicitly says water does **not** sober anyone up — only time does.
- Meet the bartender, Little Banshee Ghost, and rescue Fire Ghost, who follows you and lights the cinema projector.
- Inventory, contextual inspection, item-use puzzles, rotating runes and a complete ending.
- 7 optional historical / folklore discoveries, with sources, in the Edinburgh Book of the Dead.
- Autosave in local browser storage and scoreboards for Today and All Time **on the same browser/device only**.
- No login, subscriptions, external game libraries or build tools required. Fonts fall back to installed system fonts when offline.

## Play it

Open `index.html` in a modern browser. For consistent results, use a local web server during development, or upload to GitHub Pages. Mobile devices can play from GitHub Pages after publishing.

| Action | Keyboard | Mobile |
| --- | --- | --- |
| Move | Left/Right or A/D | Left/Right |
| Jump | Space, Up or W | JUMP |
| Examine/pick up/talk | E or Enter | LOOK / TALK |
| Use chosen inventory object | U or Q | USE |
| Select pocket | 1–3 or click the slot | Tap the pocket |
| Hint | H | Hint button |
| History journal | History button | History button |

Walk into the left/right edge to change areas. At the Cowgate, **LOOK / TALK** at Brodie's door to enter his workshop.

## Intended puzzle chain (SPOILERS)

1. Black Rose cellar: collect an **iron crank**, drink water.
2. Banshee Cinema: collect a **wax impression**.
3. Cowgate: enter **Brodie's workshop**; select the wax and **USE** the key-cutting bench to create a brass key. You need reasonably steady hands.
4. Banshee Passage: use the **brass key** on the iron gate.
5. South Bridge Vaults: use the **iron crank** on the broken sluice to drain the pool, then speak to **Fire Ghost**.
6. Return to the Banshee cinema, USE the projector with Fire Ghost to reveal **KEY → FLAME → CROWN**.
7. Return to the Stone Circle. LOOK / TALK at each rune to rotate it to the correct symbol; reach the high platform and interact with the bell.

## Add it to the current `banshee-arcade` repository safely

**No existing arcade files are replaced.** Copy this whole `ghost-of-edinburgh/` folder into the **root** of `eddrock79/banshee-arcade`, leaving the original `index.html` exactly as it is.

Once GitHub Pages deploys from the branch currently configured for your repository, the new game should be available at:

`https://eddrock79.github.io/banshee-arcade/ghost-of-edinburgh/`

Add a link to the *existing* arcade menu separately when you're happy with the prototype; suggested HTML:

```html
<a href="./ghost-of-edinburgh/">Play The Ghost of Edinburgh</a>
```

If GitHub Pages is publishing from `/docs` rather than repository root, copy the new folder inside `/docs` instead.

## Scores and sharing — important

The current Today / All Time scoreboards use `localStorage`: they are real for that browser, but **not shared across devices** and may disappear if browser data is cleared or private browsing ends. The next stage needs a Cloudflare Worker + D1 database (or another score API), server-side score validation and moderation/rate limiting. Do not advertise these early prototype scores as venue-wide rankings.

The date rollover uses `Europe/London`, including British Summer Time / GMT transitions. Scoring rewards completion, historical secrets and limited hints, with a time bonus.

## Historical approach

The game distinguishes established history from legends and game fiction. The historical journal offers further-reading links, including sources from National Museums Scotland, a City of Edinburgh Council report, Historic UK, and [Auld Reekie Tours](https://www.auldreekietours.com/). Auld Reekie Tours is acknowledged as an **inspiration**, not a sponsor or partner. No Auld Reekie tour scripts, photographs or branding are used.

## Before public launch

Have someone play-test puzzles and mobile controls, proofread all historical details, decide whether the public should have access to the optional hints, deploy the shared high-score backend, add your final pixel-art and character designs, and review public-facing text for age suitability, licensing and responsible drinking.
