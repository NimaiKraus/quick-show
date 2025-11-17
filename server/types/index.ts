export interface MovieShared {
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  genres: { id: number; name: string }[];
  release_date: string;
  original_language: string;
  tagline: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
}

export interface Movie extends MovieShared {
  _id: string;
  id?: number; // keep TMDB numeric id if you store it, optional
  casts: { name: string; profile_path: string }[];
  dateTime?: Record<string, DateTime[]>;
}

export interface NowPlayingMovie extends MovieShared {
  adult: boolean;
  genre_ids: number[];
  id: number;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface NowPlayingMovies {
  success: boolean;
  movies: NowPlayingMovie[];
}

export interface TMDBMovieDetail extends MovieShared {
  adult: boolean;
  belongs_to_collection: null | object;
  budget: number;
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_title: string;
  popularity: number;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  revenue: number;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  video: boolean;
}

export interface TMDBMovieCredits {
  id: number;
  cast: CastMember[];
  crew: CastMember[];
}

interface CastMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface AddMovieRequestBody {
  movieId: string;
  showsInput: { date: string; times: string[] }[];
  showPrice: number;
}

export interface CreateBookingRequestBody {
  showId: string;
  selectedSeats: string[];
}

export interface DateTime {
  time: string;
  showId: string;
}

export interface Show {
  movie: string; // movie ID
  showDateTime: string;
  showPrice: number;
  occupiedSeats: Record<string, string>;
}

export interface ActiveShow extends Omit<Show, 'movie'> {
  movie: Movie;
}

export interface Booking {
  _id: string;
  user: string; // user ID
  show: string; // show ID
  amount: number;
  bookedSeats: string[];
  isPaid: boolean;
  paymentLink?: string;
}
