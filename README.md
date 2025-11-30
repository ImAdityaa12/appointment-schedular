# Astronomy Booking Website

A modern astronomy appointment booking system built with Next.js 15, Drizzle ORM, and PostgreSQL (Neon).

## Features

- **Landing Page**: Hero section, services showcase, and customer reviews
- **Appointment Scheduler**: Interactive calendar and time slot selection
- **Real-time Availability**: Automatically disables booked and blocked time slots
- **Admin Dashboard**: Protected admin panel for managing appointments and blocking slots
- **Responsive Design**: Mobile-friendly UI with Shadcn components

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Drizzle ORM
- PostgreSQL (Neon Database)
- Shadcn UI
- Tailwind CSS

## Setup Instructions

### 1. Database Setup

1. Create a free PostgreSQL database at [Neon](https://neon.tech)
2. Copy your database connection string

### 2. Environment Variables

Update `.env.local` with your database URL:

```env
DATABASE_URL=your_neon_database_url_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=astronomy2024
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Push Database Schema

```bash
npm run db:push
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Usage

### User Flow
1. Visit the landing page
2. Click "Book Your Session"
3. Select a date and available time slot
4. Fill in contact information
5. Submit appointment

### Admin Access
1. Navigate to `/admin`
2. Login with credentials from `.env.local`
3. View all appointments
4. Block time slots as needed

## Project Structure

```
astronomy-booking/
├── app/
│   ├── api/              # API routes
│   ├── admin/            # Admin pages
│   ├── schedule/         # Booking page
│   └── page.tsx          # Landing page
├── components/ui/        # Shadcn components
├── db/
│   ├── schema.ts         # Database schema
│   └── index.ts          # Database connection
└── .env.local            # Environment variables
```

## Default Admin Credentials

- Username: `admin`
- Password: `astronomy2024`

**Important**: Change these in production!
