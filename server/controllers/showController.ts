import axios from "axios";
import { Request, Response } from "express";
import MovieModel from "../models/Movie.js";
import {
  ActiveShow,
  AddMovieRequestBody,
  DateTime,
  Movie,
  NowPlayingMovies,
  Show,
  TMDBMovieCredits,
  TMDBMovieDetail,
} from "../types/index.js";
import ShowModel from "../models/Show.js";

const fetchNowPlayingMovies = async (): Promise<NowPlayingMovies> => {
  try {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );
    const movies = data.results;
    return movies;
  } catch (error) {
    console.error("Error fetching now playing movies:", error);
    throw error;
  }
};

export const getNowPlayingMovies = async (req: Request, res: Response) => {
  try {
    const movies = await fetchNowPlayingMovies();
    res.json({ success: true, movies });
  } catch (error) {
    console.error("Error fetching now playing shows:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ success: false, message: errorMessage });
  }
};

const getMovieDetails = async (movieId: string): Promise<TMDBMovieDetail> => {
  try {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

const getMovieCredits = async (movieId: string): Promise<TMDBMovieCredits> => {
  try {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/credits`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    throw error;
  }
};

export const addMovie = async (
  req: Request<{}, {}, AddMovieRequestBody>,
  res: Response
) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;

    const existingMovie = await MovieModel.findById(movieId);
    if (existingMovie) {
      return res
        .status(400)
        .json({ success: false, message: "Movie already exists" });
    }
    const [movieDetails, movieCredits] = await Promise.all([
      getMovieDetails(movieId),
      getMovieCredits(movieId),
    ]);

    const movie: Movie = {
      _id: movieDetails.id + "",
      title: movieDetails.title,
      overview: movieDetails.overview,
      release_date: movieDetails.release_date,
      poster_path: movieDetails.poster_path,
      backdrop_path: movieDetails.backdrop_path,
      genres: movieDetails.genres,
      original_language: movieDetails.original_language,
      tagline: movieDetails.tagline ?? "",
      vote_average: movieDetails.vote_average,
      vote_count: movieDetails.vote_count,
      casts: movieCredits.cast.map((cast) => ({
        name: cast.name,
        profile_path: cast.profile_path ?? "",
      })),
      runtime: movieDetails.runtime,
    };

    const showsToCreate: Show[] = [];
    showsInput.forEach((element) => {
      const showDate = element.date;
      element.times.forEach((time: string) => {
        const showDateTime = new Date(`${showDate}T${time}`);
        showsToCreate.push({
          movie: movieId,
          showDateTime: showDateTime.toISOString(),
          showPrice,
          occupiedSeats: {},
        });
      });
    });

    if (showsToCreate.length) {
      await Promise.all([
        ShowModel.insertMany(showsToCreate),
        MovieModel.create(movie),
      ]);
    } else {
      await MovieModel.create(movie);
    }

    res.json({
      success: true,
      message: "Movie and shows added successfully",
    });
  } catch (error) {
    console.error("Error adding movie:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ success: false, message: errorMessage });
  }
};

export const getActiveShows = async (req: Request, res: Response) => {
  try {
    const activeShows = await ShowModel.find({
      showDateTime: { $gte: new Date() },
    })
      .populate("movie")
      .sort({ showDateTime: 1 });
    const uniqueShows = new Set(activeShows.map((show) => show.movie));
    res.json({ success: true, shows: Array.from(uniqueShows) });
  } catch (error) {
    console.error("Error fetching active shows:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ success: false, message: errorMessage });
  }
};

export const getActiveShow = async (req: Request, res: Response) => {
  try {
    const { movieId } = req.params;
    const activeShows = await ShowModel.find({
      movie: movieId,
      showDateTime: { $gte: new Date() },
    })

    const movie = await MovieModel.findById(movieId);
    const dateTime: Record<string, DateTime[]> = {};
    activeShows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];
      if (!dateTime[date]) {
        dateTime[date] = [];
      }
      dateTime[date].push({
        time: show.showDateTime + '',
        showId: show._id + '',
      });
    });

    res.json({ success: true, movie, dateTime });
  } catch (error) {
    console.error("Error fetching active show:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ success: false, message: errorMessage });
  }
}
