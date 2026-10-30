# Cyber Suraksha 2026 · KITS CSI - Student Chapter

A lightweight, static invitation website for **KITS CSI - Student Chapter** at KKR & KSR Institute of Technology and Sciences. The project uses semantic HTML, shared CSS, and vanilla JavaScript; it does not need a build step, backend, database, or API key.

## Run locally

Open the project folder in VS Code and use Live Server, or run a local static server from the project root:

```powershell
py -m http.server 8000
```

Then open `http://localhost:8000/`. Do not test by opening the files through `file://`; the local HTTP server more closely matches static hosting.

## Pages and files

- `index.html` — event home page, program overview, promotional video, quick facts, invitation directory, resource persons, and event details.
- `invitations/chairman.html`, `invitations/secretary.html`, `invitations/principal.html`, `invitations/director.html` — directly accessible personalized invitations.
- `css/style.css` — shared responsive styles, glass effects, accessibility, and print layout.
- `js/config.js` — shared event timing, separate event records, and invitee/speaker data.
- `js/main.js` — home navigation, directory cards, Google Calendar links, image fallbacks, and subtle interactions.
- `js/invitations.js` — print, sharing, and Google Calendar actions.
- `promo/cyber-suraksha-promo.mp4` — web-ready promotional video embedded on the home page with native playback controls, a boosted quiet opening, fast-start MP4 metadata, and AAC-LC stereo audio at 48 kHz.
- `promo/WhatsApp Video 2026-10-29 at 21.24.19.mp4` — original promotional-video source, preserved unchanged.
- `.vercelignore` — excludes only the archived HTML originals and unused source video from Vercel deployment; the active site, legacy URL folders, invitations, and playable video remain deployable.
- `cyber-suraksha-content.json` — structured content/data reference for future development.
- `../cyber-suraksha-invitatio-originals/` — pre-change copies of the original `index.html` and `code.html`, kept outside the deployable site root.

The former `chairman/`, `secretary/`, `principal/`, and `director/` URLs redirect to their new invitation pages. `code.html` redirects to the home page.

## Events and Google Calendar

The website lists two separate events, held together on **Saturday, 31 October 2026, 12:30 PM–3:00 PM (Asia/Kolkata)**:

1. **Cyber Suraksha — Cyber Security Awareness Program**
2. **KITS-CSI Academic Calendar Launch**, described by the organizer as happening along with the awareness program.

Each event has a distinct Google Calendar template link. It opens a prefilled event in a new tab; visitors review and save it themselves. The links do not claim to add events automatically.

The only academic-calendar file found on the Desktop was a two-page printout of an invitation, not an academic calendar. The academic calendar launch is listed because the organizer confirmed it will occur alongside the awareness program; the available information provides no separate time or room. Its calendar link therefore uses the shared program date, time, and venue. Confirm if the launch has a distinct sub-slot or venue before publishing.

## Images and logos

The official KITS and CSI logo assets are present under `images/` and are displayed without cropping or distortion on the home page and invitation letterheads:

- `images/kits-logo.png`
- `images/csi-logo.png`

The four original invitee portraits are restored in the project root and used by the home directory and their personal invitations:

- `chairman.jpg` — Dr. K. Subba Rao
- `secretary.jpg` — Sri Koyi Sekhar
- `principalnew.jpg` — Dr. P. Babu
- `Harisir_1578295527.jpg` — Dr. K. Haribabu garu

The original HTML also referenced externally hosted portraits for Dr. D. V. Ramana and Mr. Sudhakar. Those source URLs are retained in `js/config.js`; both loaded during the local browser check. Their identity/authorization has not been independently verified, and they will show a graceful fallback if unavailable.

## Deployment

Deploy the project folder as a static site to GitHub Pages, Netlify, or another static host. All page, style, script, portrait, video, and invitation links use relative paths, so the project can be hosted at a domain root or under a project subdirectory. Individual invitation files do not depend on client-side routing. Keep both files in `promo/`; the page uses the web-ready copy, while the original is retained as the source.

Use the home page as the publishing entry point. Before publishing, verify the external resource-person portraits and confirm whether the Academic Calendar Launch has a separate time or room.

### Deploy to Vercel

This is a static HTML/CSS/JavaScript site and does not require a build command or install step.

1. Import the GitHub repository into Vercel and set the project root to the repository root (`Invitations`).
2. Select **Other** as the framework preset.
3. Leave the install and build commands empty. Leave the output-directory override unset so Vercel serves the project root; if the dashboard requires an output directory, use `.`.
4. Do not configure clean URLs, trailing-slash changes, or rewrites. Vercel serves the existing paths as deployed, including `/`, `/invitations/chairman.html`, `/invitations/secretary.html`, `/invitations/principal.html`, `/invitations/director.html`, `/chairman/`, `/secretary/`, `/principal/`, `/director/`, and `/code.html`. The legacy invitation folders and `code.html` keep their existing HTML redirects; this deployment adds no path renames. `.vercelignore` excludes only archived source copies, not any current page or legacy route.
5. Deploy. Verify the video at `/promo/cyber-suraksha-promo.mp4` and the four invitation links on the deployed domain.

Alternatively, run `vercel --prod` from the project root using an authenticated Vercel CLI. The generated `.vercel/` directory is ignored by Git. Vercel will assign a deployment hostname; to preserve an existing public domain as well as its paths, add that domain to the Vercel project and update its DNS as directed by Vercel.

## Validation

The project has no package manifest or automated test suite. Basic checks:

- Open the home page and each `invitations/*.html` page through the local server.
- Test navigation at desktop and mobile widths, including keyboard focus and the mobile menu.
- Confirm each portrait appears or its fallback is shown.
- Test print preview, share/copy behavior on a secure hosted origin, and confirm each Google Calendar link contains only its intended event details.
- Check the browser console and network panel for missing assets.
