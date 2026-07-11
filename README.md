# FileHub

**Collaborative file storage with project-scoped access control, powered by Firebase.**

[Features](#features) • [Tech Stack](#tech-stack) • [Architecture](#architecture) • [Getting Started](#getting-started) • [Usage](#usage) • [Roadmap](#roadmap) • [Project Structure](#project-structure)

---

## Overview

FileHub is a React + Firebase web application that lets users create projects, upload files (images, videos, audio, documents), and collaborate with teammates through invite links — all governed by a three-tier role system (Admin → Moderator → Member). Files are stored in Firebase Storage with Firestore metadata, and a built-in trash system auto-purges deleted files after 15 days.

Think of it as a lightweight, project-scoped alternative to Google Drive or Dropbox, designed for small teams that need quick file sharing with role-based permissions — no server to manage.

## Features

- 🔐 **Google OAuth Login** — one-click sign-in via Firebase Authentication with persistent sessions
- 📁 **Project Workspaces** — create up to 2 projects per account, each with its own file space and collaborators
- 🔗 **Invite Links** — share a URL to let others join your project instantly as Members
- 📤 **File Uploads** — upload any file type (image, video, audio, document) up to 10 MB per file, 50 MB per project
- 🗑️ **Trash & Restore** — soft-delete files to trash with 15-day retention and one-click restore
- 🧹 **Auto-Cleanup** — trashed files older than 15 days are purged automatically on project load
- 🛡️ **Role-Based Access Control** — three roles (Admin, Moderator, Member) with granular permissions for uploads, deletions, and user management
- 📋 **JSON Export** — view and copy all project file metadata as JSON, filterable by file type
- 🖥️ **Syntax-Highlighted Preview** — JSON output rendered with `react-syntax-highlighter` for readability
- 📖 **In-App Guidelines** — built-in documentation explaining roles and permissions to collaborators

## Tech Stack

| Layer | Technology |
|:------|:-----------|
| Framework | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Build Tool | [Vite 5](https://vitejs.dev/) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com/) + [PostCSS](https://postcss.org/) + [Autoprefixer](https://github.com/postcss/autoprefixer) |
| Routing | [React Router 6](https://reactrouter.com/) |
| Auth | [Firebase Auth](https://firebase.google.com/docs/auth) (Google OAuth popup) |
| Database | [Cloud Firestore](https://firebase.google.com/docs/firestore) |
| File Storage | [Firebase Storage](https://firebase.google.com/docs/storage) |
| Icons | [Lucide React](https://lucide.dev/) |
| Notifications | [React Hot Toast](https://react-hot-toast.com/) |
| Syntax Highlighting | [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) |
| Linting | [ESLint 9](https://eslint.org/) + [typescript-eslint](https://typescript-eslint.io/) |
| Hosting | [Vercel](https://vercel.com/) (SPA rewrites configured) |

## Architecture

FileHub is a single-page application with no backend server — all business logic runs client-side, with Firebase handling auth, database, and storage.

```
Filehub/
├── public/              # Static assets (logos, banners, loading GIFs)
├── src/
│   ├── components/      # Reusable UI components (16 files)
│   ├── firebase/        # Firebase config + all Firestore/Storage operations
│   ├── pages/           # Route-level page components (4 files)
│   ├── assets/          # Bundled assets (SVGs)
│   ├── App.tsx          # Router + auth guard
│   ├── main.tsx         # React entry point (BrowserRouter + Toaster)
│   └── index.css        # Tailwind directives + Outfit font
├── index.html           # Vite HTML entry
├── vite.config.ts       # Vite + React plugin
├── tailwind.config.js   # Custom color palette
├── vercel.json          # SPA rewrite rules
└── .firebaserc          # Firebase project binding
```

### `src/firebase/` — Data Layer

All Firebase interactions are centralized here. No Firestore calls happen outside this module.

**`config.ts`** — Initializes the Firebase app and exports shared instances:

```ts
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

**`functions.ts`** (546 lines) — The core business logic layer. Exports every data operation the app needs:

| Function | Purpose |
|:---------|:--------|
| `Login` / `Logout` | Google OAuth popup sign-in and sign-out with localStorage cleanup |
| `createProjectFunction` | Creates a Firestore project doc + updates the user's project array (enforces 2-project limit) |
| `getProjects` / `getProject` | Fetches all user projects or a single project by ID, caches to `localStorage` |
| `deleteProject` | Removes project doc, cleans up all Storage files (active + trashed), removes project refs from all member docs |
| `joinWithLink` | Parses invite URL, validates project exists, adds user as Member |
| `addImage` | Uploads file metadata to Firestore, updates project storage limit |
| `moveToTrash` / `resortFile` | Moves files between active and trash arrays with date stamps |
| `deleteFile` | Permanently removes a trashed file from Firestore + Storage |
| `clearTrash` | Bulk-deletes all trashed files and reclaims storage limit |
| `promote` / `demote` / `deleteuser` | Updates user roles in both the user doc and project doc |
| `been30days` | Date utility — returns `true` if a trash date is ≥ 15 days old |
| `copyToClipboard` | DOM helper for copying text via `navigator.clipboard` |

**Key data types** defined in `functions.ts`:

```ts
type file = {
  dateadded: string;
  id: string;
  link: string;
  type: string;       // "image" | "video" | "audio" | "application"
  size: number;        // in MB
}

type Trashfile = {
  file: file[];
  deletedate: string;  // DD/MM/YYYY format
}
```

### `src/pages/` — Route Components

| Page | Route | Role |
|:-----|:------|:-----|
| `Homepage` | `/` | Landing page with auth navbar + hero banner |
| `Createproject` | `/projects` | Dashboard — lists user projects, create new / join via link |
| `Project` | `/project/:id` | Single project view with tabbed navigation |
| `Not_found` | `*` | 404 catch-all with animated GIF |

### `src/components/` — UI Components

Components are organized by function, not co-located with routes.

| Component | Description |
|:----------|:------------|
| `Authnavbar` | Pre-login navbar with "Get Started" (calls `Login`) |
| `Navbar` | Post-login navbar with "Logout" |
| `Homebanner` | Landing hero section with logo, tagline, and CTA |
| `Files` | File table within a project — upload, download, copy link, move to trash |
| `Trash` | Trash table — restore, permanently delete, clear all trash |
| `Codefiles` | JSON export view — filter by file type, syntax-highlighted output, copy JSON |
| `Contributors` | Collaborator table — shows roles, promote/demote/delete actions |
| `Guidelines` | Static in-app documentation for role permissions |
| `UploadImagemodel` | Modal — drag/select file, validates 10 MB single-file and 50 MB project limits, uploads to Firebase Storage |
| `Createnewproject` | Modal — text input for project name, enforces 2-project limit |
| `Invite` | Modal — paste invite link to join a project |
| `InviteModel` | Modal — displays and copies the shareable invite URL |
| `DeleteModel` | Modal — type-to-confirm project deletion (Admin only) |
| `DeleteFile` | Modal — confirm permanent file deletion |
| `RolechangeModel` | Modal — confirm promote, demote, or remove a collaborator |
| `Loading` | Full-screen overlay with loading GIF and message |

### Auth Guard

The `App.tsx` component uses `onAuthStateChanged` to redirect:
- **Unauthenticated** users → `/` (landing page)
- **Authenticated** users on `/` → `/projects` (dashboard)

### Theming

Custom Tailwind palette defined in `tailwind.config.js`:

```js
colors: {
  primary: '#3282B8',      // Blue — buttons, headings, links
  secondary: '#222831',    // Dark gray — text accents
  background: '#EEEEEE',   // Light gray — page backgrounds
  textPrimary: '#222831',  // Body text
}
```

Font: [Outfit](https://fonts.google.com/specimen/Outfit) (100–900 weights) loaded via Google Fonts in `index.css`.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- [npm](https://www.npmjs.com/) ≥ 9
- A [Firebase project](https://console.firebase.google.com/) with:
  - **Authentication** → Google sign-in provider enabled
  - **Cloud Firestore** → database created
  - **Firebase Storage** → bucket created

### Installation

```bash
git clone https://github.com/Omkar-kamble82/Filehub.git
cd Filehub
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```bash
# ──── Firebase Configuration ────
VITE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_project.appspot.com
VITE_MESSAGING_SENDER_ID=your_sender_id
VITE_APP_ID=your_app_id

# ──── Email (Resend) ────
VITE_RESEND_KEY=your_resend_api_key
```

> **Note:** All values are sourced from your Firebase project's console → Project Settings → General → Your apps → Config. The `VITE_RESEND_KEY` is present in the env template but does not appear to be used in the current codebase.

### Running

```bash
npm run dev       # Start Vite dev server (default: http://localhost:5173)
npm run build     # Type-check + production build
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

## Usage

### Routes

| Route | Access | Description |
|:------|:-------|:------------|
| `/` | Public | Landing page — sign in with Google |
| `/projects` | Authenticated | Project dashboard — view, create, or join projects |
| `/project/:id` | Authenticated | Single project — files, contributors, trash, JSON, guidelines |
| `*` | Public | 404 page |

### Project Tabs

Each project page (`/project/:id`) has five tabs:

| Tab | Description |
|:----|:------------|
| **Files** | Table of uploaded files — name, link (click to copy), type, date added, size, actions (download, move to trash) |
| **Contributor** | Table of collaborators — username, email, role, promote/demote/delete actions |
| **Trash** | Soft-deleted files — restore or permanently delete; "Clear Trash" bulk action |
| **Json** | JSON export of file metadata — filter by type (all/document/image/video/audio), copy to clipboard |
| **Guidelines** | In-app reference for role permissions |

### Role Permissions

| Action | Admin | Moderator | Member |
|:-------|:-----:|:---------:|:------:|
| Upload files | ✅ | ✅ | ❌ |
| Download files | ✅ | ✅ | ✅ |
| Move files to trash | ✅ | ✅ | ❌ |
| Restore/delete trashed files | ✅ | ✅ | ❌ |
| Promote/demote users | ✅ | ✅ | ❌ |
| Delete users | ✅ | ❌ | ❌ |
| Delete project | ✅ | ❌ | ❌ |
| Generate invite link | ✅ | ✅ | ✅ |

### Limits

| Constraint | Value |
|:-----------|:------|
| Max projects per user | 2 |
| Max file size (single upload) | 10 MB |
| Max project storage | 50 MB |
| Trash retention period | 15 days |

## Roadmap

Evidence from the existing README and codebase (`// TODO` comments, `VITE_RESEND_KEY` in env, `express` in dependencies):

- [ ] Integrate additional OAuth providers (GitHub, Microsoft, etc.)
- [ ] Add email notifications for file uploads or role changes (Resend key is configured but unused; `express` is listed as a dependency but not imported anywhere)
- [ ] Enable folder structure for advanced file organization
- [ ] Add activity logs / audit trail for uploads and deletions
- [ ] Migrate to a custom GCP bucket with Lifecycle Management Policies for auto-deleting trashed files at scale

> **⚠️ Ambiguity:** `express` (^4.19.2) is listed in `dependencies` but is not imported or used anywhere in the current source. It may have been intended for a future API server or email notification endpoint. Similarly, `react-email` (3.0.1) is in `devDependencies` but unused. `uuid` (^10.0.0) is also listed as a dependency but the codebase uses a custom `generateId()` function instead.

## Project Structure

<details>
<summary>Full file tree</summary>

```
Filehub/
├── .env.example                    # Template for required environment variables
├── .firebaserc                     # Firebase project alias (filehub-89190)
├── .gitignore                      # Ignores node_modules, dist, .env*
├── README.md                       # This file
├── eslint.config.js                # ESLint 9 flat config with React + TS rules
├── index.html                      # Vite HTML entry point (mounts #root)
├── package.json                    # Dependencies, scripts, project metadata
├── postcss.config.js               # PostCSS plugins: tailwindcss, autoprefixer
├── tailwind.config.js              # Custom color palette (primary, secondary, etc.)
├── tsconfig.json                   # TypeScript project references
├── tsconfig.app.json               # App-level TS config (ES2020, strict, react-jsx)
├── tsconfig.node.json              # Node-level TS config for Vite
├── vercel.json                     # SPA rewrite: all routes → /
├── vite.config.ts                  # Vite config with @vitejs/plugin-react
│
├── public/
│   ├── 0.jpg                       # Project card banner image #1
│   ├── 1.jpg                       # Project card banner image #2
│   ├── 404.gif                     # Animated 404 page illustration
│   ├── homebanner.png              # Landing page hero image
│   ├── icon.png                    # Favicon
│   ├── loading.gif                 # Loading overlay animation
│   ├── logo.png                    # FileHub logo (navbar)
│   ├── upload.png                  # Upload illustration (unused in code)
│   └── vite.svg                    # Default Vite logo (unused)
│
└── src/
    ├── App.tsx                     # Route definitions + auth state listener
    ├── main.tsx                    # React 18 entry — BrowserRouter + Toaster
    ├── index.css                   # Tailwind directives + Outfit font import
    ├── vite-env.d.ts               # Vite client type declarations
    │
    ├── assets/
    │   └── react.svg               # Default React logo (unused)
    │
    ├── firebase/
    │   ├── config.ts               # Firebase app init, exports auth/db/storage
    │   └── functions.ts            # All Firestore & Storage CRUD operations (546 lines)
    │
    ├── pages/
    │   ├── Homepage.tsx            # Landing page (Authnavbar + Homebanner)
    │   ├── Createproject.tsx       # Dashboard — project list, create/join modals
    │   ├── Project.tsx             # Single project view with tabbed navigation
    │   └── Not_found.tsx           # 404 page with return-to-home link
    │
    └── components/
        ├── Authnavbar.tsx          # Pre-login navbar (Google sign-in button)
        ├── Navbar.tsx              # Post-login navbar (logout button)
        ├── Homebanner.tsx          # Landing hero section with CTA
        ├── Files.tsx               # File listing table + upload/trash actions
        ├── Trash.tsx               # Trash table — restore, delete, clear all
        ├── Codefiles.tsx           # JSON export view with syntax highlighting
        ├── Contributors.tsx        # Collaborator table with role management
        ├── Guidelines.tsx          # Static role permission docs
        ├── UploadImagemodel.tsx    # File upload modal (10 MB / 50 MB validation)
        ├── Createnewproject.tsx    # Create project modal
        ├── Invite.tsx              # Join via invite link modal
        ├── InviteModel.tsx         # Copy invite link modal
        ├── DeleteModel.tsx         # Confirm project deletion modal (type-to-confirm)
        ├── DeleteFile.tsx          # Confirm file deletion modal
        ├── RolechangeModel.tsx     # Confirm promote/demote/delete user modal
        └── Loading.tsx             # Full-screen loading overlay
```

</details>
