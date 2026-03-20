// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'subscriber' | 'admin' | 'public';
  subscription_status: 'active' | 'inactive' | 'cancelled' | 'expired';
  subscription_plan?: 'monthly' | 'yearly';
  subscription_end_date?: string;
  charity_id?: string;
  charity_percentage: number;
  created_at: string;
  updated_at: string;
}

// Score Types
export interface GolfScore {
  id: string;
  user_id: string;
  score: number;
  date: string;
  course?: string;
  created_at: string;
}

// Charity Types
export interface Charity {
  id: string;
  name: string;
  description: string;
  logo_url?: string;
  website?: string;
  featured: boolean;
  total_raised: number;
  events: CharityEvent[];
  created_at: string;
}

export interface CharityEvent {
  id: string;
  charity_id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
}

// Draw Types
export interface Draw {
  id: string;
  month: string;
  year: number;
  status: 'pending' | 'simulated' | 'published' | 'completed';
  draw_type: 'random' | 'algorithmic';
  drawn_numbers: number[];
  created_at: string;
  published_at?: string;
}

export interface DrawWinner {
  id: string;
  draw_id: string;
  user_id: string;
  match_type: '5-match' | '4-match' | '3-match';
  prize_amount: number;
  user_numbers: number[];
  verification_status: 'pending' | 'approved' | 'rejected';
  proof_url?: string;
  payment_status: 'pending' | 'paid' | 'failed';
  created_at: string;
}

// Prize Pool Types
export interface PrizePool {
  id: string;
  draw_id: string;
  match_type: '5-match' | '4-match' | '3-match';
  total_amount: number;
  winners_count: number;
  amount_per_winner: number;
  rollover_amount?: number;
}

// Subscription Types
export interface Subscription {
  id: string;
  user_id: string;
  plan: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired';
  stripe_subscription_id?: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  auto_renewal: boolean;
}

// Payment Types
export interface Payment {
  id: string;
  user_id: string;
  stripe_payment_intent_id?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  payment_method: string;
  charity_contribution: number;
  created_at: string;
}

// Analytics Types
export interface Analytics {
  total_users: number;
  active_subscribers: number;
  total_prize_pool: number;
  total_charity_raised: number;
  monthly_revenue: number;
  draw_statistics: {
    total_draws: number;
    average_participants: number;
  };
}
