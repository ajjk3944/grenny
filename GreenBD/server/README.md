# GreenBD Backend Server

Node.js + Express + TypeScript backend for the GreenBD environmental tracking platform.

## Features

- JWT authentication with Firebase integration
- AI-powered submission verification using OpenAI GPT-4 Vision
- Async job processing with Bull queue
- PostgreSQL database with Prisma ORM
- Redis for caching and rate limiting
- Cloudinary for media storage
- Role-based access control (Admin, Security, User)
- Points calculation with streak bonuses
- Push notifications via Firebase

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Cloudinary account
- OpenAI API key
- Firebase project

### Installation

```bash
cd server
npm install
```

### Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `FIREBASE_*` - Firebase admin credentials
- `CLOUDINARY_*` - Cloudinary credentials
- `OPENAI_API_KEY` - OpenAI API key

### Database Setup

```bash
npm run prisma:generate
npm run prisma:migrate
```

### Running the Server

Development:
```bash
npm run dev
```

Production:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login-admin` - Admin login
- `POST /api/auth/login-security` - Security user login
- `POST /api/auth/login-phone` - Phone number login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/login-google` - Google OAuth
- `POST /api/auth/login-facebook` - Facebook OAuth

### Submissions
- `GET /api/submissions` - List user submissions
- `POST /api/submissions` - Create new submission
- `GET /api/submissions/:id` - Get submission details

### Points
- `GET /api/points/summary` - Points overview
- `GET /api/points/history` - Points history chart data

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard rankings

### Benefits
- `GET /api/benefits` - List available benefits
- `POST /api/benefits/redeem/:id` - Redeem a benefit

### Admin Routes (Admin role required)
- `POST /api/admin/security-users` - Create security user
- `GET /api/admin/security-users` - List security users
- `PUT /api/admin/security-users/:id` - Update security user
- `DELETE /api/admin/security-users/:id` - Delete security user
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id/ban` - Ban/unban user
- `PUT /api/admin/users/:id/redmark` - Red mark user
- `GET /api/admin/messages` - Get all messages
- `PUT /api/admin/messages/:id/resolve` - Resolve message
- `POST /api/admin/notices` - Send notice
- `GET /api/admin/config` - Get app config
- `PUT /api/admin/config` - Update app config

### Security Routes (Security role required)
- `GET /api/security/review-queue` - Get submissions for review
- `PUT /api/security/review/:id` - Review submission
- `GET /api/security/users` - List users in assigned area
- `POST /api/security/messages` - Send message
- `GET /api/security/messages` - Get messages

## AI Verification System

The AI review system analyzes submissions through multiple checks:

1. **Content Relevance** - Verifies image shows environmental activity
2. **Fake Detection** - Checks for AI-generated images
3. **Duplicate Detection** - Compares against recent submissions
4. **Category Matching** - Ensures content matches selected category
5. **Metadata Validation** - Verifies EXIF data and GPS coordinates

### Review Flow

1. User submits media → stored in Cloudinary
2. Job added to Bull queue
3. Worker processes AI analysis
4. Confidence score calculated (0-100)
5. Auto-decision based on confidence:
   - 75+: Auto-verify, award points
   - 40-75: Flag for manual review
   - <40: Auto-reject
6. User notified of result

## Points System

Base points from activity category, plus bonuses:
- 7-day streak: 1.5x multiplier
- 30-day streak: 2x multiplier
- Multiple submissions per day: +50 bonus
- Designated environmental zone: +30 bonus

## Rate Limiting

- Submissions: 5 per day per user
- API requests: 100 per 15 minutes
- Cooldown: 30 minutes between submissions

## Security

- JWT tokens with 7-day expiry
- Bcrypt password hashing
- Role-based middleware
- Input validation on all endpoints
- Rate limiting on sensitive routes

## Deployment

Recommended stack:
- Server: AWS EC2 or DigitalOcean
- Database: AWS RDS PostgreSQL
- Redis: AWS ElastiCache
- Media: Cloudinary
- Monitoring: PM2 + CloudWatch

## License

Proprietary - GreenBD Platform
