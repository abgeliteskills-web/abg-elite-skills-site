## ABG Site Update Guide

This site is a simple static website. Most routine updates happen in one place:

- Camps: `/Users/loganach/Desktop/ABG Elite Skills Website- COdex/data.js`
- Coaches: `/Users/loganach/Desktop/ABG Elite Skills Website- COdex/data.js`
- Testimonials: `/Users/loganach/Desktop/ABG Elite Skills Website- COdex/data.js`
- Page copy: `/Users/loganach/Desktop/ABG Elite Skills Website- COdex/index.html`, `/Users/loganach/Desktop/ABG Elite Skills Website- COdex/camps.html`, `/Users/loganach/Desktop/ABG Elite Skills Website- COdex/coaches.html`, `/Users/loganach/Desktop/ABG Elite Skills Website- COdex/about.html`
- Styling: `/Users/loganach/Desktop/ABG Elite Skills Website- COdex/styles.css`
- Behavior: `/Users/loganach/Desktop/ABG Elite Skills Website- COdex/script.js`

### Updating Camps

Edit the `camps` array in `data.js`.

The fields you will use most often:

- `title`: camp name
- `dates`: date text shown on the card
- `ages`: age groups shown in the schedule block
- `schedule`: times shown beside each age group
- `price`: price pill
- `ratio`: quick summary like total ice time
- `registrationUrl`: Google Form link
- `image`: card image
- `featured`: leave `true` if you want the camp shown in the main lineup

Important:

- Keep `ages` and `schedule` the same length
- The first age group matches the first time, the second matches the second, and so on

### Updating Coaches

Edit the `coaches` array in `data.js`.

The fields you will use most often:

- `name`
- `currentTeam`
- `currentLevel`
- `summary`
- `bio`
- `detailedBio`
- `headshot`
- `previewPosition`

Notes:

- `previewPosition` only affects the homepage headshot crop
- `featured: true` keeps the coach on the homepage
- `pathway` controls the image cards on the full coaches page

### Updating Testimonials

Edit the `testimonials` array in `data.js`.

The fields are:

- `quote`
- `name`
- `roleLabel`
- `team`
- `image`
- `featured`

### Updating Page Copy

Use the page files directly:

- `index.html` for homepage copy
- `camps.html` for camps page copy
- `coaches.html` for coaches page copy
- `about.html` for about page copy

### Updating Images

Add or replace local images in:

- `/Users/loganach/Desktop/ABG Elite Skills Website- COdex/assets`

Then update the matching file path in `data.js` or the page HTML.

### Previewing Locally

If you need to preview the site locally, run:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000/index.html
```

### Publishing

Once the site is hosted live, the update flow will usually be:

1. Edit the local files
2. Preview locally
3. Re-upload or redeploy to your host
