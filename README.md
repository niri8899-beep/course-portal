# אנגלית לקריירה — Course Portal

A complete Hebrew RTL course portal built with Next.js 14, Tailwind CSS, and localStorage for persistence.

---

## Running Locally

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**First login:** use any email + password `12345`. You will be prompted to set a new personal password before continuing.

---

## Project Structure

```
course-portal/
├── app/
│   ├── page.tsx                          # Login page
│   ├── dashboard/page.tsx                # Dashboard + progress overview
│   ├── modules/page.tsx                  # All modules grid
│   ├── module/[id]/page.tsx              # Module detail + lesson list
│   ├── lesson/[moduleId]/[lessonId]/     # Individual lesson
│   │   └── page.tsx                      #   (video, PDF, mark complete)
│   ├── progress/page.tsx                 # Detailed progress breakdown
│   ├── layout.tsx                        # Root layout (RTL, Hebrew font)
│   └── globals.css
├── components/
│   ├── AppLayout.tsx                     # Auth guard + sidebar wrapper
│   ├── Sidebar.tsx                       # Navigation sidebar
│   └── ChangePasswordModal.tsx           # First-login password change
└── lib/
    ├── courseData.ts                     # All 5 modules × 5 lessons
    ├── auth.ts                           # localStorage auth helpers
    └── progress.ts                       # Progress tracking helpers
```

---

## Deploying to Vercel

### Option A — Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts. Vercel auto-detects Next.js — no configuration needed.

### Option B — GitHub + Vercel Dashboard

1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/course-portal.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repository.
3. Leave all settings as default and click **Deploy**.

Your app will be live at `https://your-project.vercel.app` within ~2 minutes.

---

## Replacing Placeholder Videos

Each lesson embeds a Vimeo video. To use your own videos:

1. Upload your videos to [vimeo.com](https://vimeo.com).
2. Copy each video's numeric ID from the URL (e.g. `vimeo.com/video/**123456789**`).
3. Open `app/lesson/[moduleId]/[lessonId]/page.tsx` and replace the `VIMEO_IDS` array with your IDs (one per lesson, or map by `moduleId`/`lessonId`).

---

## Replacing the PDF Download

In `app/lesson/[moduleId]/[lessonId]/page.tsx`, find `handleDownloadPDF` and replace the `alert` with a real download link:

```typescript
function handleDownloadPDF() {
  window.open(`/pdfs/module-${mId}-lesson-${lId}.pdf`, '_blank')
}
```

Then place your PDF files in the `public/pdfs/` folder.

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Language | TypeScript |
| Font | Noto Sans Hebrew (Google Fonts) |
| Direction | RTL (Hebrew) |
| Persistence | `localStorage` (no backend needed) |
| Deployment | Vercel |
