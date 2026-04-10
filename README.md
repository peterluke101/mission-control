# Mission Control

Mission Control is a centralized web app for managing organizational tasks, projects, goals, revenue tracking, and team workflows.

---

## Problem It Solves

Streamlines fragmented task/project management across multiple tools into one unified interface with data-driven insights.

---

## Tech Stack

- Next.js 16.2.0
- React 19.2.4
- Tailwind CSS 4
- Zustand for state management
- TypeScript
- Various UI and utility libraries (lucide-react, clsx, shadcn)

---

## Folder Structure Overview

- `/src/app/` — main React app pages and components
- `/src/app/api/` — backend API routes
- `/public/` — static assets
- `/pro/` — private/pro product documents and scripts
- `/styles/` — global CSS and theming (Tailwind config separate)
- `/node_modules/` — dependencies

---

## Setup and Development


### Install Dependencies

```
npm install
```

### Run App Locally

```
npm run dev
```

---

## Build and Deployment

### Build for Production

```
npm run build
```

### Run Production Server

```
npm start
```

- Serve on all interfaces with `-H 0.0.0.0` for accessibility

---

## Environment Variables

Create `.env.local` with the following placeholders:

```
GUMROAD_ACCESS_TOKEN=your_token_here
OTHER_API_KEYS=

# Add any other env vars your local setup requires
```

---

## Current Status

- Core task and project management functionalities implemented
- Analytics and revenue tracking partially live
- UI responsive but ongoing refinements planned

---

## Known Issues & Next Priorities

- Finalize Logbook tab polish and toggle behavior
- Address More tab functional actions
- Implement enhanced offline and mobile resilience
- Expand deployment automation
- Strengthen documentation and onboarding

---

Please reach out for detailed dev or usage instructions.