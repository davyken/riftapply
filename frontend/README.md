# UniAdmit — Client

Next.js frontend for the UniAdmit university admissions platform. Covers login, registration, and role-specific dashboards for students, agents, universities, and the admin.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| State | Zustand (persisted auth store) |
| HTTP Client | Axios (30s timeout, JWT interceptor) |
| Charts | Recharts (dynamic import, SSR-safe) |
| Deploy | Vercel |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/                  # Shared login with role tabs
│   │   └── register/
│   │       ├── page.tsx            # Role selection (Student / Agent / University)
│   │       ├── student/            # Student registration form
│   │       ├── agent/              # Agent form (Personal or Company + doc upload)
│   │       └── university/         # University form (logo + institution details)
│   └── (dashboard)/
│       ├── layout.tsx              # Shared sidebar + topbar + error boundary
│       ├── student/                # Student dashboard
│       ├── agent/                  # Agent dashboard
│       ├── university/             # University recruitment dashboard
│       └── admin/                  # System admin dashboard
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx             # Role-aware navigation sidebar
│   │   └── Topbar.tsx              # Search bar + notifications + avatar
│   └── ui/
│       ├── BarChartWidget.tsx      # Dynamic recharts wrapper (no SSR)
│       └── ErrorBoundary.tsx       # React error boundary for dashboard pages
├── lib/
│   ├── api/
│   │   ├── client.ts               # Axios instance (base URL, JWT, 30s timeout)
│   │   ├── auth.api.ts             # Login + register endpoints
│   │   ├── applications.api.ts     # Application CRUD
│   │   └── admin.api.ts            # All admin actions
│   └── store/
│       └── auth.store.ts           # Zustand auth store (persisted to localStorage)
└── types/
    └── index.ts                    # Shared TypeScript types for all entities
```

---

## Pages & Routes

### Auth (no layout)
| Route | Description |
|---|---|
| `/login` | Role tabs: Student, Agent, University, Admin |
| `/register` | Role selection card — Admin not listed |
| `/register/student` | Student sign-up form |
| `/register/agent` | Agent sign-up — Personal (CNI) or Company (registration doc) |
| `/register/university` | University sign-up — logo upload + institution details |

> **Admin has no registration page.** Admin credentials are managed directly in the database.

### Dashboards (shared sidebar + topbar)
| Route | Role | Key content |
|---|---|---|
| `/student` | Student | Applications list, document progress, recommended universities |
| `/agent` | Agent | Commission stats, student table, verification tasks, growth chart |
| `/university` | University | Recruitment overview, modules/courses table, admissions queue |
| `/admin` | Admin | Approval queues, applications table, university replies inbox, growth chart |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

> Make sure the [API server](../server/README.md) is running on port 4000 first.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Auth Flow

1. User fills the login form and selects their role.
2. On success the JWT token is stored in Zustand (persisted to `localStorage`).
3. The Axios interceptor attaches the token to every subsequent request.
4. A 401 response clears the store and redirects to `/login`.

---

## Deployment on Vercel

1. Push the `client/` folder to GitHub.
2. Import the repo in the [Vercel dashboard](https://vercel.com/new).
3. Set the environment variable:
   - `NEXT_PUBLIC_API_URL` → your Render API URL (e.g. `https://your-api.onrender.com/api`)
4. Vercel detects Next.js automatically — no extra config needed beyond `vercel.json`.

---

## Available Scripts

```bash
npm run dev        # Start development server (http://localhost:3000)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint
```
