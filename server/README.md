# UniAdmit — API Server

NestJS REST API for the UniAdmit university admissions platform. Handles authentication, application management, admin workflows, file uploads, and email notifications.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS 11 (TypeScript) |
| Database | MongoDB Atlas / Local via Mongoose |
| Auth | JWT + Passport |
| File Storage | Cloudinary |
| Email | Nodemailer (SMTP) |
| Rate Limiting | @nestjs/throttler |
| Deploy | Render |

---

## Project Structure

```
src/
├── auth/                   # JWT login + registration for all roles
│   ├── dto/                # Validation DTOs
│   └── strategies/         # JWT strategy
├── users/                  # Student schema & module
├── agents/                 # Agent schema (personal + company)
├── universities/           # University schema with modules/programs/fees
├── applications/           # Application lifecycle + document uploads
├── admin/                  # Admin service — approvals, email templates, notify
├── notifications/          # Per-user notification feed
├── cloudinary/             # File upload service (5 MB limit, 30s timeout)
├── mail/                   # Nodemailer email service
└── common/
    ├── enums.ts            # Single source of truth for all status values
    ├── multer.config.ts    # File size/type limits (5 MB, PDF/JPG/PNG only)
    ├── filters/            # Global exception filter (prevents process crashes)
    ├── guards/             # JwtAuthGuard, RolesGuard
    └── decorators/         # @Roles()
```

---

## Roles & Access

| Role | Registration | Account Activation |
|---|---|---|
| Student | Self-register at `/auth/register/student` | Instant |
| Agent | Self-register at `/auth/register/agent` | Pending admin approval |
| University | Self-register at `/auth/register/university` | Pending admin approval |
| Admin | No registration — credentials set directly in DB | Always active |

---

## Application Workflow

```
Student/Agent submits application
        ↓
status: pending_review  →  Admin inbox
        ↓
Admin approves / rejects / requests info
        ↓
status: approved  →  Admin clicks "Send to University"
        ↓
status: sent_to_university  →  University dashboard
        ↓
University responds (accept / refuse / info)
        ↓
status: accepted_by_university  →  Admin inbox
        ↓
Admin clicks "Notify Candidate"  →  Email + dashboard notification
```

No direct contact between candidates and universities until the admin forwards a response.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in `.env`:

```env
PORT=4000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Local MongoDB for development
MONGODB_URI=mongodb://localhost:27017/institute

JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=587
MAIL_USER=...
MAIL_PASSWORD=...
MAIL_FROM=noreply@uniadmit.com
```

### 3. Start MongoDB locally

```bash
sudo systemctl start mongod
```

### 4. Run the server

```bash
# Development (watch mode)
npm run start:dev

# Production build
npm run build
npm run start:prod
```

Server starts on `http://localhost:4000`

---

## Key API Routes

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register/student` | Register a student |
| POST | `/api/auth/register/agent` | Register an agent (multipart) |
| POST | `/api/auth/register/university` | Register a university (multipart) |
| POST | `/api/auth/login` | Login (pass `role` in body) |

### Applications
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/applications` | Student / Agent |
| GET | `/api/applications/mine` | Student / Agent |
| GET | `/api/applications/university` | University |
| PUT | `/api/applications/:id/respond` | University |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/pending/agents` | Agents awaiting approval |
| PUT | `/api/admin/agents/:id/approve` | Approve an agent |
| PUT | `/api/admin/agents/:id/reject` | Reject with reason |
| GET | `/api/admin/applications` | All applications (filterable by status) |
| PUT | `/api/admin/applications/:id/approve` | Approve application |
| PUT | `/api/admin/applications/:id/send-to-university` | Forward to university |
| POST | `/api/admin/applications/:id/notify` | Send email/dashboard notification to candidate |
| GET | `/api/admin/university-replies` | University responses awaiting action |

### Notifications
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notifications/mine` | Current user's notifications |
| PUT | `/api/notifications/:id/read` | Mark as read |

---

## Rate Limits

| Scope | Limit |
|---|---|
| Global (all routes) | 100 requests / 60 seconds / IP |
| `POST /api/auth/login` | 10 requests / 60 seconds / IP |

---

## File Upload Limits

- Max file size: **5 MB**
- Max files per request: **10**
- Allowed types: `PDF`, `JPEG`, `PNG`, `WebP`, `SVG`
- Upload timeout: **30 seconds**

---

## Deployment on Render

1. Push the `server/` folder to a GitHub repository.
2. Create a new **Web Service** on Render and point it at the repo.
3. Render auto-detects the `render.yaml` at the root.
4. Set all environment variables in the Render dashboard (marked `sync: false` in `render.yaml`).
5. Build command: `npm install && npm run build`
6. Start command: `npm run start:prod`

---

## Running Tests

```bash
npm run test          # unit tests
npm run test:e2e      # end-to-end tests
npm run test:cov      # coverage report
```