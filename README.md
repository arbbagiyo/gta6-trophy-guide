[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/arbbagiyo/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/arbbagiyo/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

# Leonida Trophy Guide — GTA VI

Built for the make.fun bounty [Build the best GTA 6 trophy guide](https://make.fun/bounty/gta6-trophy-guide-01).

An offline web app that is the guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI:

- **Tracker** — every trophy with its official name, description and grade; a checklist saved in the browser (localStorage), with export to a file and import back.
- **Filters** — by kind (story, missable, collectibles, activities, online), by grade, by earned state, plus text search.
- **Spoiler setting** — hides the names, descriptions and guides of story trophies until they are earned.
- **Roadmap to the platinum** — three steps (story 60–80h, the 100% checklist ~100h, cleanup 10–20h), the one possibly missable trophy flagged, and the 100% checklist in numbers.
- **A guide to each of the 55 trophies, in our own words, with its sources named** — PowerPyx, KeenGamer, Push Square, GTABase, vi.ki and the official list as Exophase and PSNProfiles carry it. No guide text is copied from any of them.

## Run it

```bash
node serve.ts
# open http://localhost:8080
```

Everything the app loads lives under `app/`; it makes no network requests. `main.ts` copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json`.
