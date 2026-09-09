# RehabStatus — live wildlife rehab capacity board

A calm, mobile-first web app with two flows: a public triage flow for someone who just found an animal, and a one-tap status dashboard for rehab centers. Statuses update live across devices and tabs.

## Backend

Use Lovable Cloud (built-in database + realtime) so a toggle on one phone instantly changes what a caller sees on another. This is the core demo moment, so it needs a real shared source of truth rather than browser-only storage.

Two tables, seeded in the migration itself:
- `centers` — name, phone, latitude, longitude (spread across Greater Pittsburgh)
- `center_species_status` — one row per center per species category (`birds`, `mammals_small`, `mammals_medium`, `fawns`, `reptiles`) with status `open | full | by_appointment` and `updated_at`

9 fictional centers seeded with a realistic mix of statuses (some full for raccoons so the empty state can be demoed). Public read access for everyone; status updates allowed without login (hackathon scope, no auth). Realtime enabled on the status table.

## Screen 1 — Public triage (`/`)

Landing: short reassuring intro, a live counter "X centers currently open near you", and the line "Not a replacement for your state wildlife hotline — a live view of who has room right now."

Step 1 — "What kind of animal did you find?" Five large icon buttons for the species categories.

Step 2 — "What's the situation?" Injured / Appears healthy, just found / Orphaned baby / Hit by car. Choosing fawn or a fledgling-type bird case shows a soft reassurance card first ("This may be perfectly normal — here's how to tell") with a clear way to continue anyway.

Step 3 — Results: a Leaflet map (OpenStreetMap tiles, loaded only in the browser) with pins, and a list below sorted by distance from a fixed Pittsburgh reference point. Only centers whose status for that species is open or by-appointment appear; full ones are hidden entirely.

Each card: name, distance in miles, tap-to-call phone link, which species they're currently open for, status chip, and "updated 4 min ago" ticking live.

Empty state: a calm, intentional panel — "No one nearby currently has capacity for raccoons. Statuses update constantly — check back soon, or call the PA Game Commission for guidance," with the hotline as a tap-to-call link. Styled as a designed moment, not an error.

## Screen 2 — Rehabber dashboard (`/rehabber`)

Pick your center from a dropdown (no signup). Then a stacked list of the five species categories, each with a big three-state segmented toggle: Open / Full / By appointment. One tap commits — no confirmation, optimistic update with a small satisfying press animation and color shift. Each row shows its own "updated X ago", ticking.

## Live updates

Results and dashboard both subscribe to realtime changes on the status table, with a light 5-second refetch as a safety net so the demo never stalls. Toggling on one device visibly changes the caller's list within a second, no reload.

## Design

Warm and trustworthy: soft sage/moss greens, warm off-white paper background, clay accents, generous whitespace, large readable type. Status colors fixed and consistent everywhere — green open, red full, amber by appointment. Everything laid out mobile-first, comfortable tap targets, gentle transitions.

## Out of scope

No auth, no SMS, no payments, no admin or onboarding, no real geocoding.

## Technical notes

- TanStack Start routes: `/` (triage, step state in URL search params), `/rehabber`
- Leaflet loaded client-side only behind a hydration gate to avoid SSR issues
- Distance via haversine from a fixed downtown Pittsburgh origin (no geolocation prompt; keeps the demo deterministic)
- TanStack Query for reads, mutation + realtime invalidation for writes
- Seed rows written as literal INSERTs in the migration
