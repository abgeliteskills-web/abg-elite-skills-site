# Design System — ABG Elite Skills

## Aesthetic Direction
Dark athletic editorial: a hockey program that feels like it belongs in a locker room at the top level — serious, confident, and built for parents and players who know the difference between real development and a glorified skate-around.

## Typography
- **Display/Hero**: Barlow Condensed, weight 900, tight line-height (0.88–0.92), uppercase
- **Headings (h2/h3)**: Barlow Condensed, weight 700–800, uppercase
- **Body**: Manrope, weight 400, 16px base, 1.65 line-height
- **Labels/Eyebrows**: Barlow Condensed, uppercase, tracked — eyebrows only, not everywhere
- **Buttons**: Barlow Condensed, weight 700, tracked

## Color Palette
| Name           | Value                  | Role                             |
|----------------|------------------------|----------------------------------|
| --bg           | #091019                | Page background                  |
| --bg-soft      | #111d2a                | Slightly lifted background       |
| --panel        | rgba(11,22,34,0.82)    | Card/panel surface               |
| --text         | #f4f7fb                | Primary text                     |
| --muted        | #b8c5d6                | Secondary/body text              |
| --muted-strong | #d5deea                | Emphasized muted text            |
| --accent       | #ff2e34                | CTAs, highlights, urgency        |
| --ice          | #7ac9ff                | Trust accents, tags, badges      |

## Layout
- Max content width: 1180px
- Mobile shell: calc(100% - 28px), centered
- Desktop: two-column grids for hero and content panels
- Spacing scale: 14/18/22/24/34/44/52px

## What's Banned
- Uppercase letter-spacing on body text or long-form copy
- All-caps on every element — reserve for eyebrows and buttons
- Identical card styles stacked without visual hierarchy variation
- Hero headline that wraps into more than 3 lines on mobile
- League logo layout that orphans the 4th badge on its own row

## What's Kept
- The dark navy/red/ice color system — it's working
- Barlow Condensed for display — it has real personality
- The sticky frosted-glass header — good UX
- The red CTA buttons with shadow — high contrast and clear
- The panel cards with border + backdrop-filter — premium feel
- The left red border accent on feature cards — nice detail
- The trust bar with the red-to-ice gradient top line

## Changes Made (CSS only)
1. **Hero headline mobile fix** — removed 11ch max-width cap that forced 7-line wrapping; balanced font-size to clamp(2.1rem, 9.5vw, 3.4rem) on small screens
2. **League badges layout** — set to 2x2 grid on mobile so the 4th badge isn't orphaned
3. **Explicit heading weights** — h1/h2 locked to 700, h3 to 600 (no more browser-default fallback)
4. **Eyebrow line decoration** — 18px red accent line prefix on section-level eyebrows (section-heading, content-panel, final-cta, home-featured-heading, page-hero-copy contexts)
5. **Trust bar stat scale** — `strong` bumped from 1.34rem to 2rem for stat-display feel; padding adjusted to 28px
6. **Feature card left border** — added `::before` red-to-ice gradient 3px border on all `.feature-card` elements (was documented in "What's Kept" but missing from CSS)
7. **Split heading size** — h2 inside `.split-heading` scaled up to clamp(2.2rem, 4.8vw, 4rem)
8. **Coaches section headline** — `.coaches-home-section .content-panel h2` sized to clamp(2.2rem, 4.2vw, 3.8rem)
9. **Final CTA dramatic scale** — h2 bumped to clamp(2.6rem, 5.4vw, 5rem); added radial red accent to background
10. **Check list arrows** — replaced default CSS bullets with `→` in accent red using `::before`
11. **Camp card flagship highlight** — 2nd camp card (July flagship) gets red border/tint; 3rd gets ice border
12. **Interior page hero h1** — `.page-hero-copy h1` scaled to clamp(3rem, 6.5vw, 5.6rem)
13. **About mission panel headings** — `.layout-two .content-panel h2` sized to clamp(2rem, 4vw, 3.4rem)
14. **Section breathing room** — section margin-bottom increased from 46px to 52px

## Page-Specific Overrides

### Camps Page
- Hero copy panel: ice blue gradient wash instead of red (informational context, not urgency)
- Hero image: `object-position: center 14%` to show Jordan Biro's face
- 4th/5th camp cards: ice border + ice tint background (specialty camps vs. main 3)

### Coaches Page
- `.coach-highlights li::before`: `→` in `var(--ice)`, Barlow Condensed 700
- `.coach-pathway-points li::before`: same arrow, slightly smaller
- `.coach-pathway-body > p`: ice eyebrow label — uppercase Barlow Condensed, tracked

### About Page
- Hero copy panel: subtle ice gradient wash (trust/story context)
- `.panel-dark h2` ("The ABG Mission"): `color: var(--ice)` — premium contrast against red-gradient panel
- Right layout-two panel ("Why It Matters"): ice gradient wash + ice border-color
