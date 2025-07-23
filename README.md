# ScanMonk - E-commerce Store Scanner

A modern web application for scanning and analyzing e-commerce stores, with a focus on identifying Shopify-powered websites.

## Features

- 🔍 **Real-time Domain Scanning**: Batch process domains to identify Shopify stores
- 💾 **Database Persistence**: All results saved to PostgreSQL database
- 🔄 **Background Processing**: Crawls continue running even after closing the browser
- 📊 **Analytics Dashboard**: View statistics and export results
- 🌙 **Dark Mode**: Full dark mode support
- 📱 **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **UI**: shadcn/ui, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel
- **Background Jobs**: Vercel Cron Jobs

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/BinaryBishup/scanmonk.git
cd scanmonk
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file:

```env
# Database URL (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# For Vercel deployment
POSTGRES_URL="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# Cron secret for background jobs
CRON_SECRET="your-secret-key"

# Base URL for production
NEXT_PUBLIC_BASE_URL="https://your-domain.vercel.app"
```

### 4. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
npx prisma db seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Options

### Option 1: Vercel Postgres (Recommended for Vercel deployment)

1. Go to your Vercel project dashboard
2. Navigate to the "Storage" tab
3. Click "Create Database" and select "Postgres"
4. Copy the environment variables to your `.env.local`

### Option 2: Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings > Database
3. Copy the connection string
4. Add to `.env.local`:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true"
   ```

### Option 3: Local PostgreSQL

```bash
# Install PostgreSQL locally
brew install postgresql # macOS
sudo apt-get install postgresql # Ubuntu

# Create database
createdb scanmonk

# Update .env.local
DATABASE_URL="postgresql://localhost:5432/scanmonk"
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `CRON_SECRET`
   - `NEXT_PUBLIC_BASE_URL`
4. Deploy!

### Setting up Cron Jobs

The application includes a cron job that runs every 6 hours. To customize:

1. Edit `vercel.json`:
   ```json
   {
     "crons": [{
       "path": "/api/cron/crawler",
       "schedule": "0 */6 * * *"  // Runs every 6 hours
     }]
   }
   ```

2. Set `CRON_SECRET` in Vercel environment variables

## API Endpoints

- `POST /api/crawler` - Process domains
- `GET /api/crawler/session` - List all sessions
- `POST /api/crawler/session` - Create new session
- `GET /api/crawler/session/[id]` - Get session details
- `PATCH /api/crawler/session/[id]` - Update session status
- `GET /api/cron/crawler` - Cron endpoint for scheduled crawls

## Features in Detail

### Crawler Page (`/crawler`)
- Upload CSV or TXT files with domain lists
- Real-time progress tracking
- Export results as CSV
- View previous sessions

### Database Persistence
- All crawl results saved to PostgreSQL
- Sessions can be resumed later
- Historical data analysis

### Background Processing
- Crawls continue running on the server
- Real-time updates via polling
- Automatic retry on failures

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
