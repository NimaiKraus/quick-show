export interface Movie {
  _id: string;
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  genres: { id: number; name: string }[];
  casts: { name: string; profile_path: string }[];
  release_date: string;
  original_language: string;
  tagline: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  dateTime?: Record<string, DateTime[]>;
}

export interface Trailer {
  image: string;
  videoUrl: string;
}

export interface DateTime {
  time: string;
  showId: string;
}

export interface Booking {
  _id: string;
  user: { name: string };
  show: {
    _id: string;
    movie: Movie;
    showDateTime: string;
    showPrice: number;
  };
  amount: number;
  bookedSeats: string[];
  isPaid: boolean;
}

export interface DashboardData {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  activeShows: ActiveShow[];
}

export interface ActiveShow {
  _id: string;
  movie: Movie;
  showDateTime: string;
  showPrice: number;
  occupiedSeats: Record<string, string>;
}