import express from "express";
import {
  addMovie,
  getActiveShow,
  getActiveShows,
  getNowPlayingMovies,
} from "../controllers/showController.js";
import { protectAdminRoute } from "../middleware/auth.js";

const moviesRouter = express.Router();

moviesRouter.get("/now-playing", getNowPlayingMovies);
moviesRouter.post("/add", addMovie);
moviesRouter.get("/all", getActiveShows);
moviesRouter.get("/:movieId", getActiveShow);

export default moviesRouter;
