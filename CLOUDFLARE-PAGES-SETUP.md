# ABG Elite Skills Deployment Setup

This site is a plain static website, so it is a good fit for Cloudflare Pages.

## Recommended Setup

- Host the code in GitHub
- Connect the GitHub repo to Cloudflare Pages
- Use `main` as the production branch
- Keep the default free `*.pages.dev` URL until the site is confirmed working
- Then attach the Wix-owned domain

## What Updates Automatically

Once Cloudflare Pages is connected to the GitHub repo:

- Every push to `main` triggers a new production deploy
- Optional feature branches can get preview deploy URLs

## Cloudflare Pages Build Settings

Use these settings when creating the Pages project:

- Framework preset: `None`
- Build command: leave blank
- Build output directory: `.`
- Root directory: `/`

This project does not need a build step.

## GitHub Setup

1. Create a new GitHub repository.
2. In this project folder, connect it to that repo:

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git add .
git commit -m "Initial site import"
git push -u origin main
```

If the repo already exists, use its URL for `origin`.

## Cloudflare Pages Setup

1. Log in to Cloudflare.
2. Go to `Workers & Pages`.
3. Select `Create application` > `Pages` > `Connect to Git`.
4. Connect your GitHub account if prompted.
5. Choose the ABG repo.
6. Use the build settings above.
7. Deploy.

After the first deploy, Cloudflare will give you a `*.pages.dev` URL.

## Domain Setup With Wix

There are two different paths depending on what URL you want:

### Option 1: Use `www.abgeliteskills.com`

This is the easiest path if you want to keep Wix as DNS.

In Cloudflare Pages:

1. Open the Pages project.
2. Go to `Custom domains`.
3. Add `www.abgeliteskills.com`.

In Wix DNS:

1. Add a `CNAME` record for `www`.
2. Point it to your Cloudflare Pages hostname:

```text
YOUR-PROJECT.pages.dev
```

### Option 2: Use the apex domain `abgeliteskills.com`

For a Pages project on the free plan, Cloudflare requires the apex domain to be on a Cloudflare zone.

That means:

1. Add `abgeliteskills.com` to Cloudflare.
2. Change the domain nameservers at Wix to the Cloudflare nameservers.
3. Then add `abgeliteskills.com` as a custom domain in Pages.

If you want both:

- `abgeliteskills.com`
- `www.abgeliteskills.com`

the cleanest setup is usually moving DNS to Cloudflare.

## Best Recommendation For ABG

If you want the fastest launch with the fewest DNS changes:

- Launch first on `YOUR-PROJECT.pages.dev`
- Then connect `www.abgeliteskills.com` from Wix using a CNAME

If you want the cleanest final setup:

- Move DNS to Cloudflare
- Use both apex and `www`

## Current Site Notes

- The registration form posts to a Google Apps Script endpoint from `register.js`
- Static hosting will not affect that endpoint as long as the script remains active
- `robots.txt` and `sitemap.xml` already point at `https://abgeliteskills.com`

## Official References

- Cloudflare Pages custom domains:
  https://developers.cloudflare.com/pages/configuration/custom-domains/
- Cloudflare Pages configuration:
  https://developers.cloudflare.com/pages/configuration/
- Cloudflare DNS full setup:
  https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/

