
# Dr. Blackout — Website Setup & Deployment (Beginner-Friendly)

This guide walks you from **zero** to a live site on **Vercel** or **Netlify**. No prior experience needed.

---

## 0) What you already have
- A React component file (provided in ChatGPT canvas) for the site.
- A `public/` folder (downloadable as `public_folder.zip`) containing:
  - `public/music/` — your MP3s
  - `public/covers/` — your placeholder cover art
- Links for Spotify, Apple Music, YouTube, and socials to paste into `SITE_CONFIG` inside the React component.

> The component uses **Tailwind CSS** and **shadcn/ui**. Don't worry—this guide sets them up for you.

---

## 1) Create the project (Vite + React)
> You’ll need Node.js installed (v18+ recommended). Download from https://nodejs.org if needed.

```bash
# 1) Make a new Vite project
npm create vite@latest drblackout-site -- --template react-ts
cd drblackout-site

# 2) Install dependencies
npm install

# 3) Start the dev server
npm run dev
# (You should see a local URL like http://localhost:5173)
```

---

## 2) Add Tailwind CSS
Follow Tailwind’s official setup for Vite + React:

```bash
# Install Tailwind + PostCSS + Autoprefixer
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Open `tailwind.config.js` and replace its `content` with:

```js
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
]
```

Open `src/index.css` and **replace everything** with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 3) Add shadcn/ui (for nice buttons & cards)
shadcn/ui works with Vite too.

```bash
# Install the CLI
npx shadcn@latest init

# Install UI components used by the site
# (You can add more later.)
npx shadcn@latest add button card input
```

> The CLI will add a folder like `src/components/ui`. The site code imports from there.

---

## 4) Add icons & animation libraries
```bash
npm install lucide-react framer-motion
```

---

## 5) Add your site code
1. In `src/`, create a file: `DrBlackoutSite.tsx`  
2. Paste the full React component code from ChatGPT (canvas).  
3. Open `src/main.tsx` and **replace** the root render to mount your component:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import DrBlackoutSite from './DrBlackoutSite'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DrBlackoutSite />
  </React.StrictMode>,
)
```

---

## 6) Add your assets
- Unzip `public_folder.zip` and drop the **public/** folder into your project root (overwrite if prompted).
  - You should end up with `drblackout-site/public/music/...` and `drblackout-site/public/covers/...`

---

## 7) Update the config in the code
Inside `DrBlackoutSite.tsx` find `SITE_CONFIG` and update:

```ts
const SITE_CONFIG = {
  contactEmail: "drblackoutofficial@gmail.com",
  spotifyEmbedSrc: "https://open.spotify.com/embed/artist/303ESft4GOklhvhPIDsXdr?utm_source=generator",
  appleMusicEmbedSrc: "https://embed.music.apple.com/us/album/ethereal-2/1811094718",
  socials: [
    { label: "YouTube", href: "https://www.youtube.com/channel/UCxVrBRV0h1Chbi-IEtecb-w" },
    { label: "Instagram", href: "https://www.instagram.com/drblackoutt/" },
    { label: "X", href: "https://x.com/drblackoutt" },
  ],
};
```

Also add your **YouTube video IDs** in `YOUTUBE_VIDEO_IDS` (the characters after `v=` in a YouTube URL):

```ts
const YOUTUBE_VIDEO_IDS = [
  "wZNrG9REzxo",
  "3lkqnvLS8h4",
];
```

Tracks live in the `TRACKS` array. If you add more, make sure files exist in `public/music/` and cover art in `public/covers/`.

---

## 8) Test locally
```bash
npm run dev
```
Open the browser link (usually http://localhost:5173) and test:
- Audio player works
- YouTube videos load
- Spotify & Apple embeds display
- Social & contact buttons work

---

## 9) Deploy to Vercel (easiest)
### Option A: Vercel Web UI
1. Create an account at https://vercel.com (use GitHub login).
2. Push your project to a GitHub repo.
3. In Vercel, click **New Project** → **Import** your GitHub repo.
4. Framework: **Vite**. Build settings will auto-detect:  
   - **Build Command**: `npm run build`  
   - **Output Directory**: `dist`
5. Click **Deploy**. You’ll get a live URL like `https://drblackout-site.vercel.app`.

### Option B: Vercel CLI
```bash
npm i -g vercel
vercel
# Follow prompts. For updates:
vercel --prod
```

**Custom Domain (Vercel):**
- Go to **Settings → Domains** → Add `drblackout.com` (or your domain)  
- Update DNS at your domain registrar as instructed; Vercel will issue SSL automatically.

---

## 10) Deploy to Netlify (alternative)
### Netlify Web UI
1. Create an account at https://www.netlify.com
2. Click **Add new site** → **Import from Git** → choose your GitHub repo.
3. Build settings:  
   - **Build Command**: `npm run build`  
   - **Publish directory**: `dist`
4. Click **Deploy** to get a live URL like `https://drblackout-site.netlify.app`.

### Netlify CLI (optional)
```bash
npm install -g netlify-cli
npm run build
netlify deploy
# choose 'dist' as the publish directory
netlify deploy --prod
```

**Custom Domain (Netlify):**
- **Site settings → Domain management → Add domain**  
- Move DNS or add records from your registrar; Netlify will handle SSL.

---

## 11) Contact form (next step)
Right now the form uses `mailto:`. For real submissions:
- **Formspree**: quick, no backend  
- **Resend** + **Vercel** serverless function  
- **Netlify Forms**: if hosting on Netlify, add a `netlify` attribute

Example (Formspree):
```html
<form action="https://formspree.io/f/your_form_id" method="POST">
  <input type="email" name="email" required />
  <button type="submit">Get in touch</button>
</form>
```

---

## 12) SEO + Social previews (optional)
- Add `/public/og.jpg` (a promo image).
- Create a basic `index.html` `<meta>` tags for title/description/open graph.
- Add `robots.txt` and `sitemap.xml` later for search engines.

---

## 13) Common issues & fixes
- **Embeds blocked**: Check browser blockers; ensure `allow` attributes are present in `<iframe>`.
- **Audio doesn’t play on mobile**: iOS requires a user gesture before audio can start.
- **404s on covers/music**: Ensure files are inside `public/` exactly as referenced in code.
- **Build fails**: Make sure `lucide-react`, `framer-motion`, and shadcn components are installed.

---

## 14) Ship updates
After editing code:
```bash
# Commit & push to GitHub
git add .
git commit -m "Update tracks/site config"
git push origin main
# Vercel/Netlify will auto-redeploy
```

---

### You’re live!
If you want me to wire the GitHub + Vercel/Netlify for you, share the repo link and I can guide the exact steps.
