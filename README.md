# Golf Charity Subscription Platform

## Status

✅ **Application Status**: Production Ready (Demo Mode - No real payments yet)
- Backend: PostgreSQL + Next.js API Routes
- Frontend: React 18 + Next.js 14
- Hosting: Vercel
- Database: Neon PostgreSQL

## Overview

A modern, subscription-driven web application combining golf performance tracking, monthly prize draws, and charitable giving. Users track their golf scores, participate in monthly draws for cash prizes, and support charities of their choice.

## Features

✅ **Subscription System** - Monthly and yearly plans with Stripe integration
✅ **Score Management** - Track last 5 golf scores in Stableford format
✅ **Monthly Draws** - 5-number, 4-number, 3-number prize matches
✅ **Charity Integration** - Support multiple charities with configurable donation percentages
✅ **User Dashboard** - Complete profile, score history, and winnings tracking
✅ **Admin Dashboard** - Full platform management and draw administration
✅ **Winner Verification** - Proof-based winner verification and payment tracking
✅ **Responsive Design** - Mobile-first, fully responsive interface

## Tech Stack

- **Frontend**: React 18, Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase (PostgreSQL)
- **Payments**: Stripe
- **State Management**: Zustand
- **Authentication**: Supabase Auth

## Project Structure

```
├── app/
│   ├── api/                    # API routes
│   ├── auth/                   # Auth pages (signin, signup)
│   ├── admin/                  # Admin dashboard
│   ├── dashboard/              # User dashboard
│   ├── onboarding/             # Onboarding flows
│   ├── charities/              # Charity listings
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Homepage
├── components/                 # Reusable React components
├── lib/
│   ├── supabase.ts            # Supabase client & auth
│   ├── stripe.ts              # Stripe integration
│   ├── store.ts               # Zustand stores
│   ├── draw-engine.ts         # Draw calculation logic
│   ├── score-manager.ts       # Score management
│   ├── charity-logic.ts       # Charity calculations
│   └── database.sql           # Database schema
├── types/                      # TypeScript types
├── styles/                     # Global styles
└── public/                     # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Stripe account (test keys for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd golf-charity-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in the following:
   ```
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-random-secret
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL from `lib/database.sql` in the SQL editor
   - Enable Row Level Security (RLS) for tables
   - Set up authentication methods

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## Deployment

### Deploy to Vercel

1. **Create a new Vercel account** (not personal)
   
2. **Connect your repository**
   ```bash
   vercel login
   vercel link
   ```

3. **Set environment variables**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   vercel env add STRIPE_SECRET_KEY
   vercel env add STRIPE_WEBHOOK_SECRET
   vercel env add NEXTAUTH_URL
   vercel env add NEXTAUTH_SECRET
   ```

4. **Deploy**
   ```bash
   vercel deploy --prod
   ```

### Configure Supabase

1. **Create a new Supabase project** (not personal)
2. Run database schema SQL
3. Set up authentication providers
4. Configure Row Level Security

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/logout` - Logout user

### Payments
- `POST /api/create-checkout-session` - Create Stripe checkout
- `POST /api/webhooks/stripe` - Stripe webhook handler

### Draws
- `POST /api/draws` - Generate and publish draws
- `GET /api/draws` - Fetch draw history

## User Types

### Public Visitor
- View platform concept
- Explore listed charities
- Understand draw mechanics
- Initiate subscription

### Registered Subscriber
- Manage profile & settings
- Enter/edit golf scores
- Participate in monthly draws
- View winnings and payment status

### Administrator
- Manage users & subscriptions
- Configure & run draws
- Select charity recipients
- Verify winner submissions
- Manage charity listings
- View analytics & reports

## Database Schema

### Core Tables
- `users` - User profiles and subscription details
- `golf_scores` - Score history (rolling 5-score window)
- `subscriptions` - Subscription records
- `payments` - Payment history

### Draw System
- `draws` - Monthly draws
- `draw_winners` - Winners and prize amounts
- `prize_pools` - Prize distribution by match type

### Charity System
- `charities` - Charity listings
- `charity_events` - Charity events

## Testing Checklist

- [ ] User signup & login flows
- [ ] Subscription flow (monthly & yearly)
- [ ] Score entry and rolling 5-score window
- [ ] Draw system logic and simulation
- [ ] Charity selection and contribution
- [ ] Winner verification process
- [ ] Admin dashboard functionality
- [ ] Responsive design on mobile/desktop
- [ ] Error handling and edge cases

## Stripe Test Cards

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Expiry: Any future date
CVC: Any 3 digits
```

## Development Notes

### Stableford Format
Golf scores in Stableford format range from 1-45 points.

### Prize Distribution
- 5-Number Match: 40% of pool (Jackpot, rolls over)
- 4-Number Match: 35% of pool
- 3-Number Match: 25% of pool

### Score Logic
- Users enter their last 5 scores
- New score replaces the oldest
- Scores displayed in reverse chronological order (most recent first)

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

Private - Digital Heroes

## Support

For issues and questions, contact Digital Heroes at digitalheroes.co.in

---

Built with 🍌❤️ by the Digital Heroes team