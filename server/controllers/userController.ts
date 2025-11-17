import { clerkClient, getAuth } from "@clerk/express";
import { Request, Response } from "express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";

export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "show",
        populate: {
          path: "movie"
        }
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, message: errorMessage });
  }
};

export const updateFavoriteMovie = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const { movieId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await clerkClient.users.getUser(userId);

    if (!user.privateMetadata.favorites) {
      user.privateMetadata.favorites = [];
    }

    if (!(user.privateMetadata.favorites as string[]).includes(movieId)) {
      (user.privateMetadata.favorites as string[]).push(movieId);
    } else {
      user.privateMetadata.favorites = (
        user.privateMetadata.favorites as string[]
      ).filter((id) => id !== movieId);
    }

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: user.privateMetadata
    });
    res.json({ success: true, message: "Movie added to favorites" });
  } catch (error) {
    console.error("Error updating favorite movies:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, message: errorMessage });
}
};

export const getFavoriteMovies = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await clerkClient.users.getUser(userId);
        const favoriteMovieIds = user.privateMetadata.favorites || [];
        const movies = await Movie.find({ _id: { $in: favoriteMovieIds } });

        res.json({ success: true, movies });
    } catch (error) {
        console.error("Error updating favorite movies:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ success: false, message: errorMessage });
    }
}