export interface Movie {
  _id: string;
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  genres: { id: number; name: string }[];
  casts: any; // Replace 'any' with proper cast interface type
  release_date: string;
  original_language: string;
  tagline: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
}

export interface Trailer {
  image: string;
  videoUrl: string;
}